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


    const handleSearchChange = (event:any) => {
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
                {
                    sales.map((sale:SalesInterface, index:number) => (
                        
                    ))
                }
            </CustomTable>
        </AttendantLayout>
    )
}

export default Sales

export const loader: LoaderFunction = async ({ request }) => {
    const { sales } = await salesController.salesFetch({ request });

    return { sales }
}