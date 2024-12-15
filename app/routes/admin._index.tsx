import { useState, useEffect } from 'react';
import AdminLayout from "~/layout/adminLayout";
import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/node';
import { getSession } from '~/session';
import ProductIcon from '~/components/icons/ProductsIcon';
import CustomedCard from '~/components/ui/CustomedCard';
import adminDashboardController from '~/controllers/AdminDashBoardController';
import { Form, Link, useLoaderData } from '@remix-run/react';
import UserIcon from '~/components/icons/UserIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { RegistrationInterface, SalesInterface } from '~/interfaces/interface';
import CustomTable from '~/components/table/table';
import { SalesColumns } from '~/components/table/columns';
import { Button, TableCell, TableRow } from '@nextui-org/react';
import productsController from '~/controllers/productsController';
import SupplierIcon from '~/components/icons/SupplierIcon';
import CategoryIcon from '~/components/icons/CatIcon';
import SaleIcon from '~/components/icons/Sales';
import SalesIcon from '~/components/icons/SalesIcon';
import EditModal from '~/components/modal/EditModal';




const Admin = () => {
    const [dataValue, setDataValue] = useState<SalesInterface>();
    const [isEditModalOpened, setIsEditModalOpened] = useState(false)
    const [rowsPerPage, setRowsPerPage] = useState(8)
    const [isLoading, setIsLoading] = useState(false)
    const {
        user,
        productCount,
        usersCount,
        suppliersCount,
        categoryCount,
        sales,
        dailyTotal,
        weeklyTotal,
        monthlyTotal,
        yearlyTotal,
        olderTotal,
        total, totalAfterSales, totalProfitAfterSales
    } = useLoaderData<{
        user: RegistrationInterface[];
        productCount: number;
        usersCount: number;
        suppliersCount: number;
        categoryCount: number;
        sales: SalesInterface[];
        dailyTotal: number;
        weeklyTotal: number;
        monthlyTotal: number;
        yearlyTotal: number;
        olderTotal: number;
        total: number, totalAfterSales: number, totalProfitAfterSales: number
    }>(); const handleRowsPerPageChange = (newRowsPerPage: number) => {
        setRowsPerPage(newRowsPerPage)
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(true);
        }, 1000);
        return () => clearTimeout(timer); 
    }, []);

    const handleEditModalClosed = () => {
        setIsEditModalOpened(false)
    }

    // Graph data
    const graphData = [
        { name: "Daily", total: dailyTotal },
        { name: "Weekly", total: weeklyTotal },
        { name: "Monthly", total: monthlyTotal },
        { name: "Yearly", total: yearlyTotal },
        { name: "Older", total: olderTotal },
    ];


    return (
        <   AdminLayout pageName="Dashboard">


            <div className='mt-6 lg:grid lg:grid-cols-4 gap-4'>
                <Link to="/admin/products">
                <CustomedCard
                    title='Total Product'
                        total={productCount}
                    icon={
                        <ProductIcon className="h-[20px] w-[20px] text-success" />
                    }
                />
                </Link>
                <Link to="/admin/users">
                <CustomedCard
                        title='Total Users'
                        total={usersCount}
                    icon={
                        <UserIcon className="h-[20px] w-[20px] text-success" />
                    }
                />
                </Link>
                <Link to="/admin/suppliers">
                <CustomedCard
                        title='Total Suppliers'
                        total={suppliersCount}
                    icon={
                        <SupplierIcon className="h-[20px] w-[20px] text-success" />
                    }
                />
                </Link>
                <Link to="/admin/suppliers">
                <CustomedCard
                        title=' Categories'
                        total={categoryCount}
                    icon={
                        <CategoryIcon className="h-[20px] w-[20px] text-success" />
                    }
                />
                </Link>
            </div>



            <div className='mt-4 lg:grid lg:grid-cols-2 gap-4'>
                {/* chart */}
                <div>
                    <div className='h-[54vh] py-4 px-2  bg-[#333] shadow-md rounded-xl border border-black/5 dark:bg-[#333] dark:border-white/5 flex justify-between mt-2'>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={graphData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke="#ffffff" />
                                <YAxis stroke="#ffffff" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#333",
                                        border: "1px solid #555",
                                    }}
                                    labelStyle={{ color: "#ffffff" }}
                                    itemStyle={{ color: "#ffffff" }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="total" stroke="#4caf50" />
                            </LineChart>
                        </ResponsiveContainer>

                    </div>
                </div>

                <div className='flex flex-col gap-2 '>
                    <div className='grid grid-cols-3 gap-4'>
                        <div className='h-[26vh] py-2 px-4 flex flex-col gap-4  bg-[#333] shadow-md rounded-xl border border-white/5  dark:bg-[#333] dark:border-white/5 mt-2'>
                            <p className='font-nunito text-white'>Total Amount </p>
                            <SaleIcon className="h-[20px] w-[20px] text-success" />
                            <p className='font-nunito text-white'>GHC {total}</p>

                        </div>
                        <div className='h-[26vh] py-2 px-4 flex flex-col gap-4 bg-[#333] shadow-md rounded-xl border border-white/5  dark:bg-[#333] dark:border-white/5 mt-2'>
                            <p className='font-nunito text-white'>Amount After Sales</p>
                            <SaleIcon className="h-[20px] w-[20px] text-success" />
                            <p className='font-nunito text-white'>GHC {totalAfterSales}</p>

                        </div>
                        <div className='h-[26vh] py-2 px-4 flex flex-col gap-4 bg-[#333] shadow-md rounded-xl border border-white/5  dark:bg-[#333] dark:border-white/5 mt-2'>
                            <p className='font-nunito text-white'>Profit After Sales</p>
                            <SaleIcon className="h-[20px] w-[20px] text-success" />
                            <p className='font-nunito text-white'>GHC {totalProfitAfterSales}</p>


                        </div>
                    </div>
                    <div className='flex flex-col gap-6 mt-6'>
                        <div className='lg:grid lg:grid-cols-2 gap-6'>
                            <Link to="/admin/products">
                                <CustomedCard
                                    title='Daily Sales'
                                    total={"GHC " + dailyTotal}
                                    icon={
                                        <SaleIcon className="h-[20px] w-[20px] text-success" />
                                    }
                                />
                            </Link>
                            <Link to="/admin/users">
                                <CustomedCard
                                    title='Weekly Sales'
                                    total={"GHC " + weeklyTotal}
                                    icon={
                                        <SalesIcon className="h-[20px] w-[20px] text-success" />
                                    }
                                />
                            </Link>
                    </div>
                        <div className='lg:grid lg:grid-cols-2 gap-6'>
                            <Link to="/admin/products">
                                <CustomedCard
                                    title='Monthly Sales'
                                    total={"GHC " + monthlyTotal}
                                    icon={
                                        <SalesIcon className="h-[20px] w-[20px] text-success" />
                                    }
                                />
                            </Link>
                            <Link to="/admin/users">
                                <CustomedCard
                                    title='Yearly Sales'
                                    total={"GHC " + yearlyTotal}
                                    icon={
                                        <SalesIcon className="h-[20px] w-[20px] text-success" />
                                    }
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className='mb-5'>
                <div className='h-[54vh] py-4 px-2  mt-4 shadow-md rounded-xl  '>
                    <p className='font-nunito text-white'>Recent Sales</p>

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
                                <TableCell>GHC {sale?.amountLeft}</TableCell>
                                <TableCell>GHC {sale?.balance}</TableCell>
                                <TableCell className="relative flex items-center gap-4">
                                    <Button
                                        size="sm"
                                        color="success"
                                        variant="flat"
                                        onClick={() => {
                                            setIsEditModalOpened(true)
                                            setDataValue(sale)
                                        }}
                                    >
                                        View Customer Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </CustomTable>
                </div>
            </div>

            <EditModal modalTitle="Sale Payment" className="" onOpenChange={handleEditModalClosed} isOpen={isEditModalOpened}>
                {(onClose) => (
                    <Form method="post" action="">
                        <p> {dataValue?.payments.map((payment: SalesInterface, i: number) => (
                            <div className='flex flex-col gap-4' key={i}>
                                <p className='font-nunito'>Customer Name: {payment.customerName}</p>
                                <p className='font-nunito'>Customer Phone: {payment.customerNumber}</p>
                            </div>
                        ))}</p>
                    </Form>
                )}
            </EditModal>
        </AdminLayout>
    );
};

export default Admin;

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);

    const session = await getSession(request.headers.get("Cookie"));
    const token = session.get("email");
    if (!token) {
        return redirect("/")
    }

    // Fetch the sales data and totals
    const {
        productCount,
        usersCount,
        suppliersCount,
        categoryCount,
        sales,
        dailyTotal,
        weeklyTotal,
        monthlyTotal,
        yearlyTotal,
        olderTotal, total, totalAfterSales, totalProfitAfterSales   
    } = await adminDashboardController.getSales({
        request,
        page,
        limit: 10,
    });

    // Fetch product data (assuming productsController.FetchProducts works this way)
    const { user } = await productsController.FetchProducts({
        request,
        page,
    });

    // Return all the necessary data
    return json({
        productCount,
        usersCount,
        suppliersCount,
        categoryCount,
        sales,
        user,
        dailyTotal,
        weeklyTotal,  // Return the weeklyTotal
        monthlyTotal, // Return the monthlyTotal
        yearlyTotal,  // Return the yearlyTotal
        olderTotal,    // Return the olderTotal
        total, totalAfterSales, totalProfitAfterSales
    });
};


export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const intent = formData.get("intent") as string;

    switch (intent) {
        case "logout":
            const logout = await adminDashboardController.logout(intent)
            return logout

        default:
            return json({
                message: "Bad request",
                success: false,
                status: 500
            })
    }
}



