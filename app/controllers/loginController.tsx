import { json, redirect } from "@remix-run/node";
import Registration from "~/modal/registration";
import { commitSession, getSession } from "~/session";
import bcrypt from 'bcryptjs'; // Import bcrypt

class LoginController {

    async Login(request: Request, email: string, password: string) {
        try {
            //checking if user exist
            const userCheck = await Registration.findOne({ email: email });
            // decrypting the password
            if (userCheck && await bcrypt.compare(password, userCheck.password)) {
                const session = await getSession(request.headers.get("Cookie"));
                session.set("email", email);

                // Redirect to a protected route or home page after successful login
                return redirect("/admin", {
                    headers: {
                        "Set-Cookie": await commitSession(session),
                    },

                });
            }else{
                return json({message:"Invalid email or password", success:false}, {status:400})
            }
        } catch (error) {
            return json({message:"somthing went wrong, check your connection", success: false}, {status:200})
        }
    }
}

const login = new LoginController;
export default login;