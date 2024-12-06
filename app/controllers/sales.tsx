import { json } from "@remix-run/node";
import { RegistrationInterface, SalesInterface } from "~/interfaces/interface";
import Cart from "~/modal/cart";
import Product from "~/modal/products";
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
    costprice,
    price,
    product,
  }: {
    intent: string;
    request: Request;
    product: string;
      costprice: string;
    attendant: string;
    totalAmount: string;
    amountPaid: string;
    balance: string;
    quantity: string;
      price: string;
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

              if (prod) {
                const { price, costprice } = prod;
                productsArray.push({
                  product: prod,
                  quantity,
                  price,
                  costprice,
                });
              }
            }



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

              // Update the product quantity in the inventory
              const productInInventory = await Product.findById(product);
              if (productInInventory) {
                const newQuantity = productInInventory.quantity - Number(quantity);
                await Product.findByIdAndUpdate(product, { quantity: newQuantity });
              }

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

  async  getSales({
    request,
    page,
    search_term,
    limit = 9
}: {
    request?: Request,
    page?: number | any;
    search_term?: string;
    limit?: number;
}):Promise<{
    user: RegistrationInterface[],
    sales:SalesInterface[],
    totalPages: number
} | any> {
    const skipCount = (page - 1) * limit; // Calculate the number of documents to skip

    // Define the search filter only once
    const searchFilter = search_term
        ? {
            $or: [
                {
                    name: {
                        $regex: new RegExp(
                            search_term
                                .split(" ")
                                .map((term) => `(?=.*${term})`)
                                .join(""),
                            "i"
                        ),
                    },
                },
               
            ],
        }
        : {};

    try {
        // Get session and user information
        const session = await getSession(request.headers.get("Cookie"));
        const token = session.get("email");
        const user = await Registration.findOne({ email: token });

        // Get total employee count and calculate total pages       
        const totalProductsCount = await Sales.countDocuments(searchFilter).exec();
        const totalPages = Math.ceil(totalProductsCount / limit);

        // Find users with pagination and search filter
        const sales = await Sales.find(searchFilter)
            .populate("category")
            .skip(skipCount)
            .limit(limit)
            .exec();


        return { user, sales, totalPages };
    } catch (error: any) {
        return {
            message: error.message,
            success: false,
            status: 500
        };
    }
}
  
}

const salesController = new SalesController();
export default salesController;


// const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const salesCount = await Sales.countDocuments({
//       createdAt: {
//         $gte: today
//       }
//     }).exec();
//     const dailySales = await Sales.find({
//       createdAt: {
//         $gte: today
//       }
//     }).exec();