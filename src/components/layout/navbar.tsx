import Image from "next/legacy/image"
import Link from "next/link"
import { useState } from "react"
import Cart from "../cart/cart"
import WebIcon from "../webIcon"
import Menu from "./menu"

type Props = {
    user?: UserData,
    isLoading?: boolean
}

type UserData = {
    id?: string,
    email?: string,
    name?: string,
    role?: string
}

function Navbar({ user, isLoading }: Props) {

    const [showMenu, setShowMenu] = useState<boolean>(false)

    return (
        <>
            {user ?
                <div className='text-base text-primary py-2 px-6 flex justify-between tablet:justify-end items-center w-full h-[60px] relative'>
                    <button className='tablet:hidden w-10 h-10' onClick={() => setShowMenu(!showMenu)}>
                        <Image src={'/images/hamburger-icon.svg'} alt='hamburger' width={40} height={40} />
                    </button>
                    <div className='flex gap-2 justify-end items-center min-w-[200px] text-base font-semibold'>
                        {user.role === 'customer' &&
                            <div>
                                <Cart />
                            </div>
                        }
                        {user.role === 'customer' ?
                            <Image src={'/images/user-icon.svg'} alt='user' width={40} height={40} />
                            :
                            <Image src={'/images/store-icon.svg'} alt='store' width={36} height={36} />
                        }
                        <div>{user.name}</div>
                    </div>
                    {showMenu &&
                        <div className='tablet:hidden absolute top-[60px] left-0 z-[999] w-full'>
                            <Menu user={user} />
                        </div>
                    }
                </div>
            : !isLoading &&
                <div className='text-base text-primary px-8 h-[90px] flex justify-between items-center w-full fixed top-0 left-0 bg-white/75 z-[999]'>
                    <WebIcon width={56} height={56} />
                    <div className='flex gap-8'>
                        <Link href={`/login`} passHref className='bg-primary text-white font-semibold w-[100px] h-[30px] rounded-[20px] flex justify-center items-center'>Login</Link>
                        <Link href={`/register`} passHref className='bg-primary text-white font-semibold w-[100px] h-[30px] rounded-[20px] flex justify-center items-center'>Register</Link>
                    </div>
                </div>
            }
        </>
    )
}

export default Navbar