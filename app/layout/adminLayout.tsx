import { Button, User } from "@nextui-org/react";
import { ActionFunction, json } from "@remix-run/node";
import { Link, useSubmit } from "@remix-run/react";
import { useTheme } from "next-themes";
import { ReactNode, useState } from "react";
import CloseIcon from "~/components/icons/CloseIcon";
import DashboardIcon from "~/components/icons/DashboardIcon";
import LogoutIcon from "~/components/icons/LogoutIcon";
import MoonIcon from "~/components/icons/MoonIcon";
import NavTogglerIcon from "~/components/icons/NavTogglerIcon";
import SunIcon from "~/components/icons/SunIcon";
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
        <div className={`h-[100vh]  transition duration-500 ${theme === "light" ? "bg-gray-200" : "bg-slate-950"}`}>
            {/* Desktop Side Navigation Bar */}
            <div className={`h-full hidden lg:block md:block w-64 bg-primary text-white fixed transition-transform duration-500 p-6 ${desktopNav ? "transform-none" : "-translate-x-full"}`}>
                {/* logo */}
                <div className="flex items-center gap-2">
                    <div>
                        <img className="bg-white rounded-full h-10 w-10 " src={logo} alt="logo" />
                    </div>
                    <div className="font-nunito text-3xl">HelpDesk</div>
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
                    <Link className="" to="/admin">
                        <li className="hover:bg-primary-400 text-sm hover:bg-white hover:text-primary font-nunito p-1 rounded-lg flex items-center gap-2">
                            <DashboardIcon className="text-sm" />
                            Dashboard
                        </li>
                    </Link>
                    <Link className="" to="/admin/users">
                        <li className="hover:bg-primary-400 text-sm hover:bg-white hover:text-primary font-nunito p-1 rounded-lg flex items-center gap-2">
                            <DashboardIcon className="text-sm" />
                            Users
                        </li>
                    </Link>
                    <Link className="" to="/admin/suppliers">
                        <li className="hover:bg-primary-400 text-sm hover:bg-white hover:text-primary font-nunito p-1 rounded-lg flex items-center gap-2">
                            <DashboardIcon className="text-sm" />
                            Suppliers
                        </li>
                    </Link>
                    <Link className="" to="/admin/products">
                        <li className="hover:bg-primary-400 text-sm hover:bg-white hover:text-primary font-nunito p-1 rounded-lg flex items-center gap-2">
                            <DashboardIcon className="text-sm" />
                            Products
                        </li>
                    </Link>
                    <Link className="" to="/admin/category">
                        <li className="hover:bg-primary-400 text-sm hover:bg-white hover:text-primary font-nunito p-1 rounded-lg flex items-center gap-2">
                            <DashboardIcon className="text-sm" />
                            Products Categories
                        </li>
                    </Link>
                    <Link className="" to="/admin/sales">
                        <li className="hover:bg-primary-400 text-sm hover:bg-white hover:text-primary font-nunito p-1 rounded-lg flex items-center gap-2">
                            <DashboardIcon className="text-sm" />
                            Sales
                        </li>
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
                <div className="h-12 rounded-2xl w-full bg-primary px-6 flex items-center justify-between">
                    {/* Overview */}
                    <div className="flex items-center gap-2 lg:gap-4">
                        {/* Mobile Nav Toggle */}
                        <button onClick={mobileNavToggle} className="block md:hidden lg:hidden">
                            <NavTogglerIcon className="text-white" />
                        </button>
                        {/* Desktop Nav Toggle */}
                        <button onClick={desktopNavToggle} className="hidden md:block lg:block">
                            <NavTogglerIcon className="text-white" />
                        </button>
                        <p className="font-montserrat font-semibold text-2xl text-white">{pageName}</p>
                    </div>

                    {/* Mode Switch and Logout */}
                    <div className="flex gap-4">
                        <button onClick={() => {
                            setIsLogoutConfirmModalOpened(true)
                        }}>
                            <LogoutIcon className="text-danger-300" />
                        </button>
                        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                            {theme === "light" ? (
                                <SunIcon className="text-white" />
                            ) : (
                                <MoonIcon className="text-slate-950" />
                            )}
                        </button>
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

export const action: ActionFunction =async ({request}) => {
    const formData = await request.formData();
    const intent = formData.get("intent") as string;

    switch (intent) {
        case "logout":
         const logout =  await usersController.logout(intent)
         return logout
    
        default:
            return json({
                message: "Bad request",
                success: false,
                status: 500
            })
    }
}
