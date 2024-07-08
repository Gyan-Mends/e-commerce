import { Button, Checkbox, Input, Select, SelectItem } from "@nextui-org/react";
import { ActionFunction } from "@remix-run/node";
import { Form, Link, Links, useActionData } from "@remix-run/react";
import { useTheme } from "next-themes"
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { LockIcon } from "~/components/icons/LockIcon";
import { MailIcon } from "~/components/icons/MailIcon";
import { errorToast, successToast } from "~/components/toast";
import login from "~/controllers/login";
import illustration from "~/components/illustration/loginIllustration.png"
import SunIcon from "~/components/icons/SunIcon";
import MoonIcon from "~/components/icons/MoonIcon";

const Login = () => {
    const { theme, setTheme } = useTheme();
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
        <div className={`lg:grid lg:grid-cols-2 h-[100vh] overflow-y-hidden ${theme === "dark" ? "bg-slate-950" : "bg-slate-gray-200"}`}>
            <Toaster position="top-center" />

            <div>
                <Button color="primary" className="m-2" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    {theme === "dark" ? (
                        <MoonIcon className="text-slate-950" />

                    ) : (
                        <SunIcon className="text-white" />
                    )}
                </Button>
                <div className="h-full w-full flex flex-col items-center justify-center">
                    <p className="font-poppins text-5xl ">Login To </p>
                    <p className="font-poppins text-5xl  mt-2">Your Account </p>
                    <Form method="post" className="mt-10">
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
                            isRequired
                            isClearable
                            type="email"
                            placeholder="example@gmail.com"
                            classNames={{
                                label: "font-poppins text-sm -mt-2",
                                inputWrapper: "w-[90vw] lg:w-[30vw] text-sm font-poppins h-14 mt-6 bg-opacity-70"
                            }}
                            startContent={
                                <MailIcon className="w-6 h-6 text-gray-500" />
                            }
                        />
                        <Input
                            name="password"
                            isRequired
                            label="Password"
                            labelPlacement="outside"
                            isClearable
                            type="password"
                            className="mt-8"
                            placeholder="*******************"
                            classNames={{
                                label: "font-poppins text-sm -mt-2",
                                inputWrapper: "w-[90vw] lg:w-[30vw] text-sm mt-6 font-poppins h-14 bg-opacity-70"
                            }}
                            startContent={
                                <LockIcon className="w-6 h-6 text-gray-500" />
                            }
                        />

                        <div className="flex justify-between mt-4">
                            <Checkbox>Remember me</Checkbox>
                            <Link to=""><p>Forgot password?</p></Link>
                        </div>

                        <button className="w-[90vw] bg-primary rounded-lg lg:w-[30vw] h-14 mt-10 text-xl font-poppins">Login</button>

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

    const signin = await login.Login(request,role, email, password)

    return signin
}