import { json } from "@remix-run/node"
import Registration from "~/modal/registration"
import { getSession } from "~/session"
import bcrypt from 'bcryptjs'; // Import bcrypt


class UsersController {
    async CreateUser(
        {
            firstName,
            middleName,
            lastName,
            email,
            password,
            phone,
            role,
            intent,
            base64Image
        }: {
            firstName: string,
            middleName: string,
            lastName: string,
            email: string,
            password: string,
            phone: string,
            role: string,
            intent:string,
            base64Image: string
        }) {

        try {
            if (intent === "create") {
                // checking if user exist
                const UserCheck = await Registration.findOne({ email: email })

                if (UserCheck) {
                    return json({
                        message: "User with this email already exist",
                        success: false,
                        status: 500
                    })
                } else {
                    const hashedPassword =await bcrypt.hash(password,10) // hashing password

                    const user = new Registration({
                        firstName,
                        middleName,
                        lastName,
                        email,
                        password:hashedPassword,
                        phone,
                        role,
                        image: base64Image
                    })

                    // saving user details
                    const saveUserDetails = await user.save()

                    if (saveUserDetails) {
                        return json({
                            message: "User created successfully",
                            success: true,
                            status: 500
                        })
                    } else {
                        return json({
                            message: "Unable to create user",
                            success: false,
                            status: 500
                        })
                    }
                }

            } else {
                return json({
                    message: "wrong intent",
                    success: false,
                    status: 400
                })
            }
        } catch (error: any) {
            return json({
                message: error.message,
                success: false,
                status: 500
            })
        }
    }

    async FetchUsers({request}:{request:Request}){
        try {
            const session =await getSession(request.headers.get("Cookie"));
            const token = session.get("email"); 
            const user = await Registration.findOne({email:token});
            
            
            return {user}
        } catch (error:any) {
            return json({
                message: error.message,
                success: true,
                status: 500
            })
        }
    }
}

const usersController = new UsersController
export default usersController