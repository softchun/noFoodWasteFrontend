import Image from 'next/legacy/image'

const mockData = {
    id: "63a9b5a05ca397833e37c650",
    stock: 5,
    price: 50,
    productId: "63a86e5e2ed1a827ef3fb500",
    name: "Butter Cheese Bread",
    productPrice: 100,
    detail: "10 slides of bread",
    storeId: "63a425f43bb2ba6fd48640a8",
    storeName: "Bread Store, Sweets and Snacks"
}

function discount(previous, current) {
    return parseFloat((((current - previous) / previous) * 100).toFixed(2))
}

type ItemData = {
    id: string,
    stock: number,
    price: number,
    productId: string,
    name: string,
    productPrice: number,
    detail: string,
    storeId: string,
    storeName: string,
    image: any
}
type Props = {
    data?: ItemData,
    onClickButton?: any
}

function ReductionItem({data, onClickButton}: Props) {

    return (
        <button className='flex gap-4 w-[500px] bg-white rounded-3xl rounded-tr-none p-4 relative' onClick={() => onClickButton()}>
            <div className='bg-gray-4 rounded-3xl min-w-[110px] max-w-[110px] h-[110px] overflow-hidden relative'>
                {data.image  &&
                    <Image src={data.image} alt='image' layout="fill" objectFit="cover" />
                }
            </div>
            <div className='mr-[80px] flex flex-col gap-2 text-left'>
                <div className='text-base font-normal'>{data.storeName}</div>
                <div className='text-xl font-bold'>{data.name}</div>
                <div className='text-base font-medium text-error'>{data.stock} Left</div>
                <div className='flex items-center gap-4 font-semibold'>
                    <div className='text-lg line-through'>฿{data.productPrice}</div>
                    <div className='text-2xl'>฿{data.price}</div>
                </div>
            </div>
            <div className='bg-warning font-semibold w-[70px] h-[30px] absolute top-2 right-0 flex justify-center items-center'>{discount(data.productPrice, data.price)}%</div>
        </button>
    )
}

export default ReductionItem