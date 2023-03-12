import { ReactNode, useEffect, useState } from "react"
import { getUser } from "../../utils/auth"
import Navbar from "./navbar"
import Sidebar from "./sidebar"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Props = {
    children?: ReactNode,
    onScroll?: any,
}

type UserData = {
    id?: string,
    email?: string,
    name?: string,
    role?: string
}

function Layout({ children, onScroll }: Props) {

    const [user, setUser] = useState<UserData>()
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
        <div
            className={`${user?'tablet:ml-[120px]':'mt-[90px]'} h-[100vh] overflow-auto overflow-x-scroll scrollbar`}
            onScroll={(e) => onScroll? onScroll(e):null}
        >
            <ToastContainer enableMultiContainer position="top-center" />
            {user && <div className="fixed top-0 left-0 bg-white z-[100] hidden tablet:block">
                <Sidebar user={user} />
            </div>}
            <div className={`flex flex-col h-full`}>
                <Navbar user={user} isLoading={isLoading} />
                <div className={`flex-1 bg-brandprimary ${user&&'tablet:rounded-tl-[40px]'}`}>{children}</div>
            </div>
        </div>
    )
}

export default Layout