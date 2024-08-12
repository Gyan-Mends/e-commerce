import { useState, useEffect } from 'react';
import { Skeleton } from "@nextui-org/react";
import AdminLayout from "~/layout/adminLayout";
import EventIcon from '~/components/icons/EventsIcon';
import { LoaderFunction, redirect } from '@remix-run/node';
import { Calendar } from "@nextui-org/react";
import { today, getLocalTimeZone } from "@internationalized/date";
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
import dashboardController from '~/controllers/dashboard';
import NotificationIcon from '~/components/icons/NotificationIcon';
import ProductIcon from '~/components/icons/ProductsIcon';
import ArrowsIcon from '~/components/icons/ArrowsIcon';


const Admin = () => {
    const [loading, setLoading] = useState(true);
    const { userCount, supplierCount, productsCount, categoryCount, profit, allSales } = useLoaderData<{ userCount: string, supplierCount: string, productsCount: string, categoryCount: string, profit: string, allSales: SalesInterface }>()
    const { adminsales } = useLoaderData<{ adminsales: SalesInterface[] }>()
    const [rowsPerPage, setRowsPerPage] = useState(8)
    const [isLoading, setIsLoading] = useState(false)
    const handleRowsPerPageChange = (newRowsPerPage: number) => {
        setRowsPerPage(newRowsPerPage)
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(true);
        }, 1000);
        return () => clearTimeout(timer); // Cleanup the timer
    }, []);
    const skeletons = Array(4).fill(0); // Create an array with 4 elements for sketons

    return (
        <AdminLayout pageName="Dashboard">
            <div className='px-2'>
                <Skeleton isLoaded={isLoading} className='rounded-xl mt-2'>
                    <div className='py-4 px-10 bg-slate-50 shadow-sm rounded-xl border-b-2 border-b-primary  dark:bg-slate-900  flex justify-between mt-2'>
                        <div className='flex gap-4'>
                            <div className='w-12 h-12 bg-black rounded-full flex items-center justify-center'>
                                <NotificationIcon className="h-[20px] w-[20px] text-white" />
                            </div>
                            <div>
                                <p className='font-nunito'>Notification Header</p>
                                <p className='font-nunito text-sm'>We have observer a decline in your performance over the past two weeks</p>
                            </div>
                        </div>
                        <div>
                            <Button
                                className="border-b-4 border-b-white font-nunito"
                                color="primary"
                            >
                                View All
                            </Button>
                        </div>
                    </div>
                </Skeleton>
            </div>

            <div className='mt-6 lg:grid lg:grid-cols-4 gap-4'>
                <Skeleton isLoaded={isLoading} className='rounded-2xl'>
                    <div className="rounded-2xl transition-all duration-200 bg-slate-50 border border-black/5  shadow-sm  dark:bg-slate-900 dark:border-white/5 py-2 px-4 flex flex-col gap-2">
                        <div className='flex'>
                            <p className='font-nunito'>Total Products</p>
                            <p className='font-nunito'></p>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <div className='h-10 w-10 rounded-full shadow-sm bg-white flex items-center justify-center'>
                                <ProductIcon className="h-[20px] w-[20px] text-primary" />
                            </div>
                            <p className='font-nunito font-semibold  text-xl'>245</p>
                        </div>
                    </div>
                </Skeleton>
                <Skeleton isLoaded={isLoading} className='rounded-2xl'>
                    <div className="rounded-2xl transition-all duration-200 bg-slate-50 border border-black/5 shadow-sm  dark:bg-slate-900 dark:border-white/5 py-2 px-4 flex flex-col gap-2">
                        <div className='flex'>
                            <p className='font-nunito'>Total Products</p>
                            <p className='font-nunito'></p>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <div className='h-10 w-10 rounded-full shadow-sm bg-white flex items-center justify-center'>
                                <ProductIcon className="h-[20px] w-[20px] text-primary" />
                            </div>
                            <p className='font-nunito font-semibold  text-xl'>245</p>
                        </div>
                    </div>
                </Skeleton>
                <Skeleton isLoaded={isLoading} className='rounded-2xl'>
                    <div className="rounded-2xl transition-all duration-200 bg-slate-50 border border-black/5 shadow-sm  dark:bg-slate-900 dark:border-white/5 py-2 px-4 flex flex-col gap-2">
                        <div className='flex'>
                            <p className='font-nunito'>Total Products</p>
                            <p className='font-nunito'></p>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <div className='h-10 w-10 rounded-full shadow-sm bg-white flex items-center justify-center'>
                                <ProductIcon className="h-[20px] w-[20px] text-primary" />
                            </div>
                            <p className='font-nunito font-semibold  text-xl'>245</p>
                        </div>
                    </div>
                </Skeleton>
                <Skeleton isLoaded={isLoading} className='rounded-2xl'>
                    <div className="rounded-2xl transition-all duration-200 bg-slate-50 border border-black/5 shadow-sm  dark:bg-slate-900 dark:border-white/5 py-2 px-4 flex flex-col gap-2">
                        <div className='flex'>
                            <p className='font-nunito'>Total Products</p>
                            <p className='font-nunito'></p>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <div className='h-10 w-10 rounded-full shadow-sm bg-white flex items-center justify-center'>
                                <ProductIcon className="h-[20px] w-[20px] text-primary" />
                            </div>
                            <p className='font-nunito font-semibold  text-xl'>245</p>
                        </div>
                    </div>
                </Skeleton>
            </div>

            <div className='mt-4 lg:grid lg:grid-cols-2 gap-4'>
                {/* chart */}
                <div>
                    <Skeleton isLoaded={isLoading} className='rounded-xl mt-2'>
                        <div className='h-[54vh] py-4 px-2 bg-slate-50 shadow-sm rounded-xl border border-black/5 dark:bg-slate-900 dark:border-white/5 flex justify-between mt-2'>
                            <p className='font-nunito'>Graph</p>
                        </div>
                    </Skeleton>
                </div>

                <div className='flex flex-col gap-2'>
                    <div className='lg:grid lg:grid-cols-2 gap-6'>
                        {/* Calender */}
                        <div>
                            <Skeleton isLoaded={isLoading} className='rounded-xl mt-2'>
                                <div className='h-[25vh] py-4 px-10 bg-slate-50 shadow-sm rounded-xl border border-black/5  dark:bg-slate-900 dark:border-white/5 flex justify-between mt-2'>
                                    {/* <Calendar
                                    style={{ height: '100%', width: '100%' }}
                                        aria-label="Date (Read Only)"
                                        value={today(getLocalTimeZone())}
                                        isReadOnly
                                        classNames={{
                                            headerWrapper: "dark:bg-slate-900",
                                            header: "dark:bg-slate-900",
                                            content: "dark:bg-slate-900 border border-white/5 shadow-md"
                                        }}
                                    /> */}
                                </div>
                            </Skeleton>
                        </div>
                        <div>
                            <Skeleton isLoaded={isLoading} className='rounded-xl mt-2'>
                                <div className='h-[25vh] py-4 px-10 bg-slate-50 shadow-sm rounded-xl border border-black/5  dark:bg-slate-900 dark:border-white/5 flex justify-between mt-2'>

                                </div>
                            </Skeleton>
                        </div>
                    </div>
                    <div>
                        <Skeleton isLoaded={isLoading} className='rounded-xl mt-2'>
                            <div className='h-[26vh] py-2 px-4 bg-slate-50 shadow-sm rounded-xl border border-black/5  dark:bg-slate-900 dark:border-white/5 mt-2'>
                                <p className='font-nunito'>Recent Sales</p>
                                {allSales.map((sale: SalesInterface, index: number) => {
                                    <div key={index} className='h-[17vh] mt-4 w-[18vw] border border-2 shadow-sm rounded-xl dark:border-white/5 p-2'>
                                        <div className='flex justify-between'>
                                            <span><p className='font-nunito text-sm'>{sale.product.name}</p></span>
                                            <span className='h-6 w-20 bg-primary rounded-lg bg-opacity-30 font-nunito flex items-center justify-center text-xs'>Sold</span>
                                        </div>
                                        <div className='flex justify-between mt-2'>
                                            <span><p className='font-nunito text-xs'>{sale.attendant.firstName+ " " + sale.attendant.lastName}</p></span>
                                            <span className='font-nunito text-xs'>2 minutes ago</span>
                                        </div>
                                        <div className='flex justify-between mt-4'>
                                            <span><p className='font-nunito text-xs h-12 border w-28 rounded-lg border-primary flex items-center justify-center text-primary dark:text-white'>{sale.quantity} Items <ArrowsIcon className="ml-2 h-4 w-4" /></p></span>
                                            <span><p className='font-nunito text-xs text-white h-12 bg-primary w-28 rounded-lg flex items-center justify-center'>GHC {sale.totalAmount}</p></span>
                                        </div>
                                    </div>
                                })}
                            </div>
                        </Skeleton>
                    </div>
                </div>
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

    const {
        adminsales,
        userCount,
        supplierCount,
        productsCount,
        profit,
        categoryCount
    } = await dashboardController.Dashboard();

    const { allSales } = await salesController.salesFetch({ request })


    return { userCount, supplierCount, productsCount, categoryCount, adminsales, profit, allSales }
}
