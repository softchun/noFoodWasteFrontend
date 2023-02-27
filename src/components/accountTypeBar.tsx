import Link from 'next/link';

type Props = {
    type?: string,
    page?: string,
}
function AccountTypeBar({ type, page }: Props) {
    return (
        <div className='text-base text-primary flex justify-between items-center gap-2 w-full h-[60px]'>
            <Link href={`/${page}`} passHref className={`${type==='customer'?'bg-white text-primary':'bg-gray-5 text-gray-3'} rounded-t-lg p-2 w-1/2 h-full flex justify-center items-center`}>
                <div>Customer</div>
            </Link>
            <Link href={`/store/${page}`} passHref className={`${type!=='customer'?'bg-white text-primary':'bg-gray-5 text-gray-3'} rounded-t-lg p-2 w-1/2 h-full flex justify-center items-center`}>
                <div>Business</div>
            </Link>
        </div>
    )
}

export default AccountTypeBar