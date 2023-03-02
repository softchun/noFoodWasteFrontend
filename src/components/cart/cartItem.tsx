import axios from "axios"
import Image from "next/legacy/image"
import { useState } from "react"
import { toast } from "react-toastify"
import { getTokenFromLocalStorage } from "../../utils/auth"

const mockData = {
    id: "63a9b5a05ca397833e37c650",
    amount: 2,
    stock: 5,
    price: 50,
    productId: "63a86e5e2ed1a827ef3fb500",
    name: "Butter Cheese Bread",
    productPrice: 100,
    detail: "10 slides of bread",
    storeId: "63a425f43bb2ba6fd48640a8",
    storeName: "Bread Store, Sweets and Snacks"
}

// function discount(previous, current) {
//     return parseFloat((((current - previous) / previous) * 100).toFixed(2))
// }

type ItemData = {
    id: string,
    amount: number,
    reductionId: string,
    stock: number,
    price: number,
    productId: string,
    name: string,
    productPrice: number,
    detail: string,
    storeId: string,
    storeName: string,
    image: string,
}

type Props = {
    data?: ItemData,
    style?: string,
    updateData?: any
}

function CartItem({data, style, updateData}: Props) {

    const [amount, setAmount] = useState<number>(data?.amount || 1)

    const handleSubmit = async (e: any, newAmount: number) => {
        e.preventDefault()
        try {
            const token = getTokenFromLocalStorage()
            if (!token) {
                return
            }
            const url = `${process.env.NEXT_PUBLIC_API_URL}/cart/update`
            const response = await axios.post(url, {
                cartItemId: data.id,
                amount: newAmount
            }, {
                headers: { authorization: token },
            })
            console.log(response)
            if (!response.data.status) {
                toast("Plese try again later.", { type: 'error' })
                return;
            }
            if (!response.data.status) {
                if (response.data.errorCode === 'NOT_ENOUGH') {
                    toast("Can not add this reduction more.", { type: 'error' })
                } else {
                    toast("Plese try again later.", { type: 'error' })
                }
                return;
            }
            // toast("Edit data successfully", { type: 'success' })
            setAmount(newAmount)
            updateData(data.id, newAmount)
        } catch (error) {
            toast("Plese try again later.", { type: 'error' })
            console.error(error)
        }
    }

    return (
        <div className={`flex gap-4 w-[500px] bg-white rounded-3xl p-4 relative ${style}`}>
            <div className='bg-gray-4 rounded-2xl min-w-[80px] max-w-[80px] h-[80px] overflow-hidden relative'>
                {data.image  &&
                    <Image src={data.image} alt='image' layout="fill" objectFit="cover" />
                }
            </div>
            <div className='flex flex-col gap-1'>
                {/* <div className='text-sm font-normal'>{data.storeName}</div> */}
                <div className='text-base font-bold'>{data.name}</div>
                {/* <div className='text-base font-medium text-error'>{data.stock} Left</div> */}
                <div className='flex items-center gap-4 font-semibold'>
                    <div className='text-md line-through'>฿{data.productPrice}</div>
                    <div className='text-lg'>฿{data.price}</div>
                </div>
                <div className='flex items-center gap-4 text-base font-semibold mt-1'>
                    <button disabled={amount<=1} className='w-6 h-6 rounded-full border border-primary' onClick={(e) => handleSubmit(e, amount-1)}>-</button>
                    <div className=''>{amount}</div>
                    <button disabled={amount>=data.stock} className='w-6 h-6 rounded-full border border-primary' onClick={(e) => handleSubmit(e, amount+1)}>+</button>
                    <button className='w-6 h-6 rounded-full border border-primary' onClick={(e) => handleSubmit(e, 0)}>Delete</button>
                </div>
            </div>
            {/* <div className='bg-warning font-semibold w-[70px] h-[30px] absolute top-2 right-0 flex justify-center items-center'>{discount(data.productPrice, data.price)}%</div> */}
        </div>
    )
}

export default CartItem