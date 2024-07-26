import { Button, Input, Select, SelectItem, TableCell, TableRow, User } from "@nextui-org/react"
import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node"
import { Form, useActionData, useLoaderData, useNavigate, useNavigation, useSubmit } from "@remix-run/react"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"
import { DeleteIcon } from "~/components/icons/DeleteIcon"
import { EditIcon } from "~/components/icons/EditIcon"
import PlusIcon from "~/components/icons/PlusIcon"
import { SearchIcon } from "~/components/icons/SearchIcon"
import ConfirmModal from "~/components/modal/confirmModal"
import CreateModal from "~/components/modal/createModal"
import EditModal from "~/components/modal/EditModal"
import { UserColumns } from "~/components/table/columns"
import NewCustomTable from "~/components/table/newTable"
import { errorToast, successToast } from "~/components/toast"
import usersController from "~/controllers/Users"
import { RegistrationInterface } from "~/interfaces/interface"
import AdminLayout from "~/layout/adminLayout"
import { getSession } from "~/session"

const Users = () => {
    const [isCreateModalOpened, setIsCreateModalOpened] = useState(false)
    const [base64Image, setBase64Image] = useState<any>()
    const [isConfirmModalOpened, setIsConfirmModalOpened] = useState(false)
    const [isEditModalOpened, setIsEditModalOpened] = useState(false)
    const [dataValue, setDataValue] = useState<RegistrationInterface>()
    const submit = useSubmit()
    const actionData = useActionData<any>()
    const navigate = useNavigate()
    const navigation = useNavigation()
    const { user, users, totalPages } = useLoaderData<{ user: { _id: string }, users: RegistrationInterface[], totalPages:number }>()

    const handleCreateModalClosed = () => {
        setIsCreateModalOpened(false)
    }
    const handleConfirmModalClosed = () => {
        setIsConfirmModalOpened(false)
    }
    const handleEditModalClosed = () => {
        setIsEditModalOpened(false)
    }


    useEffect(() => {
        if (actionData) {
            if (actionData.success) {
                successToast(actionData.message)
            } else {
                errorToast(actionData.message)
            }
        }
    }, [actionData])

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(users);

    const handleSearchChange = (event: any) => {
        setSearchQuery(event.target.value);
    };

    useEffect(() => {
        const filtered = users.filter(user => {
            const lowerCaseQuery = searchQuery.toLowerCase();
            return (
                user.firstName.toLowerCase().includes(lowerCaseQuery) ||
                user.phone.toLowerCase().includes(lowerCaseQuery) ||
                user.lastName.toLowerCase().includes(lowerCaseQuery) ||
                user.email.toLowerCase().includes(lowerCaseQuery)
            );
        });
        setFilteredUsers(filtered);
    }, [searchQuery, users]);
    return (
        <AdminLayout pageName="Users Management">
            <div className="flex z-0 justify-between gap-2">
                <Toaster position="top-center" />
                <div>
                    <Input
                        size="lg"
                        placeholder="Search user..."
                        startContent={<SearchIcon className="" />}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        classNames={{
                            inputWrapper: "bg-white shadow-sm text-xs font-nunito dark:bg-slate-900 border border border-white/5",
                        }}
                    />
                </div>
                <div>
                    <Button size="lg" variant="flat" onClick={() => {
                        setIsCreateModalOpened(true)
                    }} color="primary" className="font-montserrat font-semibold text-md">
                        <PlusIcon className="h-6 w-6" />Create User
                    </Button>
                </div>
            </div>


            <NewCustomTable
                columns={UserColumns}
                loadingState={navigation.state === "loading" ? "loading" : "idle"}
                totalPages={totalPages}
                page={1}
                setPage={(page) => (
                    navigate(`?page=${page}`)
                )}>
                {users.map((user: RegistrationInterface, index: number) => (
                    <TableRow key={index}>
                        <TableCell className="text-xs">
                            <p className="!text-xs">
                                <User
                                    avatarProps={{ radius: "sm", src: user.image }}
                                    name={
                                        <p className="font-nunito text-xs">
                                            {user.firstName + ' ' + user.middleName + ' ' + user.lastName}
                                        </p>
                                    }
                                />
                            </p>
                        </TableCell>
                        <TableCell className="text-xs">{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell className="relative flex items-center gap-4">
                            <Button size="sm" color="success" variant="flat" onClick={() => {
                                setIsEditModalOpened(true)
                                setDataValue(user)
                            }}>
                                <EditIcon /> Edit
                            </Button>
                            <Button size="sm" color="danger" variant="flat" onClick={() => {
                                setIsConfirmModalOpened(true)
                                setDataValue(user)
                            }}>
                                <DeleteIcon /> Delete
                            </Button>

                        </TableCell>
                    </TableRow>
                ))}
            </NewCustomTable>

            <ConfirmModal className="dark:bg-slate-950 border border-white/5" header="Confirm Delete" content="Are you sure to delete user?" isOpen={isConfirmModalOpened} onOpenChange={handleConfirmModalClosed}>
                <div className="flex gap-4">
                    <Button color="primary" variant="flat" className="font-montserrat font-semibold" size="sm" onPress={handleConfirmModalClosed}>
                        No
                    </Button>
                    <Button color="danger" variant="flat" className="font-montserrat font-semibold " size="sm" onClick={() => {
                        setIsConfirmModalOpened(false)
                        if (dataValue) {
                            submit({
                                intent: "delete",
                                id: dataValue?._id
                            }, {
                                method: "post"
                            })
                        }
                    }} >
                        Yes
                    </Button>
                </div>
            </ConfirmModal>
            {/* Create Modal */}
            <EditModal
                className="bg-gray-200 dark:bg-slate-950 "
                modalTitle="Update user details"
                isOpen={isEditModalOpened}
                onOpenChange={handleEditModalClosed}
            >
                {(onClose) => (
                    <Form method="post">
                        <Input
                            label="First name"
                            isRequired
                            isClearable
                            name="firstname"
                            placeholder=" "
                            defaultValue={dataValue?.firstName}
                            type="text"
                            labelPlacement="outside"
                            classNames={{
                                label: "font-nunito text-sm text-default-100",
                                inputWrapper: "bg-white shadow-sm dark:bg-slate-900 border border-white/5 focus:bg-slate-900 "
                            }}
                        />
                        <div className="flex gap-4">
                            <Input
                                label="Middle Name"
                                name="middlename"
                                placeholder=" "
                                isClearable
                                defaultValue={dataValue?.middleName}
                                type="text"
                                labelPlacement="outside"
                                classNames={{
                                    label: "font-nunito text-sm text-default-100",
                                    inputWrapper: "bg-white shadow-sm dark:bg-slate-900 border border-white/5 focus:bg-slate-900 mt-4"
                                }}
                            />
                            <Input
                                label="Last Name"
                                isRequired
                                name="lastname"
                                defaultValue={dataValue?.lastName}
                                isClearable
                                placeholder=" "
                                type="text"
                                labelPlacement="outside"
                                classNames={{
                                    label: "font-nunito text-sm text-default-100",
                                    inputWrapper: "bg-white shadow-sm dark:bg-slate-900 border border-white/5 focus:bg-slate-900 mt-4"
                                }}
                            />
                        </div>
                        <Input
                            label="Email"
                            isRequired
                            name="email"
                            defaultValue={dataValue?.email}
                            isClearable
                            placeholder=" "
                            type="text"
                            labelPlacement="outside"
                            classNames={{
                                label: "font-nunito text-sm text-default-100",
                                inputWrapper: "bg-white shadow-sm dark:bg-slate-900 border border-white/5 focus:bg-slate-900 mt-4"
                            }}
                        />
                        <div className="flex gap-4 ">
                            <Input
                                label=" Phone"
                                isRequired
                                name="phone"
                                defaultValue={dataValue?.phone}
                                isClearable
                                placeholder=" "
                                type="text"
                                labelPlacement="outside"
                                classNames={{
                                    label: "font-nunito text-sm text-default-100",
                                    inputWrapper: "bg-white shadow-sm dark:bg-slate-900 border border-white/5 focus:bg-slate-900 mt-4"
                                }}
                            />
                            <Input
                                label=" Password"
                                isRequired
                                name="password"
                                placeholder=" "
                                defaultValue={dataValue?.password}
                                isReadOnly
                                type="text"
                                labelPlacement="outside"
                                classNames={{
                                    label: "font-nunito text-sm text-default-100",
                                    inputWrapper: "bg-white shadow-sm dark:bg-slate-900 border border-white/5 focus:bg-slate-900 mt-4"
                                }}
                            />
                        </div>
                        <Input
                            label=" Role"
                            isRequired
                            name="role"
                            defaultValue={dataValue?.role}
                            isClearable
                            placeholder=" "
                            type="text"
                            labelPlacement="outside"
                            classNames={{
                                label: "font-nunito text-sm text-default-100",
                                inputWrapper: "bg-white shadow-sm dark:bg-slate-900 border border-white/5 focus:bg-slate-900 mt-4"
                            }}
                        />


                        <input name="admin" value={user._id} type="hidden" />
                        <input name="intent" value="update" type="hidden" />
                        <input name="id" value={dataValue?._id} type="hidden" />

                        <div className="flex justify-end gap-2 mt-10 ">
                            <Button className="font-montserrat font-semibold" color="danger" variant="flat" onPress={onClose}>
                                Close
                            </Button>
                            <button type="submit" className="bg-primary-400 rounded-xl bg-opacity-20 text-primary text-sm font-montserrat font-semibold px-4">
                                Submit
                            </button>
                        </div>
                    </Form>
                )}
            </EditModal>

            {/* Create Modal */}
            <CreateModal
                className="bg-gray-200 dark:bg-slate-950"
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
                                label: "font-nunito text-sm text-default-100",
                                inputWrapper: "bg-white shadow-sm dark:bg-slate-900 border border-white/5 focus:bg-slate-900 "
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
                                    label: "font-nunito text-sm text-default-100",
                                    inputWrapper: "bg-white shadow-sm dark:bg-slate-900 border border-white/5 focus:bg-slate-900 mt-4"
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
                                    label: "font-nunito text-sm text-default-100",
                                    inputWrapper: "bg-white shadow-sm dark:bg-slate-900 border border-white/5 focus:bg-slate-900 mt-4"
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
                                label: "font-nunito text-sm text-default-100",
                                inputWrapper: "bg-white shadow-sm dark:bg-slate-900 border border-white/5 focus:bg-slate-900 mt-4"
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
                                    label: "font-nunito text-sm text-default-100",
                                    inputWrapper: "bg-white shadow-sm dark:bg-slate-900 border border-white/5 focus:bg-slate-900 mt-4"
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
                                    label: "font-nunito text-sm text-default-100",
                                    inputWrapper: "bg-white focus:dark:bg-slate-900 focus:bg-white shadow-sm dark:bg-slate-900 border border-white/5 focus:bg-slate-900 mt-4"
                                }}
                            />
                        </div>
                        <div className="mt-4">
                            <Select
                                label="Role"
                                labelPlacement="outside"
                                placeholder=" "
                                isRequired
                                name="role"
                                classNames={{
                                    label: "font-nunito text-sm text-default-100",
                                    popoverContent: "focus:dark:bg-slate-900 focus-bg-white bg-white shadow-sm dark:bg-slate-900 border border-white/5 font-nunito",
                                    trigger: "focus:dark:bg-slate-900 focus:bg-white bg-white shadow-sm dark:bg-slate-900 border border-white/5 font-nunito mt-4"
                                }}
                            >
                                {[
                                    { key: "admin", value: "admin", display_name: "Admin" },
                                    { key: "attendant", value: "attendant", display_name: "Attendant" },
                                ].map((role) => (
                                    <SelectItem key={role.key}>{role.display_name}</SelectItem>
                                ))}
                            </Select>
                        </div>

                        <div className=" mt-4">
                            <label className="font-nunito block text-sm" htmlFor="">Image</label>
                            <input
                                name="image"
                                required
                                placeholder=" "
                                className="focus:dark:bg-slate-900 focus:bg-white font-nunito mt-2 rounded-lg h-10 w-[25vw] bg-white shadow-smx dark:bg-slate-900 border border-white/5"
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

                        <input name="admin" value={user._id} type="hidden" />
                        <input name="intent" value="create" type="hidden" />
                        <input name="base64Image" value={base64Image} type="hidden" />

                        <div className="flex justify-end gap-2 mt-10 font-nunito">
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Close
                            </Button>
                            <button type="submit" className="bg-primary-400 rounded-xl bg-opacity-20 text-primary text-sm font-nunito px-4">
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
    const lastName = formData.get("lastname") as string;
    const middleName = formData.get("middlename") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phone = formData.get("phone") as string;
    const base64Image = formData.get("base64Image") as string;
    const role = formData.get("role") as string;
    const admin = formData.get("admin") as string;
    const intent = formData.get("intent") as string;
    const id = formData.get("id") as string;

    switch (intent) {
        case "create":
            const user = await usersController.CreateUser({
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
            })
            return user

        case "delete":
            const deleteUser = await usersController.DeleteUser({
                intent,
                id
            })
            return deleteUser

        case "update":
            const updateUser = await usersController.UpdateUser({
                firstName,
                middleName,
                lastName,
                email,
                admin,
                phone,
                id,
                role,
                intent,
            })
            return updateUser
        case "logout":
            const logout = await usersController.logout(intent)
            return logout
        default:
            return json({
                message: "Bad request",
                success: false,
                status: 400
            })
    }
}

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") as string) || 1;
    const search_term = url.searchParams.get("search_term") as string;
    const session = await getSession(request.headers.get("Cookie"));
    const token = session.get("email");
    if (!token) {
        return redirect("/")
    }
    const { user,users,totalPages } = await usersController.FetchUsers({ request,
        page,
        search_term
    });

    return json({user, users,totalPages });
}