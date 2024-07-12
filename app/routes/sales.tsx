import { Button, Input, Select, SelectItem, TableCell, TableRow, Textarea, User } from "@nextui-org/react"
import { LoaderFunction } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"
import PlusIcon from "~/components/icons/PlusIcon"
import { SearchIcon } from "~/components/icons/SearchIcon"
import ConfirmModal from "~/components/modal/confirmModal"
import EditModal from "~/components/modal/EditModal"
import { SalesColumns } from "~/components/table/columns"
import CustomTable from "~/components/table/table"
import salesController from "~/controllers/sales"
import { ProductInterface, SalesInterface } from "~/interfaces/interface"
import AttendantLayout from "~/layout/attendantLayout"

const Sales = () => {
    const [rowsPerPage, setRowsPerPage] = useState(8)
    const { sales } = useLoaderData<{ sales: SalesInterface[] }>()
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSales, setFilteredSales] = useState(sales);
    const [isEditModalOpened, setIsEditModalOpened] = useState(false)
    const [dataValue, setDataValue] = useState<SalesInterface>()

    const handleRowsPerPageChange = (newRowsPerPage: number) => {
        setRowsPerPage(newRowsPerPage)
    }


    const handleSearchChange = (event: any) => {
        setSearchQuery(event.target.value);
    };

    const handleEditModalClosed = () => {
        setIsEditModalOpened(false)
    }

    useEffect(() => {
        const filtered = sales.filter(sale => {
            const lowerCaseQuery = searchQuery.toLowerCase();
            return (
                sale._id.toLowerCase().includes(lowerCaseQuery)
            );
        });
        setFilteredSales(filtered);
    }, [searchQuery, sales]);

    return (
        <AttendantLayout pageName="Sales Managemwent">
            <div className="flex z-0 justify-between gap-2">
                <Toaster position="top-center" />
                <div>
                    <Input
                        placeholder="Search product..."
                        startContent={<SearchIcon className="" />}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        classNames={{
                            inputWrapper: "h-14 lg:w-80",
                        }}
                    />
                </div>
                <div>
                    <Button variant="flat" onClick={() => {
                        // setIsCreateModalOpened(true)
                    }} color="primary" className="h-14 font-poppins text-md">
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
                            {sale.attendant?.firstName} {sale.attendant?.middleName} {sale.attendant?.lastName}
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
                                    // setIsEditModalOpened(true);
                                    // setDataValue(sale);
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
                    <Form method="post">
                        <div className="flex justify-between">
                            <p className="text-default-500 font-poppins text-md">
                                <p className="text-default-500">
                                    Receipt No
                                </p>
                                {dataValue?._id}
                            </p>
                            <p className="font-poppins text-default-500 text-md">
                                <p>Attendant</p>
                                <p className="">{dataValue?.attendant.firstName} {dataValue?.attendant.middleName} {dataValue?.attendant.lastName}</p>
                            </p>
                        </div>

                        <p className="mt-10 font-poppins">Poduct Details</p>
                        <div className="flex justify-between mt-2 text-md text-default-500">
                            <div>
                                <p>Products</p>
                                <p className="">
                                    {dataValue.products.map((productDetail: SalesInterface, idx: number) => (
                                        <div className="" key={idx}>
                                            {/* Display the product name */}
                                            <div>{productDetail.product?.name}</div>
                                        </div>
                                    ))
                                    }
                                </p>
                            </div>
                            <div>
                                <p>Quantities</p>
                                <p>
                                    {dataValue.products.map((productDetail: SalesInterface, idx: number) => (
                                        <div className="" key={idx}>
                                            {/* Display the product name */}
                                            <div>{productDetail.quantity}</div>
                                        </div>
                                    ))
                                    }
                                </p>
                            </div>
                        </div>

                        <p className="mt-10 font-poppins">Payment Details</p>
                        <div className="flex justify-between mt-2">
                            <div className="text-default-500 text-md">
                                <p className="font-poppins">Total Amount</p>
                                <p className="font-poppins">GHC {dataValue?.totalAmount}</p>
                            </div>
                            <div className="text-default-500 text-md">
                                <p className="font-poppins"> Amount Paid</p>
                                <p className="font-poppins">GHC {dataValue?.amountPaid}</p>
                            </div>
                            <div className="text-default-500 text-md">
                                <p className="font-poppins">Balance</p>
                                <p className="font-poppins">GHC {dataValue?.balance}</p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <p className="font-poppins text-lg text-primary">Why Refund</p>
                            <Textarea
                                className="mt-2 font-poppins"
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
                                    className="mt-4 font-poppins"
                                    name="product"
                                >
                                    {dataValue.products.map((productDetail: SalesInterface) => (
                                        <SelectItem textValue={productDetail?.product.name} className="mt-4" key={productDetail.product?._id}>
                                            {productDetail.product?.name}
                                        </SelectItem>
                                    ))}

                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-end mt-6">
                            <Button color="primary" variant="flat" onClick={handleEditModalClosed}>Close</Button>
                            <button className=" bg-danger rounded-xl flex items-center justify-center gap-2 bg-opacity-20 text-danger h-10  font-poppins text-sm px-2" onClick={() => {
                                // setCartItemNewPrice(quantity * dataValue?.price);
                                // setIsEditModalOpened(false);
                            }}>
                                Procceed to Refund
                            </button>
                        </div>
                    </Form>
                )}
            </EditModal>
        </AttendantLayout>
    )
}

export default Sales

export const loader: LoaderFunction = async ({ request }) => {
    const { sales } = await salesController.salesFetch({ request });

    return { sales }
}