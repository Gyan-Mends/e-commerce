import { Skeleton } from "@nextui-org/react"
import { ReactNode, useEffect, useState } from "react"

interface CustomFolderCardInterface {
    children?: ReactNode,
    className?: string,
    title?: string
    image?: string
    header?: string
    description?: string
}

const CustomFolderCard = ({
    children,
    className,
    title,
    image,
    header,
    description

}: CustomFolderCardInterface) => {
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(true)
        }, 1000)
        return () => clearTimeout(timer)
    }, [])
    return (
        <Skeleton className="rounded-2xl" isLoaded={loading}>
            <div className="flex flex-col gap-6  p-2 shadow-sm rounded-2xl border">
                <div className=" h-12 w-12 rounded-lg bg-slate-200 p-1">
                    <img className="h-10 w-10" src={image} alt="image" />
                </div>
                <div className="">
                    <p>Header</p>
                    <p>description</p>
                </div>

            </div>
        </Skeleton>
    )
}

export default CustomFolderCard