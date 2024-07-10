import { json } from "@remix-run/node"
import Cart from "~/modal/cart";
import Sales from "~/modal/sales"

class SalesContoller {

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
    quantity: string
  }) {
    if (intent === "addCartToSales") {
      try {
          if (Number(balance) <= 0) {
              // Assuming products is an array of objects with product and quantity
              const productsArray = []; // Initialize an array to store product objects
  
              const cart = await Cart.find()
  
              for (const item of cart) {
                  const { product: prod, quantity } = item; // Destructure product and quantity from item
                  productsArray.push({ product: prod, quantity });
              }
  
              console.log("Products array after loop:", productsArray); // Debugging: log the products array after loop
  
              const sales = new Sales({
                  products: productsArray, // Assign the array of products
                  attendant,
                  totalAmount,
                  amountPaid,
                  balance,
              });
  
              const addSales = await sales.save();
              return addSales;
          } else {
              return json({
                  message: "Full payment must be made",
                  success: false,
                  status: 400,
              });
          }
      } catch (error) {
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



  async salesFetch({
    request,
    totalAmount,
    amountPaid,
  }: {
    request: Request,
    totalAmount: string,
    amountPaid: string,
  }) {
    const balance = Number(totalAmount) - Number(amountPaid)
    return { balance }
  }
}

const salesController = new SalesContoller
export default salesController