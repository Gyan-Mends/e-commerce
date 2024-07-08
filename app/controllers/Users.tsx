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
            admin,
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
            admin:string,
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
                        admin,
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

    async DeleteUser(
        {
            intent,
            id,
        }:{
            intent:string,
            id:string,
        }
    ){
        if(intent === "delete"){
            const deleteUser = await Registration.findByIdAndDelete(id);
            if(deleteUser){
                return json({
                    message: "User delete successfully",
                    success: true,
                    status: 500,
                })
            }else{
                return json({
                    message: "Unable to delete user",
                    success: false,
                    status: 500
                })
            }
        }
    }

    async UpdateUser(
        {
            firstName,
            middleName,
            lastName,
            email,
            admin,
            phone,
            id,
            role,
            intent,
        }: {
            firstName: string,
            middleName: string,
            lastName: string,
            email: string,
            admin:string,
            phone: string,
            role: string,
            id:string,
            intent:string,
        }){
            try {
                if(intent === "update"){
                        const updateUser = await Registration.findByIdAndUpdate(id,{
                            firstName,
                            middleName,
                            lastName,
                            email,
                            phone,
                            role
                        })

                        if(updateUser){
                            return json({
                                message: "User updated successfully",
                                success: true,
                                status: 500
                            })
                        }else{
                            return json({
                                message: "Unable to update this record",
                                success: false,
                                status: 500
                            })
                        }
                    }else{
                        return json({
                            message: "Spelling of role must be Admin or Attendant",
                            success: false,
                            status: 500
                        })
                    }
              
                
            } catch (error:any) {
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
            const users = await Registration.find();
            
            
            return {user,users}
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