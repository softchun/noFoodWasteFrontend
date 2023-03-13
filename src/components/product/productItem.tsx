import Image from 'next/legacy/image'

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
    style?: string,
    onClickButton?: any,
}

function ProductItem({data, style, onClickButton}: Props) {

    return (
        <div className={`flex gap-4 w-[440px] rounded-3xl p-4 relative bg-white ${style}`} onClick={() => onClickButton? onClickButton():null}>
            <div className='bg-gray-4 rounded-3xl min-w-[110px] max-w-[110px] h-[110px] overflow-hidden relative'>
                {data.image  &&
                    <Image src={data.image} alt='image' layout="fill" objectFit="cover" />
                }
            </div>
            <div className='flex flex-col gap-2 text-left'>
                <div className='text-xl font-bold'>{data.name}</div>
                {data.detail && <div className='text-base font-normal'>{data.detail}</div>}
                <div className='flex items-center gap-4 font-semibold'>
                    <div className='text-xl'>฿{data.price}</div>
                </div>
            </div>
        </div>
    )
}

export default ProductItem