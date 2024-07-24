import { useState, useEffect } from 'react';
import { LoaderFunction, redirect } from '@remix-run/node';
import { getSession } from '~/session';
import AttendantLayout from '~/layout/attendantLayout';
import CustomCard from '~/components/ui/customCard';
import { getGreeting } from '~/components/ui/greeting';
import CustomedIconCard from '~/components/ui/CustomIconCard';
import usersController from '~/controllers/Users';
import { useLoaderData } from '@remix-run/react';
import salesController from '~/controllers/sales';
import { Button, Calendar, TableCell, TableRow } from '@nextui-org/react';
import { today, getLocalTimeZone } from "@internationalized/date";
import SalesIcon from '~/components/icons/SalesIcon';
import CustomTable from '~/components/table/table';
import { SalesInterface } from '~/interfaces/interface';
import { AdminDashboardSalesColumns } from '~/components/table/columns';



const Attendant = () => {
    const [loading, setLoading] = useState(true);
    const [greeting, setGreeting] = useState<any>()
    const { dailySales } = useLoaderData<{ dailySales: SalesInterface[] }>()
    const { user, salesCount } = useLoaderData<{ user: { firstName: string, lastName: string }, salesCount: number }>()
    const [rowsPerPage, setRowsPerPage] = useState(8)
    const handleRowsPerPageChange = (newRowsPerPage: number) => {
        setRowsPerPage(newRowsPerPage)
    }
    useEffect(() => {
        setGreeting(getGreeting())
    }, [])
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer); // Cleanup the timer
    }, []);

    const skeletons = Array(4).fill(0); // Create an array with 4 elements for sketons

    return (
        <AttendantLayout pageName="Dashboard">
            <div className='lg:grid lg:grid-cols-3 gap-20'>
                <div className='col-span-2'>
                    <div className='lg:grid lg:grid-cols-2 gap-10'>
                        <div>
                            {/* greeting container */}
                            <CustomCard className='w-full h-60 p-4 bg-white shadow-sm dark:bg-slate-900 border border-white/5 rounded-2xl' title='' >
                                <p className='font-montserrat font-semibold text-4xl'>{greeting}</p>
                                <p className='font-nunito text-2xl text-primary mt-4'>{user.firstName + " " + user.lastName}</p>
                            </CustomCard>
                        </div>

                        <div className='flex flex-col gap-6'>
                            <CustomedIconCard className='w-full h-[13vh] p-4 bg-white shadow-sm dark:bg-slate-900 border border-white/5 rounded-2xl' title='Daily Sales' icon={<SalesIcon className="h-10 w-10" />}>
                                <p className='font-nunito font-semibold xl'>{salesCount}</p>
                            </CustomedIconCard>
                            <CustomedIconCard className='w-full h-[13vh]  p-4 bg-white shadow-sm dark:bg-slate-900 border border-white/5 rounded-2xl' title='Daily Sales' icon={<SalesIcon className="h-10 w-10" />}>
                                <p className='font-nunito font-semibold xl'>{salesCount}</p>
                            </CustomedIconCard>
                        </div>
                    </div>

                    <div className='mt-10 '>
                        <CustomCard className='w-full h-[52vh] p-4 bg-white shadow-sm dark:bg-slate-900 border border-white/5 rounded-2xl overflow-y-scroll' title='Daily Sales Summery' >
                        <CustomTable rowsPerPage={rowsPerPage} onRowsPerPageChange={handleRowsPerPageChange} columns={AdminDashboardSalesColumns}>
                                    {dailySales.map((sale: SalesInterface, index: number) => (
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
                        </CustomCard>
                    </div>
                </div>

                <div>
                    <CustomCard className='w-full h-80 p-4 bg-white shadow-sm dark:bg-slate-900 border border-white/5 rounded-2xl' title='' >
                        <Calendar
                            aria-label="Date (Read Only)"
                            value={today(getLocalTimeZone())}
                            isReadOnly
                            classNames={{
                                headerWrapper: "dark:bg-slate-950",
                                header: "dark:bg-slate-950",
                                content: "dark:bg-slate-950 w-[21vw] border border-white/5 shadow-md"
                            }}
                        />
                    </CustomCard>
                </div>
            </div>
        </AttendantLayout>
    );
};

export default Attendant;

export const loader: LoaderFunction = async ({ request }) => {
    const session = getSession(request.headers.get("Cookie"));
    const token = (await session).get("email")

    if (!token) {
        return redirect("/login")
    }

    const { user } = await usersController.FetchUsers({ request })
    const { salesCount } = await salesController.salesFetch({ request })
    const { dailySales } = await salesController.salesFetch({ request });

    return { user, salesCount,dailySales }
}
