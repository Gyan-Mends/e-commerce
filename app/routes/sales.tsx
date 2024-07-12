import { Button, Input, TableCell, TableRow, User } from "@nextui-org/react"
import { LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"
import PlusIcon from "~/components/icons/PlusIcon"
import { SearchIcon } from "~/components/icons/SearchIcon"
import { SalesColumns } from "~/components/table/columns"
import CustomTable from "~/components/table/table"
import salesController from "~/controllers/sales"
import { SalesInterface } from "~/interfaces/interface"
import AttendantLayout from "~/layout/attendantLayout"

const Sales = () => {
    const [rowsPerPage, setRowsPerPage] = useState(8)
    const { sales } = useLoaderData<{ sales: SalesInterface[] }>()
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSales, setFilteredSales] = useState(sales);

    const handleRowsPerPageChange = (newRowsPerPage: number) => {
        setRowsPerPage(newRowsPerPage)
    }


    const handleSearchChange = (event: any) => {
        setSearchQuery(event.target.value);
    };

    useEffect(() => {
        const filtered = sales.filter(sale => {
            const lowerCaseQuery = searchQuery.toLowerCase();
            return (
                sale.totalAmount.toLowerCase().includes(lowerCaseQuery)
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
                        <TableCell className="text-md">
                            {sale.products.map((productDetail, idx) => (
                                <div className="" key={idx}>
                                    {/* Assuming you want to display the product name and quantity */}
                                    <div> {productDetail.product}</div>
                                </div>
                            ))}
                        </TableCell>
                        <TableCell className="text-md">
                            {sale.products.map((productDetail, idx) => (
                                <div className="" key={idx}>
                                    {/* Assuming you want to display the product name and quantity */}
                                    <div>{productDetail.quantity}</div>
                                </div>
                            ))}
                        </TableCell>
                        <TableCell className="text-md">
                             {sale.attendant}
                        </TableCell>
                        <TableCell className="text-md">
                            GHC {sale.totalAmount}
                        </TableCell>
                        <TableCell className="text-md">
                            GHC {sale.amountPaid}
                        </TableCell>
                        <TableCell className="text-md">
                            GHC {sale.balance}
                        </TableCell>
                        <TableCell className="text-md">
                            {sale.createdAt}
                        </TableCell>
                        <TableCell className="relative flex items-center gap-4">
                            <Button
                                color="success"
                                variant="flat"
                                onClick={() => {
                                    setIsEditModalOpened(true);
                                    setDataValue(sale);
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                color="success"
                                variant="flat"
                                onClick={() => {
                                    setIsEditModalOpened(true);
                                    setDataValue(sale);
                                }}
                            >
                                Print
                            </Button>
                            <Button
                                color="danger"
                                variant="flat"
                                onClick={() => {
                                    setIsConfirmModalOpened(true);
                                    setDataValue(sale);
                                }}
                            >
                                Delete
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </CustomTable>

        </AttendantLayout>
    )
}

export default Sales

export const loader: LoaderFunction = async ({ request }) => {
    const { sales } = await salesController.salesFetch({ request });

    return { sales }
}