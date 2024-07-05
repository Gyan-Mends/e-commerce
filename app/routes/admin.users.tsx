import { Button, Input, Select, SelectItem } from "@nextui-org/react"
import { ActionFunction, json, LoaderFunction } from "@remix-run/node"
import { Form, useActionData, useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"
import PlusIcon from "~/components/icons/PlusIcon"
import { SearchIcon } from "~/components/icons/SearchIcon"
import CreateModal from "~/components/modal/createModal"
import { errorToast, successToast } from "~/components/toast"
import usersController from "~/controllers/Users"
import AdminLayout from "~/layout/adminLayout"

const Users = () => {
    const [isCreateModalOpened, setIsCreateModalOpened] = useState(false)
    const [base64Image, setBase64Image] = useState()
    const actionData = useActionData<any>()
    const { user } = useLoaderData<{ user: { _id: string } }>()

    const handleCreateModalClosed = () => {
        setIsCreateModalOpened(false)
    }

    useEffect(() => {
        if(actionData){
            if(actionData.success) {
                successToast(actionData.message)
            }else{
                errorToast(actionData.message)
            }
        }
    },[actionData])
    return (
        <AdminLayout pageName="Users Management">
            <div className="flex z-0 justify-between gap-2">
                <Toaster position="top-center" />
                <div>
                    <Input
                        placeholder="Search product..."
                        startContent={<SearchIcon className="" />}
                        classNames={{
                            inputWrapper: "h-14 lg:w-80",
                        }}
                    />
                </div>
                <div>
                    <Button variant="flat" onClick={() => {
                        setIsCreateModalOpened(true)
                    }} color="primary" className="h-14 font-poppins text-md">
                        <PlusIcon className="h-6 w-6" />Create User
                    </Button>
                </div>
            </div>

            {/* Create Modal */}
            <CreateModal
                modalTitle="Create New User"
                isOpen={isCreateModalOpened}
                onOpenChange={handleCreateModalClosed}
            >
                {(onClose) => (
                    <Form method="post">
                        <Input
                            label="First name"
                            isRequired
                            isClearable
                            name="firstname"
                            placeholder=" "
                            type="text"
                            labelPlacement="outside"
                            classNames={{
                                label: "font-poppins text-sm text-default-100",
                            }}
                        />
                        <div className="flex gap-4">
                            <Input
                                label="Middle Name"
                                name="middlename"
                                placeholder=" "
                                isClearable
                                type="text"
                                labelPlacement="outside"
                                classNames={{
                                    label: "font-poppins text-sm text-default-100",
                                    inputWrapper: "mt-2"
                                }}
                            />
                            <Input
                                label="Last Name"
                                isRequired
                                name="lastname"
                                isClearable
                                placeholder=" "
                                type="text"
                                labelPlacement="outside"
                                classNames={{
                                    label: "font-poppins text-sm text-default-100",
                                    inputWrapper: "mt-2"
                                }}
                            />
                        </div>
                        <Input
                            label="Email"
                            isRequired
                            name="email"
                            isClearable
                            placeholder=" "
                            type="text"
                            labelPlacement="outside"
                            classNames={{
                                label: "font-poppins text-sm text-default-100",
                                inputWrapper: "mt-2"
                            }}
                        />
                        <div className="flex gap-4">
                            <Input
                                label=" Phone"
                                isRequired
                                name="phone"
                                isClearable
                                placeholder=" "
                                type="text"
                                labelPlacement="outside"
                                classNames={{
                                    label: "font-poppins text-sm text-default-100",
                                    inputWrapper: "mt-2"
                                }}
                            />
                            <Input
                                label=" Password"
                                isRequired
                                name="password"
                                isClearable
                                placeholder=" "
                                type="text"
                                labelPlacement="outside"
                                classNames={{
                                    label: "font-poppins text-sm text-default-100",
                                    inputWrapper: "mt-2"
                                }}
                            />
                        </div>
                        <div className="pt-2">
                            <Select
                                label="Role"
                                labelPlacement="outside"
                                placeholder=" "
                                isRequired
                                name="role"
                            >
                                {[
                                    { key: "admin", value: "admin", display_name: "Admin" },
                                    { key: "attendant", value: "attendant", display_name: "Attendant" },
                                ].map((role) => (
                                    <SelectItem key={role.key}>{role.display_name}</SelectItem>
                                ))}
                            </Select>
                        </div>

                        <div className="pt-2">
                            <label className="font-poppins block text-sm" htmlFor="">Image</label>
                            <input
                                name="image"
                                required
                                placeholder=" "
                                className="font-poppins mt-2 rounded-lg h-10 w-[25vw] bg-default-100"
                                type="file"
                                onChange={(event: any) => {
                                    const file = event.target.files[0];
                                    if (file) {
                                        const reader = new FileReader()
                                        reader.onloadend = () => {
                                            setBase64Image(reader.result)
                                        }
                                        reader.readAsDataURL(file)
                                    }
                                }}
                            />
                        </div>

                        <input name="admin" value="" type={user._id}/>
                        <input name="intent" value="create" type="" />
                        <input name="base64Image" value={base64Image} type="" />

                        <div className="flex justify-end gap-2 mt-10 font-poppins">
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Close
                            </Button>
                            <button type="submit" className="bg-primary-400 rounded-xl bg-opacity-20 text-primary text-sm font-poppins px-4">
                                Submit
                            </button>
                        </div>
                    </Form>
                )}
            </CreateModal>
        </AdminLayout>
    )
}

export default Users

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const firstName = formData.get("firstname") as string;
    const lastName = formData.get("lastname")  as string;
    const middleName = formData.get("middlename")  as string;
    const email = formData.get("email")  as string;
    const password = formData.get("password")  as string;
    const phone = formData.get("phone")  as string;
    const base64Image = formData.get("base64Image")  as string;
    const role = formData.get("role")  as string;
    const admin = formData.get("admin")  as string;
    const intent = formData.get("intent")  as string;

    switch (intent) {
        case "create":
            const user = await usersController.CreateUser({
                firstName,
                middleName,
                lastName,
                email,
                password,
                phone,
                role,
                intent,
                base64Image
            })
            return user

        default:
            return json({
                message: "Bad request",
                success: false,
                status: 400
            })
    }
}

export const loader:LoaderFunction = async ({request}) => {
    const {user} = await usersController.FetchUsers({request})
        console.log(user);
        
    return {user}
}