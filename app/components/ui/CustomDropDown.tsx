import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { ReactNode } from "react";
interface CustomDropDownInterface {
    children?: ReactNode | any
    name:string
    
}

const CustomDropDown = ({
    children,
    name
}:CustomDropDownInterface) => {
    return (
        <Dropdown>
            <DropdownTrigger>
                <Button
                    variant="bordered"
                >
                   {name}
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem>{children}</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}

export default CustomDropDown
