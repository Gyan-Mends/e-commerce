import { useState, useEffect } from 'react';
import { Skeleton } from "@nextui-org/react";
import AdminLayout from "~/layout/adminLayout";
import EventIcon from '~/components/icons/EventsIcon';
import { LoaderFunction, redirect } from '@remix-run/node';
import {Calendar} from "@nextui-org/react";
import {today, getLocalTimeZone} from "@internationalized/date";
import { getSession } from '~/session';
import usersController from '~/controllers/Users';
import { useLoaderData } from '@remix-run/react';
import { SalesInterface } from '~/interfaces/interface';
import suppliersController from '~/controllers/Suppliers';
import UsersGroup from '~/components/icons/UsersGroup';
import SupplierIcon from '~/components/icons/SupplierIcon';
import productsController from '~/controllers/productsController';
import category from '~/controllers/categoryController';
import { Button, TableCell, TableRow } from "@nextui-org/react"
import CustomTable from '~/components/table/table';
import salesController from '~/controllers/sales';
import { AdminDashboardSalesColumns, SalesColumns } from '~/components/table/columns';
import ProfitIcon from '~/components/icons/ProfitIcon';


const Admin = () => {
    const [loading, setLoading] = useState(true);
    const { userCount, supplierCount, productsCount, categoryCount,profit } = useLoaderData<{ userCount: string, supplierCount: string, productsCount: string, categoryCount: string ,profit:string}>()
    const { adminsales } = useLoaderData<{ adminsales: SalesInterface[] }>()
    const [rowsPerPage, setRowsPerPage] = useState(8)
    const handleRowsPerPageChange = (newRowsPerPage: number) => {
        setRowsPerPage(newRowsPerPage)
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer); // Cleanup the timer
    }, []);
    const skeletons = Array(4).fill(0); // Create an array with 4 elements for sketons

    return (
        <AdminLayout pageName="Dashboard">
            <div className='lg:grid lg:grid-cols-3 gap-20 px-2'>
                <div className='col-span-2'>
                    {/* Events && category overview */}
                    {loading ? (
                        <div className='lg:grid lg:grid-cols-2 gap-10'>
                            {skeletons.slice(0, 2).map((_, index) => (
                                <Skeleton key={index} className="rounded-lg h-[85px] rounded-2xl transition-all duration-200" />
                            ))}
                        </div>
                    ) : (
                        // Sales && Refunds overview
                        <div className='lg:grid lg:grid-cols-2 gap-10'>
                            {/* events */}
                            <div className="h-[85px] rounded-2xl transition-all duration-200 bg-white  shadow-sm  dark:bg-slate-900 border border-white/5 flex items-center justify-between px-4">
                                <div className='flex '>
                                    <div className='flex gap-4'>
                                        {/* Other content here */}
                                        <div className='bg-primary h-12 w-12 dark:bg-indigo-500 flex items-center justify-center p-2 rounded-xl shadow-md'>
                                            <UsersGroup className="h-6 w-6  dark:text-white text-white" />
                                        </div>
                                        <div className='flex items-center text-white'>
                                            <span>
                                                <p className='text-black dark:text-white font-nunito text-lg'>{userCount}</p>
                                                <p className='text-black dark:text-white font-montserrat font-semibold text-sm'>Users</p>
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        {/* Other content here */}
                                    </div>
                                </div>
                            </div>
                            {/* category */}
                            <div className="h-[85px] rounded-2xl transition-all duration-200 bg-white  shadow-sm  dark:bg-slate-900 border border-white/5 flex items-center justify-between px-4">
                                <div className='flex '>
                                    <div className='flex gap-4'>
                                        {/* Other content here */}
                                        <div className='bg-primary h-12 w-12 dark:bg-indigo-500 flex items-center justify-center p-2 rounded-xl shadow-md'>
                                            <SupplierIcon className="h-6 w-6 dark:text-white text-white" />
                                        </div>
                                        <div className='flex items-center text-white'>
                                            <span>
                                                <p className='text-black dark:text-white font-nunito  text-lg'>{supplierCount}</p>
                                                <p className='text-black dark:text-white font-montserrat font-semibold text-sm'>Suppliers</p>
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        {/* Other content here */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                    {loading ? (
                        <div className='lg:grid lg:grid-cols-2  mt-6 gap-10'>
                            {skeletons.slice(0, 2).map((_, index) => (
                                <Skeleton key={index} className="rounded-lg rounded-2xl h-[85px] transition-all duration-200" />
                            ))}
                        </div>
                    ) : (
                        <div className='lg:grid lg:grid-cols-2 mt-6 gap-10'>
                            {/* Contestants */}
                            <div className="h-[85px] rounded-2xl transition-all duration-200 bg-white  shadow-sm  dark:bg-slate-900 border border-white/5 flex items-center justify-between px-4">
                                <div className='flex '>
                                    <div className='flex gap-4'>
                                        {/* Other content here */}
                                        <div className='bg-primary dark:bg-indigo-500 flex items-center justify-center p-2 rounded-xl shadow-md'>
                                            <EventIcon className="h-8 w-8 dark:text-white text-white" />
                                        </div>
                                        <div className='flex items-center text-white'>
                                            <span>
                                                <p className='text-black dark:text-white font-nunito text-lg'>{productsCount}</p>
                                                <p className='text-black dark:text-white font-montserrat font-semibold text-sm'>Products</p>
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        {/* Other content here */}
                                    </div>
                                </div>
                            </div>
                            {/* Edition */}
                            <div className="h-[85px] rounded-2xl transition-all duration-200 bg-white  shadow-sm  dark:bg-slate-900 border border-white/5 flex items-center justify-between px-4">
                                <div className='flex '>
                                    <div className='flex gap-4'>
                                        {/* Other content here */}
                                        <div className='bg-primary dark:bg-indigo-500 flex items-center justify-center p-2 rounded-xl shadow-md'>
                                            <EventIcon className="h-8 w-8 dark:text-white text-white" />
                                        </div>
                                        <div className='flex items-center text-white'>
                                            <span>
                                                <p className='text-black dark:text-white font-nunito text-lg'>{categoryCount}</p>
                                                <p className='text-black dark:text-white font-montserrat font-semibold text-sm'>Category</p>
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        {/* Other content here */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Chart */}
                    {/* Chart */}
                    {loading ? (
                        <div className=' mt-10 gap-10'>
                            {skeletons.slice(0, 1).map((_, index) => (
                                <Skeleton key={index} className="rounded-lg h-[55vh] transition-all duration-200" />
                            ))}
                        </div>
                    ) : (
                        <div className='mt-10 gap-10'>
                            <div className="h-[55vh] mt-4 lg:mt-0 md:mt-0 rounded-lg transition-all duration-200 bg-white shadow-lg dark:bg-slate-900 border border-white/5  px-4 py-4">
                                <p className='font-montserrat font-semibold'>Recent Sales</p>
                                <CustomTable rowsPerPage={rowsPerPage} onRowsPerPageChange={handleRowsPerPageChange} columns={AdminDashboardSalesColumns}>
                                    {adminsales.map((sale: SalesInterface, index: number) => (
                                        <TableRow key={index}>
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
                                                        // setIsEditModalOpened(true);
                                                        // setDataValue(sale);
                                                    }}
                                                >
                                                    Refund
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    color="primary"
                                                    variant="flat"
                                                    onClick={() => {
                                                        // const receipt = generateReceipt()
                                                        // const printWindow = window.open('', '_blank', 'width=800,height=600');
                                                        // printWindow?.document.write(receipt);
                                                        // printWindow?.document.close();
                                                        // printWindow?.print()
                                                        // setDataValue(sale)
                                                    }}
                                                >
                                                    Print
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </CustomTable>
                            </div>
                        </div>
                    )}
                </div>

                {/* Recent events */}
                {/* Recent events */}
                {loading ? (
                    <div className=''>
                        {skeletons.slice(0, 1).map((_, index) => (
                            <Skeleton key={index} className="rounded-lg h-[84vh] transition-all duration-200" />
                        ))}
                    </div>
                ) : (
                    <div>
                        <div className='bg-white h-[39vh] mt-20 lg:mt-0 md:mt-0 dark:bg-slate-900 border border-white/5 shadow-lg  w-full rounded-xl px-4 py-4'>
                            {/* Additional content or components */}
                            <Calendar
                                aria-label="Date (Read Only)"
                                value={today(getLocalTimeZone())}
                                isReadOnly
                                classNames={{
                                    headerWrapper: "dark:bg-slate-950",
                                    header:"dark:bg-slate-950",
                                    content: "dark:bg-slate-950 w-[21vw] border border-white/5 shadow-md"
                                }}
                            />
                        </div>
                        <div className='bg-white h-[39vh]  mt-10 dark:bg-slate-900 border border-white/5 shadow-lg  w-full rounded-xl px-4 py-4 relative'>
                            {/* Additional content or components */}
                            <p className='font-montserrat font-semibold'>Yearly Profit</p>
                            <div className='absolute flex justify-end'>
                                <ProfitIcon className="h-60 w-60 dark:opacity-10 opacity-50 text-gray-200 lg:ml-20 lg:mt-10 "/>
                            </div>
                            <div className=''>
                               <p className='font-nunito mt-8 text-4xl text-primary'> <span className='text-black dark:text-white'> GHC </span>{profit}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Admin;

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request.headers.get("Cookie"));
    const token = session.get("email");
    if (!token) {
        return redirect("/")
    }

    const { adminsales } = await salesController.salesFetch({ request });
    const { userCount } = await usersController.FetchUsers({ request });
    const { supplierCount } = await suppliersController.FetchSuppliers({ request })
    const { productsCount,profit } = await productsController.ProductFetch(request)
    const { categoryCount } = await category.CategoryFetch(request)
    return { userCount, supplierCount, productsCount, categoryCount, adminsales,profit }
}
