import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import AddProduct from '../../../components/product/addProduct'
import Layout from '../../../components/layout/layout'
import Modal from '../../../components/modal'
import ModalButton from '../../../components/modalButton'
import ProductItem from '../../../components/product/productItem'
import { getTokenFromLocalStorage, handleAuthSSR } from '../../../utils/auth'
import ProductModal from '../../../components/product/modal'

type ItemData = {
    id: string,
    price: number,
    name: string,
    detail: string,
    storeId: string,
    image: any
}

function Product({ props }) {

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
                setList(response.data.productList)
                setIsLoading(false)
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    }, [isLoading])

    return (
        <Layout>
            {isLoading?
                <div className='flex justify-center items-center w-full h-full text-2xl font-bold'>Loading...</div>
            :
                <>
                <div className='text-[42px] font-bold text-primary m-8 flex justify-between'>
                    Products
                    <Modal Component={AddProduct} Button={ModalButton} title='Add Product' updateData={() => setIsLoading(true)} />
                    {/* <Link href={'/product/add'} className='bg-primary text-sm text-white font-semibold w-[120px] h-[40px] rounded-[20px] flex justify-center items-center'>Add Product</Link> */}
                </div>
                <div className='flex flex-wrap gap-6 m-8'>
                    {list && list.map((item, index) => 
                        <Modal Component={ProductModal} Button={ProductItem} title={item.name} key={index} data={item} updateData={() => setIsLoading(true)} />
                    )}
                </div>
                </>
            }
        </Layout>
    )
}

export default Product