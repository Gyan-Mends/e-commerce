import { Button, Input } from "@nextui-org/react"
import { Form } from "@remix-run/react"
import { useState } from "react"
import { Toaster } from "react-hot-toast"
import PlusIcon from "~/components/icons/PlusIcon"
import { SearchIcon } from "~/components/icons/SearchIcon"
import CreateModal from "~/components/modal/createModal"
import AdminLayout from "~/layout/adminLayout"

const Users = () => {
    const [isCreateModalOpened, setIsCreateModalOpened] = useState(false)

    const handleCreateModalClosed = () => {
        setIsCreateModalOpened(false)
    }
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
                                inputWrapper:"mt-2"
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
                                inputWrapper:"mt-2"
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
                                inputWrapper:"mt-2"
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
                                inputWrapper:"mt-2"
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
                                inputWrapper:"mt-2"
                            }}
                        />
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
                                                // setBase64Image(reader.result)
                                            }
                                            reader.readAsDataURL(file)
                                        }
                                    }}
                                />
                            </div>

                        <input name="seller" value="" type="" />

                       

                        <div className="flex justify-end gap-2 mt-10 font-poppins">
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Close
                            </Button>
                            <button type="submit"  className="bg-primary-400 rounded-xl bg-opacity-20 text-primary text-sm font-poppins px-4">
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