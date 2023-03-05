import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AddProduct from './addProduct'
import Modal from '../modal'
import ProductItem from './productItem'
import { getTokenFromLocalStorage, handleAuthSSR } from '../../utils/auth'
import ModalButton from '../modalButton'
import Loading from '../loading'
import NoItem from '../noItem'

type ItemData = {
    id: string,
    price: number,
    name: string,
    detail: string,
    storeId: string,
    image: any
}

function ProductList({ onClose, onClickItem }) {

    useEffect(() => {
        async function checkLogin() {
            await handleAuthSSR()
        }
        checkLogin()
    })

    const [list, setList] = useState<ItemData[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        async function fetchData() {
            try{
                const token = getTokenFromLocalStorage()
                if (!token) {
                    return
                }
                const url = `${process.env.NEXT_PUBLIC_API_URL}/product/all`
                const response = await axios.get(url, {
                    headers: { authorization: token },
                })
                if (!response.status) {
                    setList([])
                }
                console.log(response.data)
                setList(response.data.productList)
                setIsLoading(false)
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    }, [isLoading])

    return (
        <>
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
                        <Modal Component={AddProduct} Button={ModalButton} title='Add Product' updateData={() => setIsLoading(true)} />
                    </div>
                </>
            :
                <>
                    <NoItem text='No Product' style='min-h-[40vh]' />
                    <div className='text-[42px] font-bold text-primary m-8 flex justify-between  max-w-lg w-full'>
                        <Modal Component={AddProduct} Button={ModalButton} title='Add Product' updateData={() => setIsLoading(true)} />
                    </div>
                </>
            }
        </>
    )
}

export default ProductList