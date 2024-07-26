import { json, redirect } from "@remix-run/node";
import { commitSession, getSession } from "~/session";
import bcrypt from 'bcryptjs';
import Registration from "~/modal/registration";

class LoginController {
    async Logins({
        request,
        email,
        password,
        rememberMe
    }:{
        request: Request,
        email:string,
        password:string,
        rememberMe: string

    }) {
        try {
            const userCheck = await Registration.findOne({ email });
            const session = await getSession(request.headers.get("Cookie"));

            if (userCheck && await bcrypt.compare(password, userCheck.password)) {
                session.set("email", email);
                const cookie = await commitSession(session);

                if (userCheck.role === "admin") {
                    return redirect("/admin", { headers: { "Set-Cookie": cookie } });
                } else if (userCheck.role === "attendant") {
                    return redirect("/attendant", { headers: { "Set-Cookie": cookie } });
                } else {
                    return json({
                        message: "Invalid role selection",
                        success: false
                    });
                }
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
