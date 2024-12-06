import { useState, useEffect } from "react";
import AdminLayout from "~/layout/adminLayout";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Button, Calendar, TableCell, TableRow } from "@nextui-org/react";
import Attendant from "~/layout/attendantLayout";
import attendanceDashboardController from "~/controllers/AttendanceDashBoardController";
import CustomedCard from "~/components/ui/CustomedCard";
import ProductIcon from "~/components/icons/ProductsIcon";
import CustomTable from "~/components/table/table";
import { SalesColumns } from "~/components/table/columns";
import { SalesInterface } from "~/interfaces/interface";
import { today, getLocalTimeZone } from "@internationalized/date";
import productsController from "~/controllers/productsController";


const Admin = () => {
    const { sales, counts } = useLoaderData<{
        sales: SalesInterface[];
        counts: { daily: number; weekly: number; monthly: number; yearly: number };
    }>();
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);

    const handleRowsPerPageChange = (newRowsPerPage: number) => {
        setRowsPerPage(newRowsPerPage);
    };

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Attendant pageName="Dashboard">
            {/* Statistics Cards */}
            <div className="mt-6 lg:grid lg:grid-cols-4 gap-4">
                <CustomedCard
                    title="Daily Sales"
                    total={counts.daily}
                    icon={<ProductIcon className="h-[20px] w-[20px] text-success" />}
                />
                <CustomedCard
                    title="Weekly Sales"
                    total={counts.weekly}
                    icon={<ProductIcon className="h-[20px] w-[20px] text-success" />}
                />
                <CustomedCard
                    title="Monthly Sales"
                    total={counts.monthly}
                    icon={<ProductIcon className="h-[20px] w-[20px] text-success" />}
                />
                <CustomedCard
                    title="Yearly Sales"
                    total={counts.yearly}
                    icon={<ProductIcon className="h-[20px] w-[20px] text-success" />}
                />
            </div>

            {/* Recent Sales Table */}
            <div className="mb-5 grid grid-cols-3 gap-10">
                <div className="col-span-2 px-2  shadow-md rounded-xl border border-black/5 dark:bg-[#333] dark:border-white/5 mt-6">
                    <CustomTable
                        columns={SalesColumns}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleRowsPerPageChange}
                    >
                        {sales.map((sale: SalesInterface, index: number) => (
                            <TableRow key={index}>
                                <TableCell>{sale._id}</TableCell>
                                <TableCell>
                                    {sale?.attendant?.firstName} {sale?.attendant?.middleName}
                                </TableCell>
                                <TableCell>GHC {sale?.totalAmount}</TableCell>
                                <TableCell>GHC {sale?.amountPaid}</TableCell>
                                <TableCell>GHC {sale?.balance}</TableCell>
                                <TableCell className="relative flex items-center gap-4">
                                    <Button
                                        size="sm"
                                        color="success"
                                        variant="flat"
                                        onClick={() => {
                                            // Refund logic
                                        }}
                                    >
                                        Refund
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </CustomTable>
                </div>
                <div className="border h-[50vh] border-black/5 dark:bg-[#333] dark:border-white/5 mt-6">
                    <Calendar
                        aria-label="Date (Min Date Value)"
                        defaultValue={today(getLocalTimeZone())}
                        minValue={today(getLocalTimeZone())}
                    />
                </div>
            </div>
        </Attendant>
    );
};

export default Admin;

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const { user } = await productsController.FetchProducts({
        request,
        page,
    });


    const { sales, counts } = await attendanceDashboardController.getSales({
        request,
        page,
        limit: 10, // Fetch 10 sales per page
    });

    return { sales, counts, user };
};
