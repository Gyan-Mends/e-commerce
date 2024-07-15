import { json, redirect } from "@remix-run/node";
import Category from "~/modal/category";
import Registration from "~/modal/registration";
import { getSession } from "~/session"

class CategoryController {
    async DeleteCat(intent:string, id:string){
        // Delete Logic
        if (intent === "delete") {
            const deleteCategory = await Category.findByIdAndDelete(id);
            if (deleteCategory) {
                return json({ message: "Category deleted successfully", success: true }, { status: 200 });
            } else {
                return json({ message: "Category not found", success: false }, { status: 404 });
            }
        }
    }

    async UpdateCat({
        intent,
        id,
        name,
        description,
    }:{
        intent:string,
        id:string,
        name:string,
        description:string,
    }){
          // Update Logic
          if (intent === "update") {

            const updateCategory = await Category.findByIdAndUpdate(id, { name, description });
            if (updateCategory) {
                return json({ message: "Category updated successfully", success: true }, { status: 200 });
            } else {
                return json({ message: "Category not found", success: false }, { status: 404 });
            }

        }
    }

    async CategoryAdd(request: Request, name: string, description: string, seller: string, intent: string, id: string) {
        try {

           if(intent === "create"){
             // Checking if category already exists
             const categoryExistCheck = await Category.findOne({ seller, name });
             if (categoryExistCheck) {
                 return json({ message: "Category already exists", success: false }, { status: 400 });
             }
 
             // Saving data if category does not exist
             const category = new Category({
                 name,
                 description,
                 seller
             });
 
             const response = await category.save();
             if (response) {
                 return json({ message: "Category created successfully", success: true }, { status: 200 });
             }
 
           }
        } catch (error: any) {
            return json({ message: error.message, success: false }, { status: 400 });
        }
    }



    async CategoryFetch(request: Request) {
        try {
            // Checking if the user is logged in
            const session = await getSession(request.headers.get("Cookie"));
            const token = session.get("email");

            if (!token) {
                return redirect("/login");
            }

            // Getting the session id
            const sessionId = await Registration.findOne({ email: token }).select("_id email");
            const cats = await Category.find();
            const categoryCount = await Category.countDocuments()

            return { sessionId, cats,categoryCount};

        } catch (error) {
            console.error("Error in CategoryFetch:", error);
            throw error; // Re-throw the error to be caught by the caller
        }
    }
}

const category = new CategoryController
export default category