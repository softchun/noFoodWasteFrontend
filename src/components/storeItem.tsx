import Image from "next/legacy/image"


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
    email: string,
    name: string,
    open?: string,
    close?: string,
    detail?: string,
    location?: string,
    profileImage?: any,
    coverImage?: any,
    reductions?: any
}

function StoreItem({data}: {data: ItemData}) {

    return (
        <div className='flex flex-col w-[400px] bg-white rounded-3xl relative overflow-hidden'>
            <div className='bg-gray-4 w-full h-[150px] overflow-hidden relative'>
                {data.coverImage &&
                    <Image src={data.coverImage} alt='image' layout="fill" objectFit="cover" />
                }
            </div>
            <div className='p-4 flex flex-col gap-4'>
                <div className='flex gap-2 items-center'>
                    <div className='bg-gray-4 rounded-3xl w-10 h-10 overflow-hidden relative'>
                        {data.profileImage &&
                            <Image src={data.profileImage} alt='image' layout="fill" objectFit="cover" />
                        }
                    </div>
                    <div className='flex flex-col'>
                        <div className='text-xl font-bold'>{data.name}</div>
                        <div className='text-base font-medium'>07:30am - 10.45pm</div>
                    </div>
                </div>
                <div className='bg-info rounded-3xl w-full h-[30px] flex justify-center items-center text-white'>{(data.reductions)?.length} reductions</div>
            </div>
        </div>
    )
}

export default StoreItem