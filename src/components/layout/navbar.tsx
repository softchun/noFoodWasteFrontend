import Image from "next/legacy/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getUser } from "../../utils/auth"
import Cart from "../cart/cart"
import WebIcon from "../webIcon"

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

    return (
        <>
            {user ? 
                <div className='text-base text-primary p-2 flex justify-end items-center w-full h-[60px]'>
                    <div className='flex gap-2 justify-end items-center min-w-[200px] mr-6 text-base font-semibold'>
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
                </div>
            : !isLoading &&
                <div className='text-base text-primary px-8 h-[90px] flex justify-between items-center w-full fixed top-0 left-0 bg-white z-[999]'>
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