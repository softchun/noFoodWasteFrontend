import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AddProduct from './addProduct'
import Modal from '../modal/modal'
import ProductItem from './productItem'
import { getTokenFromLocalStorage, handleAuthSSR } from '../../utils/auth'
import ModalButton from '../modal/modalButton'
import Loading from '../loading'
import NoItem from '../noItem'
import { ToastContainer } from 'react-toastify'

type ItemData = {
    id: string,
    price: number,
    name: string,
    detail: string,
    storeId: string,
    image: any
}
type Props = {
    onClose?: any,
    onClickItem?: any,
}

function ProductList({ onClose, onClickItem }: Props) {

    useEffect(() => {
        async function checkLogin() {
            await handleAuthSSR()
        }
        checkLogin()
    })

    const [list, setList] = useState<ItemData[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try{
            setIsLoading(true)
            const token = getTokenFromLocalStorage()
            if (!token) {
                return
            }
            const url = `${process.env.NEXT_PUBLIC_API_URL}/product/all`
            const response = await axios.get(url, {
                headers: { authorization: token },
            })
            if (!response.status || !response.data.productList) {
                setIsLoading(false)
                return
            }
            setList(response.data.productList)
            setIsLoading(false)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <ToastContainer enableMultiContainer position="top-center" containerId='product-list' />
            {isLoading?
                <Loading style='min-h-[40vh]' width={84} height={84} />
            :
            list && list?.length > 0 ?
                <>
                    <div className='flex flex-col flex-wrap gap-6 m-8 min-h-[40vh]'>
                        {list && list.map((item, index) => 
                            <button key={index} onClick={() => { onClickItem(item); onClose(); }} className='w-full'>
                                <ProductItem data={item} style='bg-gray-7 w-full min-w-full max-w-full' />
                            </button>
                        )}
                    </div>
                    <div className='text-[42px] font-bold text-primary m-8 flex justify-between  max-w-lg w-full'>
                        <Modal Component={AddProduct} Button={ModalButton} title='Add Product' toastId='product-list' updateData={async() => await fetchData()} />
                    </div>
                </>
            :
                <>
                    <NoItem text='No Product' style='min-h-[40vh]' />
                    <div className='text-[42px] font-bold text-primary m-8 flex justify-between  max-w-lg w-full'>
                        <Modal Component={AddProduct} Button={ModalButton} title='Add Product' toastId='product-list' updateData={async() => await fetchData()} />
                    </div>
                </>
            }
        </>
    )
}

export default ProductList