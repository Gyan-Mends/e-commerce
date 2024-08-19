import React, { ReactNode } from "react";
import { Button } from "@nextui-org/react";

interface CustomButtonInterface {
    name?: ReactNode
    onClick: string | any
    className?: string
}

export default function CustomButton({
    name,
    onClick,
    className
}: CustomButtonInterface) {
    return (
        <Button
            className={className}
            onClick={onClick}
            color="primary">
            {name}
        </Button>
    );
}
