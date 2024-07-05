import React, { useState, useEffect } from "react";
import { Button, Input, Textarea, TableRow, TableCell, Tooltip } from "@nextui-org/react";
import { ActionFunction, LoaderFunction, json } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { Toaster } from "react-hot-toast";
import PlusIcon from "~/components/icons/PlusIcon";
import { SearchIcon } from "~/components/icons/SearchIcon";
import CreateModal from "~/components/modal/createModal";
import EditModal from "~/components/modal/EditModal";
import { CategoryColumns } from "~/components/table/columns";
import CustomTable from "~/components/table/table";
import { errorToast, successToast } from "~/components/toast";
import category from "~/controllers/categoryController";
import AdminLayout from "~/layout/adminLayout";
import { CategoryInterface } from "~/interfaces/interface";
import ViewModal from "~/components/modal/viewModal";
import ConfirmModal from "~/components/modal/confirmModal";

type SessionData = {
    sessionId: {
        _id: string;
    };
};

const Category = () => {
    const { sessionId } = useLoaderData<SessionData>();
    const { cats } = useLoaderData<{ cats: CategoryInterface[] }>()
    const actionData = useActionData<any>()
    const [rowsPerPage, setRowsPerPage] = useState(13);
    const submit = useSubmit()
    const [editModalOpened, setEditModalOpened] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<CategoryInterface>();
    const [createModalOpened, setCreateModalOpened] = useState(false)
    const [viewModalOpened, setViewModalOpened] = useState(false)
    const [confirmModalOpened, setConfirmModalOpened] = useState(false)


    const handleRowsPerPageChange = (newRowsPerPage: number) => {
        setRowsPerPage(newRowsPerPage);
    };



    const handleEditModalClose = () => {
        setEditModalOpened(false);
    };

    const handleViewModalClosed = () => {
        setViewModalOpened(false)
    }

    const handleConfirmModalClosed = () => {
        setConfirmModalOpened(false)
    }

    const handleCreateModalOpened = () => {
        setCreateModalOpened(false)
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

    return (
        <AdminLayout pageName="Categories">
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
                    <Button onClick={() => {
                        setCreateModalOpened(true)
                    }} color="primary" className="h-14 font-poppins text-md">
                        <PlusIcon className="h-6 w-6" />Add Category
                    </Button>
                </div>
            </div>

            <div className="">
                <CustomTable columns={CategoryColumns} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleRowsPerPageChange}>
                    {cats.map((categories: CategoryInterface, index: number) => (
                        <TableRow key={index}>
                            <TableCell>{categories.name}</TableCell>
                            <TableCell>{categories.description}</TableCell>
                            <TableCell className="relative flex items-center gap-4">
                                <span className=" text-primary-400 cursor-pointer active:opacity-50">
                                    <button onClick={() => {
                                        setViewModalOpened(true)
                                        setSelectedCategory(categories)
                                    }}>
                                        View
                                    </button>
                                </span>
                                <span className=" text-default-400 cursor-pointer active:opacity-50" onClick={() => {
                                    setEditModalOpened(true)
                                    setSelectedCategory(categories)

                                }}>
                                    Edit
                                </span>
                                <span className=" text-danger-400 cursor-pointer active:opacity-50">
                                    <button onClick={() => {
                                        setSelectedCategory(categories)
                                        setConfirmModalOpened(true)
                                    }}>
                                        Delete
                                    </button>
                                </span>

                            </TableCell>
                        </TableRow>
                    ))}
                </CustomTable>
            </div>

            <EditModal
                modalTitle="Edit Category"
                name="Edit Category"
                isOpen={editModalOpened}
                onOpenChange={handleEditModalClose}
            >
                {(onClose) => (
                    <Form method="post">
                        <Input
                            label="Name"
                            name="name"
                            defaultValue={selectedCategory?.name}
                            placeholder=" "
                            type="text"
                            labelPlacement="outside"
                            classNames={{
                                label: "font-poppins text-sm text-default-100",
                            }}
                        />
                        <input name="seller" value={sessionId._id} type="hidden" />
                        <input name="intent" value="update" type="hidden" />
                        <input name="id" value={selectedCategory?._id} type="hidden" />

                        <Textarea
                            autoFocus
                            label="Product description"
                            labelPlacement="outside"
                            placeholder=" "
                            name="description"
                            className="mt-4 font-poppins text-sm"
                            defaultValue={selectedCategory?.description}
                        />


                        <div className="flex justify-end gap-2 mt-10 font-poppins">
                            <Button color="danger" onPress={onClose}>
                                Close
                            </Button>
                            <button type="submit" className="bg-primary-400 rounded-xl font-poppins px-4">
                                Submit
                            </button>
                        </div>
                    </Form>
                )}
            </EditModal>


            <ViewModal className="" modalTitle="Category Dateails" isOpen={viewModalOpened} onOpenChange={handleViewModalClosed}>
                <div >
                    <p className="font-poppins text-md">Category Name</p>
                    <p>{selectedCategory?.name}</p>

                    <p className="font-poppins text-md mt-6">Category Description</p>
                    <p>{selectedCategory?.description}</p>

                </div>
            </ViewModal>

            <ConfirmModal isOpen={confirmModalOpened} onOpenChange={handleConfirmModalClosed}>
                <div className="flex gap-4">
                    <Button color="danger" className="font-poppins text-md" onPress={handleConfirmModalClosed}>
                        No
                    </Button>
                    <Button color="primary" className="font-poppins text-md" onClick={() => {
                        if (selectedCategory) {
                            submit({
                                intent: "delete",
                                id: selectedCategory?._id

                            }, {
                                method: "post"
                            })
                        }
                    }} >
                        Yes
                    </Button>
                </div>
            </ConfirmModal>

            <CreateModal
                modalTitle="Add new category"
                name="Add Category"
                isOpen={createModalOpened}
                onOpenChange={handleCreateModalOpened}
            >
                {(onClose) => (
                    <Form method="post">
                        <Input
                            label="Name"
                            name="name"
                            placeholder=" "
                            type="text"
                            labelPlacement="outside"
                            classNames={{
                                label: "font-poppins text-sm text-default-100",
                            }}
                        />
                        <input name="seller" value={sessionId._id} type="" />

                        <Textarea
                            autoFocus
                            label="Product description"
                            labelPlacement="outside"
                            placeholder=" "
                            name="description"
                            className="mt-4 font-poppins text-sm"
                        />

                        <div className="flex justify-end gap-2 mt-10 font-poppins">
                            <Button color="danger" onPress={onClose}>
                                Close
                            </Button>
                            <button type="submit" className="bg-primary-400 rounded-xl font-poppins px-4">
                                Submit
                            </button>
                        </div>
                    </Form>
                )}
            </CreateModal>
        </AdminLayout>
    );
};

export default Category;

export const loader: LoaderFunction = async ({ request }) => {
    const { sessionId, cats } = await category.CategoryFetch(request);
    return { sessionId, cats };
};

export const action: ActionFunction = async ({ request }) => {
    try {
        const formData = await request.formData();
        const name = formData.get("name") as string;
        const seller = formData.get("seller") as string;
        const description = formData.get("description") as string;
        const id = formData.get("id") as string;
        const intent = formData.get("intent") as string;



        const categories = await category.CategoryAdd(request, name, description, seller, intent, id);
        return categories;

    } catch (error: any) {
        return json({ message: error.message, success: false }, { status: 500 });
    }
};
