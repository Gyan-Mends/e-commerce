import { json } from "@remix-run/node";
import Cart from "~/modal/cart";
import Refund from "~/modal/refund";
import Registration from "~/modal/registration";
import Sales from "~/modal/sales";
import { getSession } from "~/session";

class RefundController {
    async ApplyRefund({
        intent,
        request,
        attendant,
        totalAmount,
        amountPaid,
        balance,
        product,
        quantity,
    }: {
        intent: string;
        request: Request;
        product: string[];  // Accepting array of strings for products
        quantity: string[]; // Accepting array of strings for quantities
        attendant: string;
        totalAmount: string;
        amountPaid: string;
        balance: string;
    }) {
        if (intent === "refund") {
            try {
                const session = await getSession(request.headers.get("Cookie"));
                const token = session.get("email");
                const user = await Registration.findOne({ email: token });

                // Combine products and quantities into an array of objects
                const products = product.map((productId, index) => ({
                    product: productId,
                    quantity: quantity[index],
                }));

                const refund = new Refund({
                    products,
                    attendant,
                    totalAmount,
                    amountPaid,
                    balance,
                });

                const addRefund = await refund.save();
                if (addRefund) {
                    return json({
                        message: "Refund made successfully",
                        success: true,
                        status: 200,
                    });
                } else {
                    return json({
                        message: "Unable to make refund",
                        success: false,
                        status: 400,
                    });
                }
            } catch (error: any) {
                return json({
                    message: error.message,
                    success: false,
                    status: 500,
                });
            }
        }
    }



}

const refundController = new RefundController
export default refundController