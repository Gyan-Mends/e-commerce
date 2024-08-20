import React, { ReactNode } from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import UserIcon from "../icons/UserIcon";
import CartIcon from "../icons/CartIcon";
interface CustomBreadCrumbsInterface {
    children?: ReactNode
}

const CustomBreadCrumbs = ({
    children
}: CustomBreadCrumbsInterface) => {
    return (
        <Breadcrumbs className="flex">
            <BreadcrumbItem><CartIcon className="" /></BreadcrumbItem>
            {children}
        </Breadcrumbs>
    );
}

export default CustomBreadCrumbs
