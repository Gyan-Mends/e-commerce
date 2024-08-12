import { json } from "@remix-run/node";
import Cart from "~/modal/cart";
import Registration from "~/modal/registration";
import Sales from "~/modal/sales";
import { getSession } from "~/session";

class SalesController {
  async AddCartToSales({
    intent,
    request,
    attendant,
    totalAmount,
    amountPaid,
    balance,
    quantity,
    product,
  }: {
    intent: string;
    request: Request;
    product: string;
    attendant: string;
    totalAmount: string;
    amountPaid: string;
    balance: string;
    quantity: string;
  }) {
    if (intent === "addCartToSales") {
      try {
        const session = await getSession(request.headers.get("Cookie"));
        const token = session.get("email");
        const user = await Registration.findOne({ email: token });
        const carts = await Cart.find({ attendant: user?._id }).populate("product");

        if (carts.length === 0) {
          return json({
            message: "There is no item in your cart, can't proceed to checkout",
            success: false,
            status: 400,
          });
        } else {
          if (Number(balance) <= 0) {
            const productsArray = [];

            // Fetch the cart items for the specific user
            const cartItems = await Cart.find({ attendant: user?._id }).populate("product");

            for (const item of cartItems) {
              const { product: prod, quantity } = item;
              productsArray.push({ product: prod, quantity });
            }

            console.log("Products array after loop:", productsArray);

            const sales = new Sales({
              products: productsArray,
              attendant,
              totalAmount,
              amountPaid,
              balance,
            });

            const addSales = await sales.save();
            if (addSales) {
              const emptyCart = await Cart.deleteMany({ attendant: user });
              if (emptyCart) {
                return json({
                  message: "Sales made successfully",
                  success: true,
                  status: 200, // Changed status to 200 for success
                });
              }
            } else {
              return json({
                message: "Unable to make sales",
                success: false,
                status: 400,
              });
            }
          } else {
            return json({
              message: "Full payment must be made",
              success: false,
              status: 400,
            });
          }
        }
      } catch (error: any) {
        return json({
          message: error.message,
          success: false,
          status: 500,
        });
      }
    } else {
      return json({
        message: "Wrong intent",
        success: false,
        status: 500,
      });
    }
  }

  async salesFetch({ request }: { request: Request }) {
    const session = await getSession(request.headers.get("Cookie"));
    const token = session.get("email");
    const user = await Registration.findOne({ email: token });
    const sales = await Sales.find({ attendant: user?._id })
      .populate("products.product")
      .populate("attendant")
      .exec();
    const allSales = await Sales.find()
      .populate("products.product")
      .populate("attendant")
      .exec();
      
    

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const salesCount = await Sales.countDocuments({
      createdAt: {
        $gte: today
      }
    }).exec();
    const dailySales = await Sales.find({
      createdAt: {
        $gte: today
      }
    }).exec();

    return {allSales, sales, salesCount,dailySales };
  }
  
}

const salesController = new SalesController();
export default salesController;
