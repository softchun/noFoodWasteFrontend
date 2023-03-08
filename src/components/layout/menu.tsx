import { logout } from '../../utils/auth'
import { useRouter } from 'next/router'
import Link from 'next/link'
import WebIcon from '../webIcon'
import Image from 'next/legacy/image'

type UserData = {
    id?: string,
    email?: string,
    name?: string,
    role?: string
}

function Menu({ user }: { user?: UserData }) {
    const router = useRouter()

    async function handleSignOut(e: any) {
        e.preventDefault()
        logout()
        router.push('/login')
    }

    return (
        <div className=' bg-gray-6/95 text-base text-center font-medium text-primary flex flex-col items-center justify-between gap-1 w-full'>
                {user?.role==='customer'&&
                    <>
                    <Link href={`/home`} passHref>
                        <div className={`flex items-center py-4 border-b border-b-primary w-full justify-center ${(router.pathname).includes('/home') ? 'font-semibold':''}`}>
                            <Image src={'/images/home-icon.svg'} alt='home' width={28} height={28} />
                            Home
                        </div>
                    </Link>
                    <Link href={`/reduction`} passHref>
                        <div className={`flex items-center py-4 border-b border-b-primary w-full justify-center ${(router.pathname).includes('/reduction') ? 'font-semibold':''}`}>
                            <Image src={'/images/reduction-icon.svg'} alt='home' width={28} height={28} />
                            Reduction
                        </div>
                    </Link>
                    <Link href={`/store`} passHref>
                        <div className={`flex items-center py-4 pl-1 gap-1 border-b border-b-primary w-full justify-center ${(router.pathname).includes('/store') ? 'font-semibold':''}`}>
                            <Image src={'/images/store-icon.svg'} alt='home' width={24} height={24} />
                            Store
                        </div>
                    </Link>
                    <Link href={`/order`} passHref>
                        <div className={`flex items-center py-4 border-b border-b-primary w-full justify-center ${(router.pathname).includes('/order') ? 'font-semibold':''}`}>
                            <Image src={'/images/order-icon.svg'} alt='home' width={28} height={28} />
                            Order
                        </div>
                    </Link>
                    </>
                }
                {user?.role==='store'&&
                    <>
                    {/* <div className='text-md font-bold text-left mt-10'>For Store Management</div> */}
                    <Link href={`/home`} passHref>
                        <div className={`flex items-center py-4 border-b border-b-primary w-full justify-center ${(router.pathname).includes('/home') ? 'font-semibold':''}`}>
                            <Image src={'/images/home-icon.svg'} alt='home' width={28} height={28} />
                            Home
                        </div>
                    </Link>
                    <Link href={`/store/my-store`} passHref>
                        <div className={`flex items-center py-4 pl-1 gap-1 border-b border-b-primary w-full justify-center ${(router.pathname).includes('/store/my-store') ? 'font-semibold':''}`}>
                            <Image src={'/images/store-icon.svg'} alt='store' width={24} height={24} />
                            My Store
                        </div>
                    </Link>
                    <Link href={`/store/product`} passHref>
                        <div className={`flex items-center py-4 pl-1 gap-1 border-b border-b-primary w-full justify-center ${(router.pathname).includes('/store/product') ? 'font-semibold':''}`}>
                            <Image src={'/images/product-icon.svg'} alt='home' width={24} height={24} />
                            Product
                        </div>
                    </Link>
                    <Link href={`/store/reduction`} passHref>
                        <div className={`flex items-center py-4 border-b border-b-primary w-full justify-center ${(router.pathname).includes('/store/reduction') ? 'font-semibold':''}`}>
                            <Image src={'/images/reduction-icon.svg'} alt='home' width={28} height={28} />
                            Reduction
                        </div>
                    </Link>
                    <Link href={`/store/order`} passHref>
                        <div className={`flex items-center py-4 border-b border-b-primary w-full justify-center ${(router.pathname).includes('/store/order') ? 'font-semibold':''}`}>
                            <Image src={'/images/order-icon.svg'} alt='home' width={28} height={28} />
                            Order
                        </div>
                    </Link>
                    </>
                }
            {user &&
                <div className='flex flex-col px-4 gap-8 py-4 text-sm font-semibold'>
                    <button onClick={(e) => handleSignOut(e)} className='flex items-center gap-1'>
                        <Image src={'/images/logout-icon.svg'} alt='logout' width={24} height={24} />
                        Logout
                    </button>
                </div>
            }
        </div>
    )
}

export default Menu