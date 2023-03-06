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

function Sidebar({ user }: { user?: UserData }) {
    const router = useRouter()

    async function handleSignOut(e: any) {
        e.preventDefault()
        logout()
        router.push('/login')
    }

    return (
        <div className='text-base text-primary font-bold p-2 flex flex-col justify-between gap-8 h-[100vh] w-[120px] overflow-auto no-scrollbar'>
            <div className='flex justify-center'><WebIcon /></div>
            <div className='flex flex-col gap-8 text-sm text-center font-medium'>
                <Link href={`/home`} passHref>
                    <div className={`flex items-center py-1 border-l-4 ${(router.pathname).includes('/home') ? 'border-l-primary font-semibold':'border-l-white'}`}>
                        <Image src={'/images/home-icon.svg'} alt='home' width={28} height={28} />
                        Home
                    </div>
                </Link>
                {/* <Link href={`/product`} passHref>Product</Link> */}
                {user?.role==='customer'&&
                    <>
                    <Link href={`/reduction`} passHref>
                        <div className={`flex items-center py-1 border-l-4 ${(router.pathname).includes('/reduction') ? 'border-l-primary font-semibold':'border-l-white'}`}>
                            <Image src={'/images/reduction-icon.svg'} alt='home' width={28} height={28} />
                            Reduction
                        </div>
                    </Link>
                    <Link href={`/store`} passHref>
                        <div className={`flex items-center py-1 pl-1 gap-1 border-l-4 ${(router.pathname).includes('/store') ? 'border-l-primary font-semibold':'border-l-white'}`}>
                            <Image src={'/images/store-icon.svg'} alt='home' width={24} height={24} />
                            Store
                        </div>
                    </Link>
                    <Link href={`/order`} passHref>
                        <div className={`flex items-center py-1 border-l-4 ${(router.pathname).includes('/order') ? 'border-l-primary font-semibold':'border-l-white'}`}>
                            <Image src={'/images/order-icon.svg'} alt='home' width={28} height={28} />
                            Order
                        </div>
                    </Link>
                    </>
                }
                {user?.role==='store'&&
                    <>
                    {/* <div className='text-md font-bold text-left mt-10'>For Store Management</div> */}
                    {/* <Link href={`/store`} passHref>Store</Link> */}
                    <Link href={`/store/my-store`} passHref>
                        <div className={`flex items-center py-1 pl-1 gap-1 border-l-4 ${(router.pathname).includes('/store/my-store') ? 'border-l-primary font-semibold':'border-l-white'}`}>
                            <Image src={'/images/store-icon.svg'} alt='store' width={24} height={24} />
                            My Store
                        </div>
                    </Link>
                    <Link href={`/store/product`} passHref>
                        <div className={`flex items-center py-1 pl-1 gap-1 border-l-4 ${(router.pathname).includes('/store/product') ? 'border-l-primary font-semibold':'border-l-white'}`}>
                            <Image src={'/images/product-icon.svg'} alt='home' width={24} height={24} />
                            Product
                        </div>
                    </Link>
                    <Link href={`/store/reduction`} passHref>
                        <div className={`flex items-center py-1 border-l-4 ${(router.pathname).includes('/store/reduction') ? 'border-l-primary font-semibold':'border-l-white'}`}>
                            <Image src={'/images/reduction-icon.svg'} alt='home' width={28} height={28} />
                            Reduction
                        </div>
                    </Link>
                    <Link href={`/store/order`} passHref>
                        <div className={`flex items-center py-1 border-l-4 ${(router.pathname).includes('/store/order') ? 'border-l-primary font-semibold':'border-l-white'}`}>
                            <Image src={'/images/order-icon.svg'} alt='home' width={28} height={28} />
                            Order
                        </div>
                    </Link>
                    </>
                }
            </div>
            {user &&
                <div className='flex flex-col items-center gap-8 mb-8 text-sm text-center font-semibold'>
                    <button onClick={(e) => handleSignOut(e)} className='flex items-center gap-1'>
                        <Image src={'/images/logout-icon.svg'} alt='logout' width={24} height={24} />
                        Logout
                    </button>
                </div>
            }
        </div>
    )
}

export default Sidebar