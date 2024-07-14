import { Button, Input, Select, SelectItem, TableCell, TableRow, Textarea, User } from "@nextui-org/react"
import { ActionFunction, LoaderFunction } from "@remix-run/node"
import { Form, useActionData, useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"
import PlusIcon from "~/components/icons/PlusIcon"
import { SearchIcon } from "~/components/icons/SearchIcon"
import EditModal from "~/components/modal/EditModal"
import { SalesColumns } from "~/components/table/columns"
import CustomTable from "~/components/table/table"
import { errorToast, successToast } from "~/components/toast"
import refundController from "~/controllers/refund"
import salesController from "~/controllers/sales"
import { SalesInterface } from "~/interfaces/interface"
import AdminLayout from "~/layout/adminLayout"
import AttendantLayout from "~/layout/attendantLayout"

const Sales = () => {
    const [rowsPerPage, setRowsPerPage] = useState(8)
    const { adminsales } = useLoaderData<{ adminsales: SalesInterface[] }>()
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSales, setFilteredSales] = useState(adminsales);
    const [isEditModalOpened, setIsEditModalOpened] = useState(false)
    const [dataValue, setDataValue] = useState<SalesInterface>()
    const actionData = useActionData<any>()

    const handleRowsPerPageChange = (newRowsPerPage: number) => {
        setRowsPerPage(newRowsPerPage)
    }
    const handleSearchChange = (event: any) => {
        setSearchQuery(event.target.value);
    };
    const handleEditModalClosed = () => {
        setIsEditModalOpened(false)
    }
   const generateReceipt = () => {
   let receipt = `
    <div className="flex justify-between">
        <div className="text-default-500 font-nunito text-sm">
            <p>Receipt No</p>
            <p>${dataValue?._id}</p>
        </div>
        <div className="font-nunito text-default-500 text-sm">
            <p>Attendant</p>
            <p>${dataValue?.attendant.firstName} ${dataValue?.attendant.middleName} ${dataValue?.attendant.lastName}</p>
        </div>
    </div>

    <p className="mt-6 font-nunito text-md font-semibold">Product Details</p>
    <div className="flex justify-between mt-2 text-md text-default-500">
        <div>
            <p className="font-nunito font-semibold">Products</p>
            ${dataValue.products.map((productDetail: SalesInterface, idx: number) => `
                <div key=${idx}>
                    <p>${productDetail?.product?.name}</p>
                </div>
            `).join('')}
        </div>
        <div>
            <p className="font-nunito font-semibold">Quantities</p>
            ${dataValue.products.map((productDetail: SalesInterface, idx: number) => `
                <div key=${idx}>
                    <p>${productDetail?.quantity}</p>
                </div>
            `).join('')}
        </div>
    </div>

    <p className="mt-10 font-nunito text-md font-semibold">Payment Details</p>
    <div className="flex justify-between mt-2">
        <div className="text-default-500 text-md">
            <p className="font-nunito font-semibold">Total Amount</p>
            <p className="font-nunito text-sm">GHC ${dataValue?.totalAmount}</p>
        </div>
        <div className="text-default-500 text-md">
            <p className="font-nunito font-semibold">Amount Paid</p>
            <p className="font-nunito text-sm">GHC ${dataValue?.amountPaid}</p>
        </div>
        <div className="text-default-500 text-md">
            <p className="font-nunito font-semibold">Balance</p>
            <p className="font-nunito text-sm">GHC ${dataValue?.balance}</p>
        </div>
    </div>
`;

    return receipt
   }

    useEffect(() => {
        const filtered = adminsales.filter(sale => {
            const lowerCaseQuery = searchQuery.toLowerCase();
            return (
                sale._id.toLowerCase().includes(lowerCaseQuery)||
                sale.attendant.lastName.toLowerCase().includes(lowerCaseQuery)||
                sale.attendant.firstName.toLowerCase().includes(lowerCaseQuery)||
                sale.attendant.middleName.toLowerCase().includes(lowerCaseQuery)
            );
        });
        setFilteredSales(filtered);
    }, [searchQuery, adminsales]);
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
        <AdminLayout pageName="Sales Managemwent">
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
                            inputWrapper: "bg-white shadow-sm text-xs font-nunito dark:bg-slate-900 border border border-white/5",
                        }}
                    />
                </div>
                <div>
                    <Button size="lg" variant="flat" onClick={() => {
                        // setIsCreateModalOpened(true)
                    }} color="primary" className=" font-montserrat font-semibold">
                        <PlusIcon className="h-6 w-6" />Create User
                    </Button>
                </div>
            </div>

            <CustomTable columns={SalesColumns} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleRowsPerPageChange}>
                {filteredSales.map((sale: SalesInterface, index: number) => (
                    <TableRow key={index}>
                        <TableCell className="">
                            {sale._id}
                        </TableCell>
                        <TableCell className="">
                            {sale.products.map((productDetail: SalesInterface, idx: number) => (
                                <div className="" key={idx}>
                                    {/* Display the product name */}
                                    <div>{productDetail.product?.name}</div>
                                </div>
                            ))}
                        </TableCell>
                        <TableCell className="">
                            {sale.products.map((productDetail: SalesInterface, idx: number) => (
                                <div className="" key={idx}>
                                    {/* Display the product quantity */}
                                    <div>{productDetail.quantity}</div>
                                </div>
                            ))}
                        </TableCell>
                        <TableCell className="">
                            {sale.attendant?.firstName} {sale?.attendant?.middleName} {sale.attendant?.lastName}
                        </TableCell>
                        <TableCell className="">
                            GHC {sale.totalAmount}
                        </TableCell>
                        <TableCell className="">
                            GHC {sale.amountPaid}
                        </TableCell>
                        <TableCell className="">
                            GHC {sale.balance}
                        </TableCell>

                        <TableCell className="relative flex items-center gap-4">
                            <Button
                                size="sm"
                                color="success"
                                variant="flat"
                                onClick={() => {
                                    setIsEditModalOpened(true);
                                    setDataValue(sale);
                                }}
                            >
                                Refund
                            </Button>
                            <Button
                                size="sm"
                                color="success"
                                variant="flat"
                                onClick={() => {
                                    const receipt  = generateReceipt()
                                    const printWindow = window.open('','_blank','width=800,height=600');
                                    printWindow?.document.write(receipt);
                                    printWindow?.document.close();
                                    printWindow?.print()
                                    setDataValue(sale)
                                }}
                            >
                                Print
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </CustomTable>

            <EditModal modalTitle="Refund" className="" onOpenChange={handleEditModalClosed} isOpen={isEditModalOpened}>
                {(onClose) => (
                    <Form method="post" action="/sales">
                        <div className="flex justify-between">
                            <div className="text-default-500 font-nunito text-sm">
                                <p>Receipt No</p>
                                <p>{dataValue?._id}</p>
                            </div>
                            <div className="font-nunito text-default-500 text-sm">
                                <p>Attendant</p>
                                <p>{dataValue?.attendant.firstName} {dataValue?.attendant?.middleName} {dataValue?.attendant?.lastName}</p>
                            </div>
                        </div>

                        <p className="mt-6 font-nunito text-md font-semibold">Product Details</p>
                        <div className="flex justify-between mt-2 text-md text-default-500">
                            <div>
                                <p className="font-nunito font-semibold">Products</p>
                                {dataValue.products.map((productDetail: SalesInterface, idx: number) => (
                                    <div key={idx}>
                                        <p>{productDetail?.product?.name}</p>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="font-nunito font-semibold">Quantities</p>
                                {dataValue.products.map((productDetail: SalesInterface, idx: number) => (
                                    <div key={idx}>
                                        <p>{productDetail?.quantity}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <p className="mt-10 font-nunito text-md font-semibold">Payment Details</p>
                        <div className="flex justify-between mt-2">
                            <div className="text-default-500 text-md">
                                <p className="font-nunito font-semibold">Total Amount</p>
                                <p className="font-nunito text-sm">GHC {dataValue?.totalAmount}</p>
                            </div>
                            <div className="text-default-500 text-md">
                                <p className="font-nunito font-semibold">Amount Paid</p>
                                <p className="font-nunito text-sm">GHC {dataValue?.amountPaid}</p>
                            </div>
                            <div className="text-default-500 text-md">
                                <p className="font-nunito font-semibold">Balance</p>
                                <p className="font-nunito text-sm">GHC {dataValue?.balance}</p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <p className="font-nunito text-lg text-primary">Why Refund</p>
                            <Textarea
                                className="mt-2 font-nunito"
                                label="Reason"
                                labelPlacement="outside"
                                placeholder=" "
                                isRequired
                                name="reason"
                            />
                            <div className="pt-4">
                                <Select
                                    label="Products"
                                    labelPlacement="outside"
                                    placeholder=" "
                                    isRequired
                                    selectionMode="multiple"
                                    className="mt-4 font-nunito"
                                    name="product"
                                >
                                    {dataValue.products.map((productDetail: SalesInterface) => (
                                        <SelectItem textValue={productDetail?.product?.name} className="mt-4" key={productDetail.product?._id}>
                                            {productDetail?.product?.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <input name="intent" value="refund" type="hidden" />
                                <input name="attendant" value={dataValue?.attendant?._id} type="hidden" />
                                <input name="totalAmount" value={dataValue?.totalAmount} type="hidden" />
                                <input name="amountPaid" value={dataValue?.amountPaid} type="hidden" />
                                <input name="balance" value={dataValue?.balance} type="hidden" />
                                <input className="text-black" name="totalQuantity" value={dataValue?.quantity} type="hidden" />
                            </div>
                            <div className="pt-4">
                                <Select
                                    label="Quantity"
                                    labelPlacement="outside"
                                    placeholder=" "
                                    isRequired
                                    selectionMode="multiple"
                                    className="mt-4 font-nunito"
                                    name="quantity"
                                >
                                    {dataValue.products.map((productDetail: SalesInterface) => (
                                        <SelectItem textValue={productDetail.quantity} className="mt-4" key={productDetail.quantity}>
                                            {productDetail.quantity}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                            <div className="flex gap-4 justify-end mt-6">
                                <Button color="primary" variant="flat" onClick={handleEditModalClosed}>Close</Button>
                                <button
                                    className="bg-danger rounded-xl flex items-center justify-center gap-2 bg-opacity-20 text-danger h-10 font-nunito text-sm px-2"
                                    type="submit"
                                >
                                    Proceed to Refund
                                </button>
                            </div>
                        </div>
                    </Form>
                )}
            </EditModal>
        </AdminLayout>
    )
}

export default Sales

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData()
    const balance = formData.get("balance") as string
    const amountPaid = formData.get("amountPaid") as string
    const totalAmount = formData.get("totalAmount") as string
    const attendant = formData.get("attendant") as string
    const intent = formData.get("intent") as string
    const product = formData.get("product") as string
    const quantity = formData.get("quantity") as string
    const reason = formData.get("reason") as string
    console.log(quantity);


    switch (intent) {
        case "refund":
            const makeRefund = await refundController.ApplyRefund({
                intent,
                request,
                attendant,
                totalAmount,
                amountPaid,
                balance,
                quantity,
                product,
            })
            return makeRefund

        default:
            break;
    }
}

export const loader: LoaderFunction = async ({ request }) => {
    const { adminsales } = await salesController.salesFetch({ request });

    return { adminsales }
}