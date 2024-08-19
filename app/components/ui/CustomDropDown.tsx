import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { ReactNode } from "react";
interface CustomDropDownInterface {
    children?: ReactNode | any
}

const CustomDropDown = ({
    children
}:CustomDropDownInterface) => {
    return (
        <Dropdown>
            <DropdownTrigger>
                <Button
                    variant="bordered"
                >
                    Open Menu
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem>{children}</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}

export default CustomDropDown
