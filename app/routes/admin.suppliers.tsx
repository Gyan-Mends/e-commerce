import { Button, Input, Select, SelectItem, TableCell, TableRow, User } from "@nextui-org/react"
import { ActionFunction, json, LoaderFunction } from "@remix-run/node"
import { Form, useActionData, useLoaderData, useSubmit } from "@remix-run/react"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"
import { DeleteIcon } from "~/components/icons/DeleteIcon"
import { EditIcon } from "~/components/icons/EditIcon"
import PlusIcon from "~/components/icons/PlusIcon"
import { SearchIcon } from "~/components/icons/SearchIcon"
import ConfirmModal from "~/components/modal/confirmModal"
import CreateModal from "~/components/modal/createModal"
import EditModal from "~/components/modal/EditModal"
import { SuppliersColumns, UserColumns } from "~/components/table/columns"
import CustomTable from "~/components/table/table"
import { errorToast, successToast } from "~/components/toast"
import suppliersController from "~/controllers/Suppliers"
import usersController from "~/controllers/Users"
import { RegistrationInterface, SuppliersInterface } from "~/interfaces/interface"
import AdminLayout from "~/layout/adminLayout"

const Suppliers = () => {
    const [isCreateModalOpened, setIsCreateModalOpened] = useState(false)
    const [base64Image, setBase64Image] = useState()
    const [rowsPerPage, setRowsPerPage] = useState(13)
    const [isConfirmModalOpened, setIsConfirmModalOpened] = useState(false)
    const [isEditModalOpened, setIsEditModalOpened] = useState(false)
    const [dataValue, setDataValue] = useState<SuppliersInterface>()
    const submit = useSubmit()
    const actionData = useActionData<any>()
    const { user, suppliers } = useLoaderData<{ user: { _id: string }, suppliers: SuppliersInterface[] }>()

    const handleCreateModalClosed = () => {
        setIsCreateModalOpened(false)
    }
    const handleConfirmModalClosed = () => {
        setIsConfirmModalOpened(false)
    }
    const handleEditModalClosed = () => {
        setIsEditModalOpened(false)
    }
    const handleRowsPerPageChange = (newRowsPerPage: number) => {
        setRowsPerPage(newRowsPerPage)
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
    const [filteredSuppliers, setFilteredSuppliers] = useState(suppliers);

    const handleSearchChange = (event: any) => {
        setSearchQuery(event.target.value);
    };

    useEffect(() => {
        const filtered = suppliers.filter(supplier => {
            const lowerCaseQuery = searchQuery.toLowerCase();
            return (
                supplier.firstName.toLowerCase().includes(lowerCaseQuery) ||
                supplier.phone.toLowerCase().includes(lowerCaseQuery) ||
                supplier.lastName.toLowerCase().includes(lowerCaseQuery) ||
                supplier.email.toLowerCase().includes(lowerCaseQuery)
            );
        });
        setFilteredSuppliers(filtered);
    }, [searchQuery, suppliers]);
    return (
        <AdminLayout pageName="Supliers Management">
            <div className="flex z-0 justify-between gap-2">
                <Toaster position="top-center" />
                <div>
                    <Input
                    size="lg"
                        placeholder="Search product..."
                        startContent={<SearchIcon className="" />}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        classNames={{
                            inputWrapper: "dark:bg-slate-900 bg-white shadow-sm border border-white/5",
                        }}
                    />
                </div>
                <div>
                    <Button variant="flat" size="lg" onClick={() => {
                        setIsCreateModalOpened(true)
                    }} color="primary" className=" font-monserrat font-semibold">
                        <PlusIcon className="h-6 w-6" />Create Supplier
                    </Button>
                </div>
            </div>


            <CustomTable columns={SuppliersColumns} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleRowsPerPageChange}>
                {filteredSuppliers.map((supplier: SuppliersInterface, index: number) => (
                    <TableRow key={index}>
                        <TableCell className="text-xs">
                            <User
                                avatarProps={{ radius: "sm", src: supplier.firstName }}
                                name={
                                    <p className="font-nunito text-xs">
                                        {supplier.firstName + ' ' + supplier.middleName + ' ' + supplier.lastName}
                                    </p>
                                }
                            />
                        </TableCell>
                        <TableCell className="">{supplier.email}</TableCell>
                        <TableCell>{supplier.phone}</TableCell>
                        <TableCell className="relative flex items-center gap-4">
                            <Button size="sm" color="success" variant="flat" onClick={() => {
                                setIsEditModalOpened(true)
                                setDataValue(supplier)
                            }}>
                               <EditIcon/> Edit
                            </Button>
                            <Button size="sm" color="danger" variant="flat" onClick={() => {
                                setIsConfirmModalOpened(true)
                                setDataValue(supplier)
                            }}>
                                <DeleteIcon/> Delete
                            </Button>

                        </TableCell>
                    </TableRow>
                ))}
            </CustomTable>
            <ConfirmModal content="Are you sure to delete supplier?" header="Cnfirm Delete" className="dark:bg-slate-900 border border-white/5"  isOpen={isConfirmModalOpened} onOpenChange={handleConfirmModalClosed}>
                <div className="flex gap-4">
                    <Button size="sm" color="primary" variant="flat" className="font-montserrat font-semibold" onPress={handleConfirmModalClosed}>
                        No
                    </Button>
                    <Button size="sm" color="danger" variant="flat" className="font-montserrat font-semibold" onClick={() => {
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
                className="dark:bg-slate-950 border border-white/5 bg-gray-200"
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
                                inputWrapper: "bg-white shadow-sm text-xs font-nunito dark:bg-slate-900 border border border-white/5 mt-4",
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
                                    inputWrapper: "bg-white shadow-sm text-xs font-nunito dark:bg-slate-900 border border border-white/5 mt-4",
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
                                    inputWrapper: "bg-white shadow-sm text-xs font-nunito dark:bg-slate-900 border border border-white/5 mt-4",
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
                                inputWrapper: "bg-white shadow-sm text-xs font-nunito dark:bg-slate-900 border border border-white/5 mt-4",
                            }}
                        />
                        <div className="flex gap-4">
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
                                    inputWrapper: "bg-white shadow-sm text-xs font-nunito dark:bg-slate-900 border border border-white/5 mt-4",
                                }}
                            />
                           
                        </div>
                       

                        <input name="admin" value={user._id} type="hidden" />
                        <input name="intent" value="update" type="hidden" />
                        <input name="id" value={dataValue?._id} type="hidden" />

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
            </EditModal>

            {/* Create Modal */}
            <CreateModal
                className="dark:bg-slate-950 border border-white/5 bg-gray-200"
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
                                    inputWrapper: "bg-white shadow-sm text-xs font-nunito dark:bg-slate-900 border border border-white/5 mt-4",
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
                                    inputWrapper: "bg-white shadow-sm text-xs font-nunito dark:bg-slate-900 border border border-white/5 mt-4",
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
                                    inputWrapper: "bg-white shadow-sm text-xs font-nunito dark:bg-slate-900 border border border-white/5 mt-4",
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
                                inputWrapper: "bg-white shadow-sm text-xs font-nunito dark:bg-slate-900 border border border-white/5 mt-4",
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
                                    inputWrapper: "bg-white shadow-sm text-xs font-nunito dark:bg-slate-900 border border border-white/5 mt-4",
                                }}
                            />
                        </div>


                        <input name="admin" value={user._id} type="hidden" />
                        <input name="intent" value="create" type="hidden" />

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

export default Suppliers

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const firstName = formData.get("firstname") as string;
    const lastName = formData.get("lastname") as string;
    const middleName = formData.get("middlename") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const admin = formData.get("admin") as string;
    const intent = formData.get("intent") as string;
    const id = formData.get("id") as string;

    switch (intent) {
        case "create":
            const supplier = await suppliersController.CreateSupplier({
                firstName,
                middleName,
                lastName,
                email,
                admin,
                phone,
                intent,
            })
            return supplier

        case "delete":
            const deleteSuppler = await suppliersController.DeleteSupplier({
                intent,
                id
            })
            return deleteSuppler

        case "update":
            const updateSupplier = await suppliersController.UpdateSupplier({
                firstName,
                middleName,
                lastName,
                email,
                admin,
                phone,
                id,
                intent,
            })
            return updateSupplier

        default:
            return json({
                message: "Bad request",
                success: false,
                status: 400
            })
    }
}

export const loader: LoaderFunction = async ({ request }) => {
    const { user, suppliers } = await suppliersController.FetchSuppliers({ request })

    return { user, suppliers }
}