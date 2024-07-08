import { json } from "@remix-run/node"
import Registration from "~/modal/registration"
import { getSession } from "~/session"
import bcrypt from 'bcryptjs'; // Import bcrypt
import Suppliers from "~/modal/suppliers";


class SuppliersController {
    async CreateSupplier(
        {
            firstName,
            middleName,
            lastName,
            email,
            admin,
            phone,
            intent,
        }: {
            firstName: string,
            middleName: string,
            lastName: string,
            email: string,
            admin: string,
            phone: string,
            intent: string,
        }) {

        try {
            if (intent === "create") {
                // checking if user exist
                const UserCheck = await Suppliers.findOne({ email: email })

                if (UserCheck) {
                    return json({
                        message: "Supplier with this email already exist",
                        success: false,
                        status: 500
                    })
                } else {

                    const user = new Suppliers({
                        firstName,
                        middleName,
                        lastName,
                        email,
                        admin,
                        phone,
                    })

                    // saving user details
                    const saveUserDetails = await user.save()

                    if (saveUserDetails) {
                        return json({
                            message: "Supplier created successfully",
                            success: true,
                            status: 500
                        })
                    } else {
                        return json({
                            message: "Unable to create Supplier",
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

    async DeleteSupplier(
        {
            intent,
            id,
        }: {
            intent: string,
            id: string,
        }
    ) {
        if (intent === "delete") {
            const deleteUser = await Suppliers.findByIdAndDelete(id);
            if (deleteUser) {
                return json({
                    message: "Supplier delete successfully",
                    success: true,
                    status: 500,
                })
            } else {
                return json({
                    message: "Unable to delete Supplier",
                    success: false,
                    status: 500
                })
            }
        }
    }

    async UpdateSupplier(
        {
            firstName,
            middleName,
            lastName,
            email,
            admin,
            phone,
            id,
            intent,
        }: {
            firstName: string,
            middleName: string,
            lastName: string,
            email: string,
            admin: string,
            phone: string,
            id: string,
            intent: string,
        }) {
        try {
            if (intent === "update") {
                const updateUser = await Suppliers.findByIdAndUpdate(id, {
                    firstName,
                    middleName,
                    lastName,
                    email,
                    phone,

                })

                if (updateUser) {
                    return json({
                        message: "Supplier updated successfully",
                        success: true,
                        status: 500
                    })
                } else {
                    return json({
                        message: "Unable to update this record",
                        success: false,
                        status: 500
                    })
                }
            } else {
                return json({
                    message: "wrong intent",
                    success: false,
                    status: 500
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

    async FetchSuppliers({ request }: { request: Request }) {
        try {
            const session = await getSession(request.headers.get("Cookie"));
            const token = session.get("email");
            const user = await Registration.findOne({ email: token });
            const suppliers = await Suppliers.find();


            return { user, suppliers }
        } catch (error: any) {
            return json({
                message: error.message,
                success: true,
                status: 500
            })
        }
    }
}

const suppliersController = new SuppliersController
export default suppliersController