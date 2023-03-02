import { ReactNode, useEffect, useState } from "react"
import { getUser } from "../../utils/auth"
import Navbar from "./navbar"
import Sidebar from "./sidebar"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Props = {
    children?: ReactNode
}

type UserData = {
    id?: string,
    email?: string,
    name?: string,
    role?: string
}

function Layout({ children }: Props) {

    const [user, setUser] = useState<UserData>({})
    const [isLoading, setisLoading] = useState<boolean>(true)

    useEffect(() => {
        async function fetchData() {
            let result = await getUser()
            setUser(result)
            setisLoading(false)
        }
        fetchData()
    }, [])

    return (
        <div className='h-[100vh]'>
            <ToastContainer enableMultiContainer position="top-center" />
            <div className="fixed top-0 left-0 bg-white z-[100]">
                <Sidebar user={user} />
            </div>
            <div className="flex flex-col h-full ml-[100px] overflow-y-auto scrollbar">
                <Navbar user={user} isLoading={isLoading} />
                <div className='flex-1 bg-brandprimary rounded-tl-[40px]'>{children}</div>
            </div>
        </div>
    )
}

export default Layout