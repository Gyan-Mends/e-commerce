import { Checkbox, Input, Select, SelectItem } from "@nextui-org/react";
import { ActionFunction } from "@remix-run/node";
import { Form, Link, Links, useActionData } from "@remix-run/react";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { errorToast, successToast } from "~/components/toast";
import login from "~/controllers/login";
import illustration from "~/components/illustration/loginIllustration.png"

const Login = () => {
    const actionData = useActionData<any>()

    useEffect(() => {
        if (actionData) {
            if (actionData.success) {
                successToast(actionData.message)
            } else {
                errorToast(actionData.message)
            }
        }
    }, [actionData])
  
    return (
        <div className={`lg:grid lg:grid-cols-2 h-[100vh] bg-slate-950 overflow-y-hidden `}>
            <Toaster position="top-center" />
            <div className="h-[100vh] w-full flex items-center justify-center ">
                <div className="bg-slate-900 p-6 rounded-2xl lg:w-[30vw] border border-white/5 relative">
                    <p className="font-poppins text-4xl font-bold">Login To </p>
                    <p className="font-poppins text-4xl font-bold mt-2">Your Account </p>
                    <Form method="post" className="mt-16">
                        <Select
                            label="Role"
                            labelPlacement="outside"
                            placeholder=" "
                            isRequired
                            name="role"
                        >
                            {[
                                { key: "Admin", value: "Admin", display_name: "Admin" },
                                { key: "Attendant", value: "Attendant", display_name: "Attendant" },
                            ].map((role) => (
                                <SelectItem key={role.key}>{role.display_name}</SelectItem>
                            ))}
                        </Select>
                        <Input
                            name="email"
                            label="Email"
                            labelPlacement="outside"
                            placeholder=" "
                            isRequired
                            isClearable
                            type="email"
                            classNames={{
                                label: "font-poppins text-sm",
                                inputWrapper: "  text-sm font-poppins  mt-4 bg-opacity-70"
                            }}

                        />
                        <Input
                            name="password"
                            isRequired
                            label="Password"
                            labelPlacement="outside"
                            isClearable
                            type="password"
                            className="mt-8"
                            placeholder=" "
                            classNames={{
                                label: "font-poppins text-sm ",
                                inputWrapper: " text-sm mt-4 font-poppins  bg-opacity-70"
                            }}

                        />

                        <div className="flex justify-between mt-4 gap-4">
                            <Checkbox>Remember me</Checkbox>
                            <Link to=""><p className="text-primary">Forgot password?</p></Link>
                        </div>
                        <button className=" bg-primary rounded-lg w-full h-10  mt-10 text-xl font-poppins">Login</button>
                    </Form>
                </div>
            </div>
            <div className="h-full hidden lg:flex items-center justify-center flex   w-full">
                <img src={illustration} alt="Login illustration" />
            </div>
        </div>
    )
}

export default Login

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as string

    const signin = await login.Login(request, role, email, password)

    return signin
}