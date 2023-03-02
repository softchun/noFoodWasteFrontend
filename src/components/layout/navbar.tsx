import Link from "next/link"
import { useEffect, useState } from "react"
import { getUser } from "../../utils/auth"
import Cart from "../cart/cart"

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
        <div className='text-base text-primary p-2 flex justify-end items-center w-full h-[60px]'>
            {/* <div className='bg-primary text-white w-[320px] h-[30px] rounded-[20px] px-6 py-1'>Search...</div> */}
            {user ? 
                <div className='flex gap-2 justify-end items-center min-w-[200px] mr-6'>
                    {user.role === 'customer' &&
                        <div>
                            <Cart />
                        </div>
                    }
                    <div className='bg-primary rounded-full w-10 h-10'></div>
                    <div>{user.name}</div>
                </div>
                : !isLoading &&
                <div className='flex gap-8'>
                    <Link href={`/login`} passHref className='bg-primary text-white font-semibold w-[100px] h-[30px] rounded-[20px] flex justify-center items-center'>Login</Link>
                    <Link href={`/register`} passHref className='bg-primary text-white font-semibold w-[100px] h-[30px] rounded-[20px] flex justify-center items-center'>Register</Link>
                </div>
            }
        </div>
    )
}

export default Navbar