import { Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenuItem, NavbarMenu, NavbarContent, NavbarItem, Button } from "@nextui-org/react";
import { ReactNode, useState } from "react";
import logo from "../components/illustration/logotype.png"
import { Link } from "@remix-run/react";
import { SearchIcon } from "~/components/icons/SearchIcon";
import CartIcon from "~/components/icons/CartIcon";
import { useTheme } from "next-themes";
import SunIcon from "~/components/icons/SunIcon";
import MoonIcon from "~/components/icons/MoonIcon";



const PublicLayout = ({ children }: { children: ReactNode }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    // const { theme, setTheme } = useTheme()
    const menuItems = [
        "Profile",
        "Dashboard",
        "Activity",
        "Analytics",
        "System",
        "Deployments",
        "My Settings",
        "Team Settings",
        "Help & Feedback",
        "Log Out",
    ];
    return (
        <div className={`  overflow-x-hidden `}>
            {/* navigation bar */}
            <Navbar
                isBordered={false}
                isMenuOpen={isMenuOpen}
                onMenuOpenChange={setIsMenuOpen}
                isBlurred
                position="static"
                className="py-2"

            >
                <NavbarContent className="lg:hidden">
                    <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
                </NavbarContent>

                <NavbarContent className="lg:-ml-64 hidden lg:flex" justify="start">
                    <NavbarItem className="">
                        <img src={logo} alt="" />
                    </NavbarItem>
                    <NavbarItem className="flex gap-10 ml-10">
                        <Link className="font-poppins" to="">
                            Home
                        </Link>
                        <Link className="font-poppins" to="">
                            Shop
                        </Link>
                        <Link className="font-poppins" to="">
                            About
                        </Link>
                        <Link className="font-poppins" to="">
                            Contact
                        </Link>
                    </NavbarItem>
                </NavbarContent>

                <NavbarContent className=" lg:-mr-60 flex gap-2 lg:gap-8" justify="end">
                    <NavbarItem>
                        <Link className="font-nunito " to="">
                            Login
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <button className="flex gap-4 dark:bg-slate-900 dark:border-white/5 bg-gray-100 rounded-xl h-10 items-center px-4 shadow-sm border border-black/5 hover:bg-gray-200 transition-all duration-600">
                            <SearchIcon className="text-gray-600" />
                            <p className="font-nunito  text-sm text-gray-600">Search product...</p>
                        </button>
                    </NavbarItem>
                    <NavbarItem>
                        <Link to="">
                            <CartIcon className="h-8 w-8 text-gray-600" />
                        </Link>
                    </NavbarItem>
                    {/* <NavbarItem>
                        <button
                            className="flex items-center justify-center"
                            onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                            {theme === "light" ? (
                                <>
                                    <SunIcon className="h-[24px] w-[24px] dark:text-white" />
                                </>
                            ) : (
                                <>
                                    <MoonIcon className="h-[20px] w-[20px] text-slate-700 " />
                                </>
                            )}
                        </button>
                    </NavbarItem> */}
                </NavbarContent>

                <NavbarMenu>
                    {menuItems.map((item, index) => (
                        <NavbarMenuItem key={`${item}-${index}`}>
                            <Link
                                className="w-full"
                                color={
                                    index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"
                                }
                                href="#"
                                size="lg"
                            >
                                {item}
                            </Link>
                        </NavbarMenuItem>
                    ))}
                </NavbarMenu>
            </Navbar>

            {/* page contents */}
            <main className=" lg:px-8 px-4">
                {children}
            </main>
            {/* footer */}
        </div>
    )
}

export default PublicLayout