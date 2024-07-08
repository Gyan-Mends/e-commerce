import { toTime } from "@internationalized/date";
import { json } from "@remix-run/node"
import Cart from "~/modal/cart"
import Product from "~/modal/products";
import Registration from "~/modal/registration";
import { getSession } from "~/session";

class CartController {
    async AddToCart({
        request,
        intent,
        quantity,
        product,
        attendant,
        price
    }: {
        intent: string,
        quantity: string,
        product: string,
        attendant: string,
        price: string,
        request: Request,
    }) {
        try {
            if (intent === "addToCart") {
                // Check if product has been added to cart already
                const productCheck = await Cart.findOne({ product: product, attendant: attendant });
                if (productCheck) {
                   console.log("opps");
                   return null
                   
                } else {
                    // Add a new product to the cart
                    const cart = new Cart({
                        quantity,
                        product,
                        attendant,
                        price
                    });

                    const addToCart = await cart.save();

                    if (addToCart) {
                        // Update the product quantity in the inventory
                        const productInInventory = await Product.findById(product);
                        if (productInInventory) {
                            const newQuantity = productInInventory.quantity - Number(quantity);
                            await Product.findByIdAndUpdate(product, { quantity: newQuantity });
                        }

                        return json({
                            message: "Item added to cart",
                            success: true
                        });
                    }
                }
            } else {
                return json({
                    message: "Wrong intent",
                    success: false,
                    status: 500
                });
            }
        } catch (error: any) {
            return json({
                message: "An error occurred",
                success: false,
                error: error.message
            });
        }
    }

    async DeleteItem(
        {
            intent,
            id,
        }: {
            intent: string,
            id: string,
        }
    ) {
        if (intent === "delete") {
            const deleteUser = await Cart.findByIdAndDelete(id);
            if (deleteUser) {
                return json({
                    message: "Item delete successfully",
                    success: true,
                    status: 500,
                })
            } else {
                return json({
                    message: "Unable to delete Item",
                    success: false,
                    status: 500
                })
            }
        }
    }
    // async quantityDeduction(request: Request, quantity: string) {


    //     if (user) {
    //         if (cart) {
    //             // Assuming the cart has a list of products, and each product has a reference to its details and a quantity
    //             const cartProducts = await Product.find({ _id: cart.attendant });

    //             if (cartProducts.length > 0) {
    //                 // Assuming 'originalQuantity' is available for each product in cartProducts
    //                 cartProducts.forEach(async (cartProduct) => {
    //                     const product = await Product.findByIdAndUpdate(cartProduct._id, {
    //                         quantity
    //                     }); // Fetch the actual product details
    //                     if (product) {
    //                         const updatedQuantity = product.quantity - cartProduct.quantity;
    //                         // Update the product quantity in the database
    //                         await Product.updateOne({ quantity: updatedQuantity });
    //                         console.log(`${updatedQuantity}`);
    //                     }
    //                 });
    //             } else {
    //                 return json({
    //                     message: "No products found in the cart",
    //                     success: false,
    //                     status: 400
    //                 });
    //             }
    //         } else {
    //             return json({
    //                 message: "User not found in cart",
    //                 success: false,
    //                 status: 400
    //             });
    //         }
    //     } else {
    //         return json({
    //             message: "User not found",
    //             success: false,
    //             status: 400
    //         });
    //     }


    // }

    async FetchCart(request: Request) {
        const session = await getSession(request.headers.get("Cookie"));
        const token = session.get("email");
        const user = await Registration.findOne({ email: token });
        const carts = await Cart.find({ attendant: user?._id }).populate("product");

        const totalQuantity = carts.reduce((acc, cart) => {
            return acc + Number(cart.quantity); // Ensure quantity is treated as a number
        }, 0);

        const totalPrice = carts.reduce((acc, cart) => {
            return acc + Number(cart.price); // Ensure quantity is treated as a number
        }, 0);

        return { carts, totalQuantity, totalPrice };
    }

}
const cartController = new CartController
export default cartController