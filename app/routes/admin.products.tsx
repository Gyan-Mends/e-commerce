import { Button, Input, Select, SelectItem, TableCell, TableRow, Textarea, User } from "@nextui-org/react"
import { ActionFunction, LoaderFunction, json } from "@remix-run/node"
import { Form, useActionData, useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"
import PlusIcon from "~/components/icons/PlusIcon"
import { SearchIcon } from "~/components/icons/SearchIcon"
import EditModal from "~/components/modal/EditModal"
import CreateModal from "~/components/modal/createModal"
import ViewModal from "~/components/modal/viewModal"
import { ProductColumns } from "~/components/table/columns"
import CustomTable from "~/components/table/table"
import { errorToast, successToast } from "~/components/toast"
import productsController from "~/controllers/productsController"
import { CategoryInterface, ProductInterface } from "~/interfaces/interface"
import AdminLayout from "~/layout/adminLayout"

const Products = () => {

    const [createModalOpened, setCreateModalOpened] = useState(false)
    const { categories, user, product } = useLoaderData<{ categories: CategoryInterface[], user: { _id: string }, product: ProductInterface[] }>();
    const actionData = useActionData<any>()
    const [base64Image, setBase64Image] = useState();
    const [rowsPerPage, setRowsPerPage] = useState(13)
    const [viewModalOpened, setViewModalOpened] = useState(false);
    const [editModalOpened, setEditmOdalOpened] = useState(false)
    const [selectedProducts, setSelectedProducts] = useState<ProductInterface>()

    useEffect(() => {
        if (actionData) {
            if (actionData.success) {
                successToast(actionData.message)
            } else {
                errorToast(actionData.message)
            }
        }
    }, [actionData])

    const handleCloseCreateModal = () => {
        setCreateModalOpened(false)
    }

    const handleRowsPerPageChange = (newRowsPerPage: number) => {
        setRowsPerPage(newRowsPerPage)
    }

    const handleViewModalClosed = () => {
        setViewModalOpened(false)
    }

    const handleEditModalClose = () => {
        setEditmOdalOpened(false)
    }




    return (
        <AdminLayout pageName="Products">
            <Toaster position="top-center" />
            <div className="flex justify-between">
                <div>
                    <Input
                        placeholder="Search product..."
                        className="font-poppins"
                        startContent={
                            <SearchIcon className="" />
                        }
                        classNames={{
                            inputWrapper: "h-14 lg:w-80"
                        }}
                    />
                </div>
                <div>
                    <Button onClick={() => {
                        setCreateModalOpened(true)
                    }} color="primary" variant="flat" className="h-14 font-poppins text-md">
                        <PlusIcon className="h-6 w-6" />Add Product
                    </Button>

                </div>
            </div>

            <CustomTable columns={ProductColumns} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleRowsPerPageChange}>
                {product.map((products: ProductInterface, index: number) => (
                    <TableRow key={index}>
                        <TableCell>
                            <User
                                avatarProps={{ radius: "sm", src: products.image }}
                                name={products.name}
                            />
                        </TableCell>
                        <TableCell>{products.category?.name}</TableCell>
                        <TableCell>{products.price}</TableCell>
                        <TableCell>{products.quantity}</TableCell>
                        <TableCell>{products.low_stock}</TableCell>
                        <TableCell className="relative flex items-center gap-4">
                                
                                <Button color="success" variant="flat" onClick={() => {
                                    setEditmOdalOpened(true)
                                    setSelectedProducts(products)
                                }}>
                                    Edit
                                </Button>                            
                                <Button color="danger" variant="flat">
                                    Delete
                                </Button>

                        </TableCell>
                    </TableRow>
                ))}
            </CustomTable>

            <CreateModal className="" modalTitle="Add new product" isOpen={createModalOpened} onOpenChange={handleCloseCreateModal} name="Add Product">
                {(onClose) => (
                    <Form method="post">
                        <Input
                            label="Name"
                            name="name"
                            placeholder=" "
                            type="text"
                            isClearable
                            isRequired
                            labelPlacement="outside"
                            classNames={{
                                label: "font-poppins text-sm text-default-100"
                            }}
                        />
                        <div className="flex gap-10">
                            <Input
                                label="Price(GHC)"
                                name="price"
                                placeholder=" "
                                isClearable
                                isRequired
                                className="mt-4"
                                labelPlacement="outside"
                                classNames={{
                                    label: "font-poppins text-sm text-default-100",
                                    inputWrapper: "mt-4"
                                }}
                            />
                            <Input
                                label="Quantity"
                                name="quantity"
                                placeholder=" "
                                type="number"
                                isClearable
                                isRequired
                                className="mt-4"
                                labelPlacement="outside"
                                classNames={{
                                    label: "font-poppins text-sm text-default-100",
                                    inputWrapper: "mt-4"
                                }}
                            />
                        </div>

                        <div className="pt-4">
                            <Select
                                label="Category"
                                labelPlacement="outside"
                                placeholder=" "
                                isRequired
                                className="mt-4"
                                name="category"

                            >
                                {categories.map((cat: CategoryInterface) => (
                                    <SelectItem textValue={cat.name} className="mt-4" key={cat._id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}

                            </Select>
                        </div>

                        <div className="flex gap-10">
                            <div className="pt-2">
                                <label className="font-poppins " htmlFor="">Image</label>
                                <input
                                    name="image"
                                    required
                                    placeholder=" "
                                    className="font-poppins mt-2 rounded-lg h-10 w-44 bg-default-100"
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
                            <Input
                                label="Low Stock"
                                name="lowstock"
                                placeholder=" "
                                isClearable
                                isRequired
                                type="number"
                                className="mt-4"
                                labelPlacement="outside"
                                classNames={{
                                    label: "font-poppins text-sm text-default-100",
                                    inputWrapper: "mt-4"
                                }}
                            />
                        </div>

                        <Textarea
                            autoFocus
                            label="Product description"
                            labelPlacement="outside"
                            placeholder=" "
                            isRequired
                            name="description"
                            className="mt-4 font-poppins text-sm"
                        />

                        <input hidden name="userid" value={user._id} type="text" />
                        <input hidden name="base64Image" value={base64Image} />


                        <div className="flex justify-end gap-2 mt-10 font-poppins">
                            <Button color="danger" onPress={onClose}>
                                Close
                            </Button>
                            <button className="bg-primary-400 rounded-xl font-poppins px-4" >
                                Submit
                            </button>
                        </div>
                    </Form>
                )}
            </CreateModal>

            <ViewModal modalTitle="Product Details" className="" isOpen={viewModalOpened} onOpenChange={handleViewModalClosed}>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <img className="h-60 rounded-lg" src={selectedProducts?.image} alt="" />
                    </div>
                    <div>
                        <p className="font-poppins">{selectedProducts?.name}</p>
                        <p className="font-poppins mt-2">{selectedProducts?.category.name}</p>
                        <p className="font-poppins mt-2">GHC{selectedProducts?.price}</p>
                        <p className="font-poppins mt-2">{selectedProducts?.quantity} {selectedProducts?.name}</p>
                        <p className="font-poppins mt-2">{selectedProducts?.description} </p>
                    </div>
                </div>
            </ViewModal>
            <EditModal modalTitle="Edit Product detail" className="" onOpenChange={handleEditModalClose} isOpen={editModalOpened}>
                {(onClose) => (
                    <Form method="post">
                        <Input
                            label="Name"
                            name="name"
                            placeholder=" "
                            type="text"
                            isClearable
                            isRequired
                            defaultValue={selectedProducts?.name}
                            labelPlacement="outside"
                            classNames={{
                                label: "font-poppins text-sm text-default-100"
                            }}
                        />
                        <div className="flex gap-10">
                            <Input
                                label="Price(GHC)"
                                name="price"
                                placeholder=" "
                                isClearable
                                defaultValue={selectedProducts?.price}
                                isRequired
                                className="mt-4"
                                labelPlacement="outside"
                                classNames={{
                                    label: "font-poppins text-sm text-default-100",
                                    inputWrapper: "mt-4"
                                }}
                            />
                            <Input
                                label="Quantity"
                                name="quantity"
                                placeholder=" "
                                type="number"
                                isClearable
                                isRequired
                                className="mt-4"
                                defaultValue={selectedProducts?.quantity}
                                labelPlacement="outside"
                                classNames={{
                                    label: "font-poppins text-sm text-default-100",
                                    inputWrapper: "mt-4"
                                }}
                            />
                        </div>

                        <div className="pt-4">
                            <Select
                                label="Category"
                                labelPlacement="outside"
                                placeholder=" "
                                isRequired
                                className="mt-4"
                                name="category"

                            >
                                {categories.map((cat: CategoryInterface) => (
                                    <SelectItem textValue={selectedProducts?.category} className="mt-4" key={cat._id}>
                                        {selectedProducts?.category}
                                    </SelectItem>
                                ))}

                            </Select>
                        </div>

                        <div className="flex gap-10">
                            <div className="pt-2">
                                <label className="font-poppins " htmlFor="">Image</label>
                                <input
                                    name="image"
                                    required
                                    placeholder=" "
                                    className="font-poppins mt-2 rounded-lg h-10 w-44 bg-default-100"
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
                            <Input
                                label="Low Stock"
                                name="lowstock"
                                placeholder=" "
                                isClearable
                                defaultValue={selectedProducts?.low_stock}
                                isRequired
                                type="number"
                                className="mt-4"
                                labelPlacement="outside"
                                classNames={{
                                    label: "font-poppins text-sm text-default-100",
                                    inputWrapper: "mt-4"
                                }}
                            />
                        </div>

                        <Textarea
                            autoFocus
                            label="Product description"
                            labelPlacement="outside"
                            placeholder=" "
                            isRequired
                            name="description"
                            className="mt-4 font-poppins text-sm"
                            defaultValue={selectedProducts?.description}
                        />

                        <input hidden name="userid" value={user._id} type="text" />
                        <input hidden name="base64Image" value={base64Image} />


                        <div className="flex justify-end gap-2 mt-10 font-poppins">
                            <Button color="danger" onPress={onClose}>
                                Close
                            </Button>
                            <button className="bg-primary-400 rounded-xl font-poppins px-4" >
                                Submit
                            </button>
                        </div>
                    </Form>
                )}
            </EditModal>
        </AdminLayout>
    )
}

export default Products
export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData()
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const quantity = formData.get("quantity") as string;
    const category = formData.get("category") as string;
    const base64Image = formData.get("base64Image") as string;
    const lowstock = formData.get("lowstock") as string;
    const description = formData.get("description") as string;
    const userid = formData.get("userid") as string;

    const products = await productsController.ProductAdd(request, name, price, quantity, category, base64Image, lowstock, description, userid);
    return products

}

export const loader: LoaderFunction = async ({ request }) => {
    const { categories, user, product } = await productsController.ProductFetch(request);

    return { categories, user, product }; // Ensure this returns an array
}

