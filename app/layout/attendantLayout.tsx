import { User } from "@nextui-org/react";
import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useTheme } from "next-themes";
import { ReactNode, useState } from "react";
import CloseIcon from "~/components/icons/CloseIcon";
import DashboardIcon from "~/components/icons/DashboardIcon";
import LogoutIcon from "~/components/icons/LogoutIcon";
import MoonIcon from "~/components/icons/MoonIcon";
import NavTogglerIcon from "~/components/icons/NavTogglerIcon";
import SunIcon from "~/components/icons/SunIcon";
import logo from "~/components/illustration/logo.png"
import productsController from "~/controllers/productsController";
import { RegistrationInterface } from "~/interfaces/interface";

interface UserLayoutProps {
    children: ReactNode;
    pageName: string;
}

const AttendantLayout = ({ children, pageName }: UserLayoutProps) => {
    const { theme, setTheme } = useTheme();
    const [desktopNav, setDesktopNav] = useState(true);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const { user } = useLoaderData<{ user: RegistrationInterface[] }>();


    const desktopNavToggle = () => {
        setDesktopNav(!desktopNav);
    };

    const mobileNavToggle = () => {
        setMobileNavOpen(!mobileNavOpen);
    };

    return (
        <div className={`  transition duration-500 ${theme === "light" ? " " : "dark:bg-[#191919]"}`}>
            {/* Desktop Side Navigation Bar */}
            <div className={`h-full hidden lg:block md:block w-64 dark:bg-[#333] text-white fixed transition-transform duration-500 p-6 ${desktopNav ? "transform-none" : "-translate-x-full"}`}>
                {/* logo */}
                <div className="flex items-center gap-2">
                    <div>
                    </div>
                    <div className="font-nunito text-2xl font-semibold">Best <span className="text-success">Way</span></div>
                </div>
                {/* profile */}
                <div className="font-nunito mt-10">
                    <User
                        name={`${user.firstName} ${user.middleName} ${user.lastName}`}
                        description={user.role === "attendant" ? "Attendant" : " "}
                        avatarProps={{
                            src: user.image || "https://i.pravatar.cc/150?u=default" // Fallback to placeholder if no image is provided
                        }}
                    ></User>

                </div>
                {/* Side Nav Content */}
                <ul className="mt-10">
                    <Link className="" to="/attendant">
                        <li className="hover:bg-primary-400 text-md hover:bg-white hover:text-success font-nunito text-md p-2 rounded-lg flex items-center gap-2">
                            <DashboardIcon className="text-md" />
                            Dashboard
                        </li>
                    </Link>
                    <Link className="" to="/attendant/sales">
                        <li className="hover:bg-primary-400 text-md hover:bg-white hover:text-success font-nunito text-md p-2 rounded-lg flex items-center gap-2">
                            <DashboardIcon className="text-md" />
                            Sales Point
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
                        <li className="hover:bg-primary-400 text-md hover:bg-white hover:text-success font-nunito p-2 rounded-lg flex items-center gap-2">
                            <DashboardIcon className="h-4 w-4" />
                            Dashboard
                        </li>
                    </Link>
                    <Link className="" to="/user/ticket">
                        <li className="hover:bg-primary-400 text-md hover:bg-white hover:text-success font-nunito p-2 rounded-lg flex items-center gap-2">
                            {/* <TicketIcon className="h-4 w-4" /> */}
                            Tickets
                        </li>
                    </Link>

                </ul>
            </div>

            {/* Page Content */}
            <div className={`p-4 transition-all duration-500 overflow-x-hidden z-1 ${desktopNav ? "lg:ml-64 md:ml-64" : ""}`}>
                {/* Top Nav */}
                <div className="h-14 rounded-2xl w-full bg-[#333] px-6 flex items-center justify-between">
                    {/* Overview */}
                    <div className="flex items-center gap-2 lg:gap-4">
                        {/* Mobile Nav Toggle */}
                        <button onClick={mobileNavToggle} className="block md:hidden lg:hidden">
                            <NavTogglerIcon className="text-success" />
                        </button>
                        {/* Desktop Nav Toggle */}
                        <button onClick={desktopNavToggle} className="hidden md:block lg:block">
                            <NavTogglerIcon className="text-success" />
                        </button>
                        <p className="font-nunito text-2xl text-white">{pageName}</p>
                    </div>

                    {/* Mode Switch and Logout */}
                    <div className="flex gap-4">
                        <button>
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
        </div>
    );
};

export default AttendantLayout;

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") as string) || 1;
    const search_term = url.searchParams.get("search_term") as string

    const { user } = await productsController.FetchProducts({
        request,
        page,
        search_term
    });

}
