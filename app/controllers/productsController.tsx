import { json, redirect } from "@remix-run/node"
import Category from "~/modal/category"
import Product from "~/modal/products"
import Registration from "~/modal/registration"
import { getSession } from "~/session"
import category from "./categoryController"
import { ProductInterface, RegistrationInterface } from "~/interfaces/interface"

class ProductsController {
    async ProductAdd(
        request: Request,
        name: string,
        price: string,
        quantity: string,
        category: string,
        base64Image: string,
        low_stock: string,
        description: string,
        seller: string,
        costPrice: string,
        intent: string
    ) {
        try {
            if (intent === "create") {
                // Check if the porduct does not exist
                const ProductCheck = await Product.findOne({ name: name })
                if (ProductCheck) {
                    return json({ message: "Product already exist. Just update it quantity", success: false }, { status: 400 })
                }

                //saving the data
                const products = new Product({
                    name,
                    price,
                    quantity,
                    category,
                    image: base64Image,
                    low_stock,
                    description,
                    seller,
                    costPrice
                })

                if (low_stock >= quantity) {
                    return json({ message: "Low stock must be less than quantity", success: false }, { status: 400 })
                } else if (price < costPrice) {
                    return json({ message: "Runnig at loss, selling price must be equal to or more than cost price", success: false }, { status: 400 })
                } else {
                    const response = await products.save();

                    if (response) {
                        return json({ message: "Poduct saved successfully", success: true }, { status: 200 })
                    } else {
                        return json({ message: "Uable to save product", success: false }, { status: 400 })

                    }
                }

            } else {
                return json({
                    message: "Wrong intent",
                    success: false,
                    status: 400
                })

            }


        } catch (error: any) {
            return json({ message: error.message, success: false }, { status: 400 })

        }

    }

    async UpdateProduct(
        {
            name,
            price,
            quantity,
            category,
            base64Image,
            low_stock,
            description,
            seller,
            costPrice,
            intent,
            id,
        }: {
            name: string,
            price: string,
            quantity: string,
            category: string,
            base64Image: string,
            low_stock: string,
            description: string,
            seller: string,
            costPrice: string
            intent: string,
            id: string
        }
    ) {
        try {
            if (intent === "updateProduct") {
                const update = await Product.findByIdAndUpdate(id, {
                    name,
                    price,
                    quantity,
                    category,
                    base64Image,
                    low_stock,
                    description,
                    seller,
                    costPrice,
                })
                if (update) {
                    return json({
                        message: "Product update successfully",
                        success: true,
                        status: 200
                    })
                } else {
                    return json({
                        message: "Unable to update product",
                        success: false,
                        status: 200
                    })
                }
            } else {
                return json({
                    message: "Wrong intent",
                    success: false,
                    status: 400
                })
            }
        } catch (error: any) {
            return json({ message: error.message, success: false }, { status: 400 })

        }

    }

    async Delete({
        intent,
        id
    }: {
        intent: string,
        id: string
    }) {
        if (intent === "delete") {
            const deleteProduct = await Product.findByIdAndDelete(id);
            if (deleteProduct) {
                return json({
                    message: "Product deleted",
                    success: true,
                    status: 500
                })
            } else {
                return json({
                    message: "Unable to deete product",
                    success: false,
                    status: 500
                })
            }
        } else {
            return json({
                message: "Wrong intent",
                success: false,
                status: 500
            })
        }
    }

    async  FetchProducts({
        request,
        page,
        search_term,
        limit = 9
    }: {
        request: Request,
        page: number;
        search_term: string;
        limit?: number;
    }):Promise<{
        user: RegistrationInterface[],
        products:ProductInterface[],
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
            const totalEmployeeCount = await Product.countDocuments(searchFilter).exec();
            const totalPages = Math.ceil(totalEmployeeCount / limit);
    
            // Find users with pagination and search filter
            const products = await Product.find(searchFilter)
                .skip(skipCount)
                .limit(limit)
                .exec();
    
    
            return { user, products, totalPages };
        } catch (error: any) {
            return {
                message: error.message,
                success: false,
                status: 500
            };
        }
    }
}

const productsController = new ProductsController
export default productsController