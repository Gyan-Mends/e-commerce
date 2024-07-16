import { Skeleton } from "@nextui-org/react"
import { useEffect, useState } from "react"

interface CustomCardInterfca {
    children: string,
    className: string,
    title:string
}

const CustomCard = ({
    children,
    className,
    title
}: CustomCardInterfca) => {
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(true)
        }, 1000)
        return () => clearTimeout(timer)
    }, [])
    return (
        <Skeleton isLoaded={loading}>
            <div className={className}>
                <p className="font-montserat font-semibold">{title}</p>
                {children}
            </div>
        </Skeleton>
    )
}

export default CustomCard