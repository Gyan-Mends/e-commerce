import { useNavigate } from "@remix-run/react"
import { useEffect } from "react"
import LoaderIcon from "~/components/icons/LoaderIcon"

const LandingPage = () => {
    const navigate  = useNavigate()

    useEffect(() => {
        setTimeout(() => {
            navigate("/login")
        }, 1000)
    }, [])
    return(
        <div className="w-full h-[100vh] bg-slate-950 flex flex-col items-center justify-center gap-4">
            <p className="font-montserrat font-bold text-5xl text-primary" >Point of Sales</p>
            <LoaderIcon className="h-40 w-40 text-white" />
        </div>
    )
}

export default  LandingPage