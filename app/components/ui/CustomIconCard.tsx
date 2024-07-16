import { Skeleton } from "@nextui-org/react"
import { ReactNode, useEffect, useState } from "react"

interface CustomedCard {
    className: string,
    title: string,
    children: ReactNode,
    icon:ReactNode
}

const CustomedIconCard = ({ className, title, children,icon }: CustomedCard) => {
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(true);
        }, 1000);
        return () => clearTimeout(timer); // Cleanup the timer
    }, []);

    return (
        <Skeleton className="rounded-2xl" isLoaded={loading}>
            <div className={className}>
               <div className="">
                    {icon}
               </div>
               <div>
               <p className="font-nunito font-semibold">{title}</p>
               <p>{children}</p>
               </div>
            </div>
        </Skeleton>
    )
}

export default CustomedIconCard