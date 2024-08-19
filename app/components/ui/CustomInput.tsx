import { Input } from "@nextui-org/react"

interface customInputProps {
    label?: string
    isRequired?: boolean
    isClearable?: boolean
    name?: string
    placeholder?: string
    type?: string
    labelPlacement?: string
    defaultValue?: string
    endContent?: string
}
const CustomInput = ({
    label,
    isRequired,
    isClearable,
    name,
    placeholder,
    type,
    labelPlacement,
    defaultValue,
    endContent
}: customInputProps) => {
    return (
        <div>
            <Input
                endContent={endContent}
                defaultValue={defaultValue}
                label={label}
                isRequired={isRequired}
                isClearable={isClearable}
                name={name}
                placeholder={placeholder}
                type={type}
                labelPlacement={labelPlacement}
                classNames={{
                    label: "font-nunito text-sm text-default-100",
                    inputWrapper: "bg-white shadow-sm dark:bg-slate-900 border border-white/5 focus:bg-slate-900 focus focus:bg-slate-900 hover:border-b-primary hover:transition-all hover:duration-300 hover:ease-in-out hover:bg-white"
                }}
            />
        </div>
    )
}

export default CustomInput