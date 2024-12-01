import { useState, useEffect } from 'react';
import AdminLayout from "~/layout/adminLayout";
import { LoaderFunction, redirect } from '@remix-run/node';
import { getSession } from '~/session';
import ProductIcon from '~/components/icons/ProductsIcon';
import CustomedCard from '~/components/ui/CustomedCard';



const Admin = () => {
    const [loading, setLoading] = useState(true);


    const [rowsPerPage, setRowsPerPage] = useState(8)
    const [isLoading, setIsLoading] = useState(false)
    const handleRowsPerPageChange = (newRowsPerPage: number) => {
        setRowsPerPage(newRowsPerPage)
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(true);
        }, 1000);
        return () => clearTimeout(timer); 
    }, []);


    return (
        <   AdminLayout pageName="Dashboard">


            <div className='mt-6 lg:grid lg:grid-cols-4 gap-4'>
                <CustomedCard
                    title='Total Product'
                    total='445'
                    icon={
                        <ProductIcon className="h-[20px] w-[20px] text-success" />
                    }
                />
                <CustomedCard
                    title='Total Product'
                    total='445'
                    icon={
                        <ProductIcon className="h-[20px] w-[20px] text-success" />
                    }
                />
                <CustomedCard
                    title='Total Product'
                    total='445'
                    icon={
                        <ProductIcon className="h-[20px] w-[20px] text-success" />
                    }
                />
                <CustomedCard
                    title='Total Product'
                    total='445'
                    icon={
                        <ProductIcon className="h-[20px] w-[20px] text-success" />
                    }
                />
            </div>

            <div className='mt-4 lg:grid lg:grid-cols-2 gap-4'>
                {/* chart */}
                <div>
                    <div className='h-[54vh] py-4 px-2  bg-[#333] shadow-md rounded-xl border border-black/5 dark:bg-[#333] dark:border-white/5 flex justify-between mt-2'>
                        <p className='font-nunito text-white'>Graph</p>
                    </div>
                </div>

                <div className='flex flex-col gap-2'>
                    <div className='lg:grid lg:grid-cols-2 gap-6'>
                        {/* Calender */}
                        <div>
                            <div className='h-[25vh] py-4 px-10  bg-[#333] shadow-md rounded-xl border border-white/5  dark:bg-[#333] dark:border-white/5 flex justify-between mt-2'>

                            </div>
                        </div>
                        <div>
                            <div className='h-[25vh] py-4 px-10 bg-[#333] shadow-md rounded-xl border border-white/5  dark:bg-[#333] dark:border-white/5 flex justify-between mt-2'>

                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='h-[26vh] py-2 px-4  bg-[#333] shadow-md rounded-xl border border-white/5  dark:bg-[#333] dark:border-white/5 mt-2'>
                            <p className='font-nunito text-white'>Recent Sales</p>

                        </div>
                    </div>
                </div>
            </div>
            <div className='mb-5'>
                <div className='h-[54vh] py-4 px-2  bg-[#333] shadow-md rounded-xl border border-black/5 dark:bg-[#333] dark:border-white/5  mt-6 '>
                    <p className='font-nunito text-white'>Table</p>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Admin;


