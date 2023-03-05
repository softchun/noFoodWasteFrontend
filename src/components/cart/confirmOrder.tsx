import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { getTokenFromLocalStorage, handleAuthSSR } from '../../utils/auth'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import Image from 'next/legacy/image'

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
    storeName: string
}

function ConfirmOrder({ onConfirm }) {
    const router = useRouter()

    useEffect(() => {
        async function checkLogin() {
            await handleAuthSSR('customer')
        }
        checkLogin()
    })

    const [list, setList] = useState<ItemData[]>([])
    const [total, setTotal] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [showModal, setShowModal] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            try{
                const token = getTokenFromLocalStorage()
                if (!token) {
                    return
                }
                const url = `${process.env.NEXT_PUBLIC_API_URL}/cart`
                const response = await axios.get(url, {
                    headers: { authorization: token },
                })
                if (!response.status) {
                    setList([])
                }
                console.log(response.data)
                setList(response.data.cartItemList)
                setIsLoading(false)
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    }, [isLoading])
    
    useEffect(() => {
        setTotal(list.reduce((sum, item) => sum + (item.amount * item.price), 0))
    }, [list])

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            const token = getTokenFromLocalStorage()
            if (!token) {
                return
            }
            const url = `${process.env.NEXT_PUBLIC_API_URL}/order/add`
            const response = await axios.post(url, {
                storeId: list[0].storeId,
                reduction: list.map((item) => ({
                    id: item.reductionId,
                    amount: item.amount
                }))
            }, {
                headers: { authorization: token },
            })
            if (!response.data.status) {
                toast("Plese try again later.", { type: 'error', containerId: 'cart' })
                return;
            }
            toast("Order successfully", { type: 'success' })
            onConfirm()
            router.push('/order')
        } catch (error) {
            console.error(error)

            const errorData = error.response.data
            if (errorData.errorCode === 'NOT_ENOUGH') {
                toast("Item is not enough, plese try again later.", { type: 'error', containerId: 'cart' })
            } else if (errorData.errorCode === 'MAX_LIMIT') {
                toast("You can not order because you have reached the order cancellation limit.", { type: 'error', containerId: 'cart' })
            } else {
                toast("Plese try again later.", { type: 'error', containerId: 'cart' })
            }
        }
    }

    return (
        <>
            <button
                className='w-full h-10 mt-4 bg-primary disabled:bg-disabledgray text-white rounded-lg'
                onClick={() => {setIsLoading(true); setShowModal(true);}}
            >
                Order now
            </button>
            {showModal && !isLoading ? (
                <>
                    <div
                        className="justify-center items-center flex backdrop-blur-sm overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none"
                    >
                        <div className="relative w-full my-6 mx-auto max-w-xl">
                            {/*content*/}
                            <div className="border-0 rounded-3xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-3xl font-semibold">
                                        Confirm this order
                                    </h3>
                                    <button
                                        className="ml-auto opacity-50 hover:opacity-100 w-10 h-10"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <Image src={'/images/close-icon.svg'} alt='close' width={40} height={40} />
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="overflow-auto min-h-[160px] w-full p-4 flex flex-col gap-4 justify-center items-center">
                                    <div className='flex flex-col flex-wrap gap-4 w-full'>
                                        {list && list.length > 0 ?
                                        <>
                                            <div className='bg-gray-7 w-full text-md font-semibold rounded-3xl p-4 flex gap-1 items-center'>
                                                <Image src={'/images/store-icon.svg'} alt='store' width={24} height={24} />
                                                {list[0].storeName}
                                            </div>
                                            <div className='bg-gray-7 w-full text-md font-normal rounded-3xl p-4 flex flex-col gap-1'>
                                                {list.map((item, index) => 
                                                    <div className='w-full flex justify-between' key={index}>
                                                        <div className='flex gap-2'>
                                                            <div className='font-medium'>{item.name}</div>
                                                            <div>x {item.amount}</div>
                                                        </div>
                                                        <div>฿{(item.price * item.amount).toLocaleString()}</div>
                                                    </div>
                                                    // <div key={index} className='w-full'>
                                                    //     <CartItem data={item} style='bg-gray-7 w-full min-w-full max-w-full' updateData={(id: string, amount: number) => {}} />
                                                    // </div>
                                                )}
                                            </div>
                                            <div className='bg-gray-7 w-full text-md font-semibold rounded-3xl p-4'>Total: ฿{total}</div>
                                            <div className='w-full text-sm text-error font-normal'>
                                                Make sure that you can pick up the order within 30 minute, because 30 minute after store accept the order, the store can cancel the order.<br/>
                                                If an order has been canceled multiple times, you will be temporarily unable to place an order.
                                            </div>
                                        </>
                                        :
                                            <div>No Order</div>
                                        }
                                    </div>
                                    {/* <Component onClose={() => setShowModal(false)} {...props} /> */}
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-4 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={(e) => {setShowModal(false); handleSubmit(e);}}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    );
}

export default ConfirmOrder