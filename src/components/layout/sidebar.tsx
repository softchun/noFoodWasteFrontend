import { logout } from '../../utils/auth'
import { useRouter } from 'next/router'
import Link from 'next/link'

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
        router.push('/')
    }

    return (
        <div className='text-base text-primary font-bold p-2 flex flex-col h-[100vh] w-[100px]'>
            <div>
                <div className='w-12 h-12 bg-primary rounded-full mx-auto'></div>
                FoodWaste
            </div>
            <div className='flex flex-col flex-1 gap-8 mt-[16vh] text-sm text-center font-semibold'>
                <Link href={`/home`} passHref>Home</Link>
                <Link href={`/reduction`} passHref>Reduction</Link>
                <Link href={`/store`} passHref>Store</Link>
                {/* <Link href={`/product`} passHref>Product</Link> */}
                {user?.role==='customer'&&
                    <>
                    {/* <div>Favorite</div> */}
                    <Link href={`/order`} passHref>Order</Link>
                    </>
                }
                {user?.role==='store'&&
                    <>
                    <div className='text-md font-bold text-left mt-10'>For Store Management</div>
                    {/* <Link href={`/store`} passHref>Store</Link> */}
                    <Link href={`/store/product`} passHref>Product Management</Link>
                    <Link href={`/store/reduction`} passHref>Reduction Management</Link>
                    <Link href={`/store/order`} passHref>Order Management</Link>
                    <Link href={`/store/my-store`} passHref>My Store</Link>
                    </>
                }
            </div>
            {user &&
                <div className='flex flex-col gap-8 my-8 text-sm text-center font-semibold'>
                    <button onClick={(e) => handleSignOut(e)}>Logout</button>
                </div>
            }
        </div>
    )
}

export default Sidebar