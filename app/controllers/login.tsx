import { json, redirect } from "@remix-run/node";
import { commitSession, getSession } from "~/session";
import bcrypt from 'bcryptjs'; 
import Registration from "~/modal/registration";

class LoginController {
    async Login(request: Request, role: string, email: string, password: string) {
        try {
            // checking if user exists
            const userCheck = await Registration.findOne({ email: email });
            const session = await getSession(request.headers.get("Cookie"));
            session.set("email", email)

            if (userCheck && await bcrypt.compare(password, userCheck.password) && role == "Admin") {
                // Redirect to a protected route or home page after successful login
                return redirect("/admin", {
                    headers: {
                        "Set-Cookie": await commitSession(session),
                    },
                });

            } else if (userCheck && await bcrypt.compare(password, userCheck.password) && role == "Attendant") {
                return redirect("/attendant", {
                    headers: {
                        "Set-Cookie": await commitSession(session),
                    },
                });
            } else {
                return json({ message: "Invalid email or password", success: false }, { status: 400 });
            }
        } catch (error) {
            return json({ message: "Something went wrong, check your connection", success: false }, { status: 500 });
        }
    }
}

const login = new LoginController();
export default login;
