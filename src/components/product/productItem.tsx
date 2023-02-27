import Image from 'next/image'

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
    return ((current - 100) / previous) * 100
}

type ItemData = {
    id: string,
    price: number,
    name: string,
    detail: string,
    storeId: string,
    image: any
}
type Props = {
    data?: ItemData,
    style?: string
}

function ProductItem({data, style}: Props) {
    // console.log(data)

    return (
        <div className={`flex gap-4 w-[440px] rounded-3xl p-4 relative bg-white ${style}`}>
            <div className='bg-gray-4 rounded-3xl min-w-[110px] max-w-[110px] h-[110px] overflow-hidden relative'>
                {data.image  &&
                    <Image src={data.image} alt='image' fill />
                }
            </div>
            <div className='flex flex-col gap-2 text-left'>
                <div className='text-xl font-bold'>{data.name}</div>
                {data.detail && <div className='text-base font-normal'>{data.detail}</div>}
                {/* <div className='text-base font-medium text-error'>{data.stock} Left</div> */}
                <div className='flex items-center gap-4 font-semibold'>
                    {/* <div className='text-lg line-through'>฿{data.productPrice}</div> */}
                    <div className='text-xl'>฿{data.price}</div>
                </div>
            </div>
            {/* <div className='bg-warning w-[70px] h-[30px] absolute top-2 right-0 flex justify-center items-center'>{discount(data.productPrice, data.price)}%</div> */}
        </div>
    )
}

export default ProductItem