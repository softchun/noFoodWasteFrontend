import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AddProduct from '../product/addProduct'
import Modal from '../modal'
import ProductItem from '../product/productItem'
import { getTokenFromLocalStorage, handleAuthSSR } from '../../utils/auth'
import ModalButton from '../modalButton'
import CartItem from './cartItem'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

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
            toast("Order successfully", { type: 'success' })
            onConfirm()
            router.push('/order')
        } catch (error) {
            toast("Plese try again later.", { type: 'error' })
            console.error(error)
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
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-3xl font-semibold">
                                        Confirm this order
                                    </h3>
                                    <button
                                        className="p-1 ml-auto bg-transparent border-0 text-black-1 opacity-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        onClick={() => setShowModal(false)}
                                    >
                                        x
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="overflow-auto min-h-[160px] w-full p-4 flex flex-col gap-4 justify-center items-center">
                                    <div className='flex flex-col flex-wrap gap-4 w-full'>
                                        {list && list.length > 0 ?
                                        <>
                                            <div className='bg-gray-7 w-full text-md font-normal rounded-3xl p-4'>{list[0].storeName}</div>
                                            <div className='bg-gray-7 w-full text-md font-normal rounded-3xl p-4'>
                                                {list.map((item, index) => 
                                                    <div className='w-full flex justify-between' key={index}>
                                                        <div className='flex gap-2'>
                                                            <div>{item.name}</div>
                                                            <div>x {item.amount}</div>
                                                        </div>
                                                        <div>฿{(item.price * item.amount).toLocaleString()}</div>
                                                    </div>
                                                    // <div key={index} className='w-full'>
                                                    //     <CartItem data={item} style='bg-gray-7 w-full min-w-full max-w-full' updateData={(id: string, amount: number) => {}} />
                                                    // </div>
                                                )}
                                            </div>
                                            <div className='bg-gray-7 w-full text-md font-normal rounded-3xl p-4'>Total: ฿{total}</div>
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