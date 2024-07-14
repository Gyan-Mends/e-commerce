import {
    button,
    Checkbox,
    Input,
    Select,
    SelectItem
} from "@nextui-org/react";
import {
    ActionFunction
} from "@remix-run/node";
import {
    Form,
    Link,
    useActionData
} from "@remix-run/react";
import {
    useEffect,
    useState
} from "react";
import {
    Toaster
} from "react-hot-toast";
import {
    errorToast,
    successToast
} from "~/components/toast";
import login from "~/controllers/login";
import illustration from "~/components/illustration/loginIllustration.png"
import { EyeSlashFilledIcon } from "~/components/icons/EyeFilled";
import { EyeFilledIcon } from "~/components/icons/EyeSlash";

const Login = () => {
    const actionData = useActionData<any>()
    const [isVisible, setIsVisible] = useState(false)
    useEffect(() => {
        if (actionData) {
            if (actionData.success) {
                successToast(actionData.message)
            } else {
                errorToast(actionData.message)
            }
        }
    }, [actionData])

    const handleVisibility = (event: any) => {
        event.preventDefault()
        setIsVisible(!isVisible)
    }

    return (
        <div className={`lg:grid lg:grid-cols-2 h-[100vh] dark:bg-slate-950 overflow-y-hidden `}>
            <Toaster position="top-center" />
            <div className="h-[100vh] w-full flex items-center justify-center ">
                <div className="dark:bg-slate-900 shadow-lg p-6 rounded-2xl lg:w-[30vw] border border-white/5 relative">
                    <p className=" font-montserrat font-semibold text-3xl">Login To </p>
                    <p className="font-montserrat font-semibold text-3xl mt-2">Your Account </p>
                    <Form method="post" className="mt-16">
                        <Select
                            label="Role"
                            labelPlacement="outside"
                            placeholder=" "
                            isRequired
                            name="role"
                            classNames={{
                                base: "shadow-none  font-nunito rounded-xl",
                                label: "font-nunito text-sm"
                            }}
                        >
                            {[
                                { key: "Admin", value: "Admin", display_name: "Admin" },
                                { key: "Attendant", value: "Attendant", display_name: "Attendant" },
                            ].map((role) => (
                                <SelectItem className="font-nunito text-sm" key={role.key}>{role.display_name}</SelectItem>
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
                                label: "font-nunito text-sm",
                                inputWrapper: " text-sm font-nunito  mt-4 bg-opacity-70"
                            }}

                        />
                        <Input
                            name="password"
                            isRequired
                            label="Password"
                            labelPlacement="outside"
                            type={isVisible ? "text" : "password"}
                            className="mt-8"
                            placeholder=" "
                            classNames={{
                                label: "font-nunito text-sm ",
                                inputWrapper: " text-sm mt-4 font-nunito bg-opacity-70"
                            }}
                            endContent={
                                <button
                                    className="focus:outline-none"
                                    onClick={handleVisibility}
                                >
                                    {isVisible ? (
                                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                        />

                        <div className="flex justify-between mt-4 gap-4">
                            <Checkbox ><p className="font-nunito text-sm">Remember me</p></Checkbox>
                            <Link to=""><p className="text-primary font-nunito text-sm">Forgot password?</p></Link>
                        </div>
                        <button className=" bg-primary rounded-lg w-full h-10  mt-10 font-semibold font-montserrat text-white">Login</button>
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