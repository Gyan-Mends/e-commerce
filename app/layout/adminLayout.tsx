import { Button, Skeleton, User } from "@nextui-org/react";
import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import { useTheme } from "next-themes";
import { ReactNode, useEffect, useState } from "react";
import CloseIcon from "~/components/icons/CloseIcon";
import DashboardIcon from "~/components/icons/DashboardIcon";
import LogoutIcon from "~/components/icons/LogoutIcon";
import MoonIcon from "~/components/icons/MoonIcon";
import NavTogglerIcon from "~/components/icons/NavTogglerIcon";
import NotificationIcon from "~/components/icons/NotificationIcon";
import ProductIcon from "~/components/icons/ProductsIcon";
import RefreshIcon from "~/components/icons/RefreshIcon";
import SettingsIcon from "~/components/icons/SettingsIcon";
import SunIcon from "~/components/icons/SunIcon";
import SupplierIcon from "~/components/icons/SupplierIcon";
import UsersGroup from "~/components/icons/UsersGroup";
import logo from "~/components/illustration/logo.png"
import ConfirmModal from "~/components/modal/confirmModal";
import usersController from "~/controllers/Users";

interface UserLayoutProps {
    children: ReactNode;
    pageName: string;
}

const AdminLayout = ({ children, pageName }: UserLayoutProps) => {
    const { theme, setTheme } = useTheme();
    const [desktopNav, setDesktopNav] = useState(true);
    const [mobileNavOpen, setMobileNavOpen] = useState(false); // Hide mobile nav by default
    const [isLogoutConfirmModalOpened, setIsLogoutConfirmModalOpened] = useState(false)
    const submit = useSubmit()
    const [isLoading, setIsLoading] = useState(false)

    const { user } = useLoaderData<{ user: { user: string } }>()
    useEffect(() => {
        const timeOut = setTimeout(() => {
            setIsLoading(true)
        }, 1000)

        return () => clearTimeout(timeOut)
    }, [])


    const desktopNavToggle = () => {
        setDesktopNav(!desktopNav);
    };
    const mobileNavToggle = () => {
        setMobileNavOpen(!mobileNavOpen);
    };
    const handleConfirmModalClosed = () => {
        setIsLogoutConfirmModalOpened(false);
    };

    return (
        <div className={`h-screen overflow-hidden transition-all duration-300 ease-in-out ${theme === "light" ? "bg-slate-100" : "bg-slate-950"}`}>
            {/* Desktop Side Navigation Bar */}
            <div className={`h-full hidden lg:block md:block w-64 dark:bg-primary shadow-sm dark:text-white fixed transition-transform duration-500 p-6 ${desktopNav ? "transform-none" : "-translate-x-full"}`}>
                {/* logo */}
                <div className="flex items-center gap-2">
                    <Skeleton isLoaded={isLoading} className="rounded-full">
                        <div>
                            <img className="bg-black rounded-full h-10 w-10 " src={logo} alt="logo" />
                        </div>
                    </Skeleton>
                    <Skeleton isLoaded={isLoading} className="rounded-lg">
                        <div className="font-montserrat text-lg">Ponit of sales</div>
                    </Skeleton>
                </div>
                {/* profile */}
                <div className=" mt-10">
                    <Skeleton isLoaded={isLoading} className="rounded-lg w-2/5">
                        <p className="font-nunito text-md">Dashboard</p>
                    </Skeleton>
                </div>
                {/* Side Nav Content */}
                <ul className="mt-6 pl-2 flex flex-col gap-2">
                    <Link className="" to="/admin">
                        <Skeleton isLoaded={isLoading} className="rounded-lg">
                            <li className="text-sm hover:bg-primary hover:text-primary hover:border-r-4 hover:border-r-white hover:text-white font-nunito p-1 rounded-lg hover:rounded-r-2xl flex items-center gap-2 transition-all duration-300 ease-in-out">
                                <span className="w-10 h-10 bg-gray-50 shadow-sm rounded-xl flex items-center justify-center">
                                    <DashboardIcon className="text-primary" />
                                </span>
                                Dashboard
                            </li>
                        </Skeleton>

                    </Link>
                    <Link className="" to="/admin/users">
                        <Skeleton isLoaded={isLoading} className="rounded-lg ">
                            <li className="hover:bg-primary-400 text-sm hover:bg-primary hover:text-primary hover:border-r-4 hover:border-r-white hover:text-white font-nunito p-1 rounded-lg hover:rounded-r-2xl flex items-center gap-2 transition-all duration-200 ease-in-out">
                                <span className="w-10 h-10 bg-gray-50 shadow-sm rounded-xl flex items-center justify-center">
                                    <UsersGroup className="text-primary text-lg" />
                                </span>
                                Users
                            </li>
                        </Skeleton>
                    </Link>
                    <Link className="" to="/admin/suppliers">
                        <Skeleton isLoaded={isLoading} className="rounded-lg ">
                            <li className="hover:bg-primary-400 text-sm hover:bg-primary hover:text-primary hover:border-r-4 hover:border-r-white hover:text-white font-nunito p-1 rounded-lg hover:rounded-r-2xl flex items-center gap-2 transition-all duration-300 ease-in-out">
                                <span className="w-10 h-10 bg-gray-50 shadow-sm rounded-xl flex items-center justify-center">
                                    <SupplierIcon className="text-primary text-lg" />
                                </span>
                                Suppliers
                            </li>
                        </Skeleton>
                    </Link>
                    <Link className="" to="/admin/products">
                        <Skeleton isLoaded={isLoading} className="rounded-lg ">
                            <li className="hover:bg-primary-400 text-sm hover:bg-primary hover:text-primary hover:border-r-4 hover:border-r-white hover:text-white font-nunito p-1 rounded-lg hover:rounded-r-2xl flex items-center gap-2 transition-all duration-300 ease-in-out">
                                <span className="w-10 h-10 bg-gray-50 shadow-sm rounded-xl flex items-center justify-center">
                                    <ProductIcon className="text-primary text-lg" />
                                </span>
                                Products
                            </li>
                        </Skeleton>
                    </Link>
                    <Link className="" to="/admin/category">
                        <Skeleton isLoaded={isLoading} className="rounded-lg ">
                            <li className="hover:bg-primary-400 text-sm hover:bg-primary hover:text-primary hover:border-r-4 hover:border-r-white hover:text-white font-nunito p-1 rounded-lg hover:rounded-r-2xl flex items-center gap-2 transition-all duration-300 ease-in-out">
                                <span className="w-10 h-10 bg-gray-50 shadow-sm rounded-xl flex items-center justify-center">
                                    <DashboardIcon className="text-primary text-lg" />
                                </span>
                                Categories
                            </li>
                        </Skeleton>
                    </Link>
                    <Link className="" to="/admin/sales">
                        <Skeleton isLoaded={isLoading} className="rounded-lg ">
                            <li className="hover:bg-primary-400 text-sm hover:bg-primary hover:text-primary hover:border-r-4 hover:border-r-white hover:text-white font-nunito p-1 rounded-lg hover:rounded-r-2xl flex items-center gap-2 transition-all duration-300 ease-in-out">
                                <span className="w-10 h-10 bg-gray-50 shadow-sm rounded-xl flex items-center justify-center">
                                    <DashboardIcon className="text-primary text-lg" />
                                </span>
                                Sales
                            </li>
                        </Skeleton>
                    </Link>
                    <Link className="" to="/admin/sales">
                        <Skeleton isLoaded={isLoading} className="rounded-lg ">
                            <li className="hover:bg-primary-400 text-sm hover:bg-primary hover:text-primary hover:border-r-4 hover:border-r-white hover:text-white font-nunito p-1 rounded-lg hover:rounded-r-2xl flex items-center gap-2 transition-all duration-300 ease-in-out">
                                <span className="w-10 h-10 bg-gray-[#F1F5F6] shadow-sm rounded-xl flex items-center justify-center">
                                    <DashboardIcon className="text-primary text-lg" />
                                </span>
                                Report
                            </li>
                        </Skeleton>
                    </Link>
                    <Link className="" to="/admin/sales">
                        <Skeleton isLoaded={isLoading} className="rounded-lg ">
                            <li className="hover:bg-primary-400 text-sm hover:bg-primary hover:text-primary hover:border-r-4 hover:border-r-white hover:text-white font-nunito p-1 rounded-lg hover:rounded-r-2xl flex items-center gap-2 transition-all duration-300 ease-in-out">
                                <span className="w-10 h-10 bg-gray-50 shadow-sm rounded-xl flex items-center justify-center">
                                    <SettingsIcon className="text-primary text-lg" />
                                </span>
                                Settings
                            </li>
                        </Skeleton>
                    </Link>


                </ul>
            </div>

            {/* Mobile Side Navigation Bar */}
            <div className={`h-full lg:hidden z-10  absolute md:hidden w-64 bg-primary bg-opacity-40  text-white backdrop-blur transition-transform duration-500 p-6 ${mobileNavOpen ? "transform-none" : "-translate-x-full"}`}>
                {/* Side Nav Content */}
                <button onClick={mobileNavToggle} className="block md:hidden ml-auto lg:hidden">
                    <CloseIcon className="text-danger-300" />
                </button>

                {/* logo */}
                <div className="flex items-center gap-2">
                    <div>
                        <img className="bg-white rounded-full h-10 w-10 " src={logo} alt="logo" />
                    </div>
                    <div className="font-nunito text-3xl">VoteEase</div>
                </div>
                {/* profile */}
                <div className=" mt-10">
                    <User
                        name="Jane Doe"
                        description="Product Designer"
                        avatarProps={{
                            src: "https://i.pravatar.cc/150?u=a04258114e29026702d"
                        }}
                    ></User>
                </div>
                {/* Side Nav Content */}
                <ul className="mt-10">
                    <Link className="" to="/user">
                        <li className="hover:bg-primary-400 text-md hover:bg-white hover:text-primary font-nunito p-2 rounded-lg flex items-center gap-2">
                            <DashboardIcon className="h-4 w-4" />
                            Dashboard
                        </li>
                    </Link>
                    <Link className="" to="/user/ticket">
                        <li className="hover:bg-primary-400 text-md hover:bg-white hover:text-primary font-nunito p-2 rounded-lg flex items-center gap-2">
                            <DashboardIcon className="h-4 w-4" />
                            Tickets
                        </li>
                    </Link>

                </ul>
            </div>


            {/* Page Content */}
            <div className={`p-4 transition-all duration-500 overflow-x-hidden z-1 ${desktopNav ? "lg:ml-64 md:ml-64" : ""}`}>
                {/* Top Nav */}
                <div className=" flex items-center justify-between">
                    {/* Overview */}
                    <div className="flex items-center gap-2 lg:gap-4 px-2">
                        <User
                            name={
                                <Skeleton isLoaded={isLoading} className="rounded-lg">
                                    <p className="font-nunito text-lg">
                                        John Doe
                                    </p>
                                </Skeleton>
                            }
                            description={
                                <Skeleton isLoaded={isLoading} className="rounded-lg mt-1">
                                    <p className="font-nunito text-sm">
                                        John Doe
                                    </p>
                                </Skeleton>
                            }
                            avatarProps={{
                                src: "https://i.pravatar.cc/150?u=a04258114e29026702d"
                            }}

                        />
                    </div>

                    {/* Mode Switch and Logout */}
                    <div className="flex gap-2">
                        <Skeleton isLoaded={isLoading} className="rounded-xl">
                        <button onClick={() => {
                            window.location.reload()
                        }}
                            className="border border-primary text-primary h-10 w-10 px-2 rounded-xl font-nunito flex items-center justify-center">
                            <RefreshIcon className="h-[20px] w-[20px]" />
                        </button>
                        </Skeleton>
                        <div className=" ">
                            <Skeleton isLoaded={isLoading} className="rounded-xl">
                                <Button
                                    className="border-b-2 border-b-white hover:"
                                    color="primary"
                                    onClick={() => {
                                        setIsLogoutConfirmModalOpened(true)
                                    }}>
                                    <LogoutIcon className=" h-[20px] w-[20px]" /> Logout
                                </Button>
                            </Skeleton>
                        </div>
                        <div className=" ">
                            <Skeleton isLoaded={isLoading} className="rounded-xl">
                                <Button
                                    className="border-b-2 border-b-white hover:"
                                    color="primary" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                                    {theme === "light" ? (
                                        <>
                                            <SunIcon className="h-[20px] w-[20px] dark:text-white" />
                                            <p>Light Mode</p>
                                        </>
                                    ) : (
                                        <>
                                            <MoonIcon className="h-[20px] w-[20px] dark:text-white" />
                                            <p>Dark Mode</p>
                                        </>
                                    )}
                                </Button>
                            </Skeleton>
                        </div>
                    </div>

                </div>

                {/* Main Content */}
                <div className="mt-4">
                    {children}
                </div>
            </div>

            <ConfirmModal className="dark:bg-slate-950 border border-white/5" header="Confirm Logout" content="Are you sure to logout?" isOpen={isLogoutConfirmModalOpened} onOpenChange={handleConfirmModalClosed}>
                <div className="flex gap-4">
                    <Button color="primary" variant="flat" className="font-montserrat font-semibold" size="sm" onPress={handleConfirmModalClosed}>
                        No
                    </Button>
                    <Button color="danger" variant="flat" className="font-montserrat font-semibold " size="sm" onClick={() => {
                        setIsLogoutConfirmModalOpened(false)
                        submit({
                            intent: "logout",
                        }, {
                            method: "post"
                        })
                    }} >
                        Yes
                    </Button>
                </div>
            </ConfirmModal>
        </div>
    );
};

export default AdminLayout;

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const intent = formData.get("intent") as string;

    switch (intent) {
        case "logout":
            const logout = await usersController.logout(intent)
            return logout

        default:
            return json({
                message: "Bad request",
                success: false,
                status: 500
            })
    }
}

export const loader: LoaderFunction = async () => {
    const { user } = await usersController.FetchUsers()

    return { user }
}
