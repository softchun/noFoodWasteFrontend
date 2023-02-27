import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AddProduct from '../product/addProduct'
import Modal from '../modal'
import ProductItem from '../product/productItem'
import { getTokenFromLocalStorage, handleAuthSSR } from '../../utils/auth'
import ModalButton from '../modalButton'
import CartItem from './cartItem'
import ConfirmOrder from './confirmOrder'

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

function CartList({ onClose, onClickItem }) {

    useEffect(() => {
        async function checkLogin() {
            await handleAuthSSR('customer')
        }
        checkLogin()
    })

    const [list, setList] = useState<ItemData[]>([])
    const [total, setTotal] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(true)

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
                // console.log(response.data)
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

    function updateAmount(id: string, amount: number) {
        if (amount === 0) {
            setIsLoading(true)
            return
        }
        setList(list.map((item => item.id !== id ? item : {
            ...item,
            amount: amount
        })))
    }

    return (
        <>
            {isLoading?
                <div className='flex justify-center items-center min-h-[40vh] w-full h-full text-2xl font-bold'>Loading...</div>
            :
                <div className='m-8 min-h-[40vh] flex flex-col justify-between'>
                    <div className='flex flex-wrap gap-4'>

                        {list && list.length > 0 ? 
                        <>
                            <div className='bg-gray-7 w-full text-md font-normal rounded-3xl p-4'>{list[0].storeName}</div>
                            {list.map((item, index) => 
                                <div key={index} className='w-full'>
                                    <CartItem data={item} style='bg-gray-7 w-full min-w-full max-w-full' updateData={(id: string, amount: number) => updateAmount(id, amount)} />
                                </div>
                            )}
                            <div className='bg-gray-7 w-full text-md font-normal rounded-3xl p-4'>Total: ฿{total}</div>
                        </>
                        :
                            <div>No Order</div>
                        }
                    </div>
                    {/* <button
                        className='w-full h-10 mt-4 bg-primary disabled:bg-disabledgray text-white rounded-lg'
                    >
                        Order now
                    </button> */}
                    <ConfirmOrder onConfirm={() => onClose()} />
                    {/* <div className='text-[42px] font-bold text-primary m-8 flex justify-between  max-w-lg w-full'>
                        <Modal Component={AddProduct} Button={ModalButton} title='Add Product' updateData={() => setIsLoading(true)} />
                    </div> */}
                </div>
            }
        </>
    )
}

export default CartList