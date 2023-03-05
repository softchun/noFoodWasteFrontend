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
import SearchBar from '../../../components/ui/searchBar'
import Loading from '../../../components/loading'
import Image from 'next/legacy/image'
import NoItem from '../../../components/noItem'

type ItemData = {
    id: string,
    price: number,
    name: string,
    detail: string,
    storeId: string,
    image: any
}

function AddModalButton({ onClickButton }: any) {
    return (
        <button
            className="bg-primary text-sm text-white font-semibold p-4  rounded-2xl h-fit flex gap-2 justify-center items-center"
            onClick={() => onClickButton()}
        >
            <Image src={'/images/add-white-icon.svg'} alt='add' width={24} height={24} />
            Add Product
        </button>
    )
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
    const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false)
    const [keyword, setKeyword] = useState<string>('')

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

    async function searhData(keyword: string) {
        const token = getTokenFromLocalStorage()
        const url = `${process.env.NEXT_PUBLIC_API_URL}/product/all`
        const response = await axios.post(url, {
            keyword: keyword,
        }, {
            headers: { authorization: token },
        })
        if (!response.status) {
            setList([])
        }
        setList(response.data.productList)
        setIsLoadingSearch(false)
    }

    return (
        <Layout>
            <div className='text-[42px] font-bold text-primary mx-8 mt-8 flex justify-between items-center'>
                Products
                <Modal Component={AddProduct} Button={AddModalButton} title='Add Product' updateData={() => setIsLoading(true)} />
            </div>
            <div className='mx-8 mt-2'>
                <SearchBar
                    keyword={keyword}
                    onSearch={(text: string) => {setKeyword(text); searhData(text); setIsLoadingSearch(true);}}
                    onCancelSearch={() => {setKeyword(''); setIsLoading(true);}}
                />
            </div>
            {isLoading || isLoadingSearch?
                <Loading style='mt-[20vh]' />
            :
            list && list?.length > 0 ?
                <div className='flex flex-wrap gap-6 m-8'>
                    {list && list.map((item, index) => 
                        <Modal Component={ProductModal} Button={ProductItem} title={item.name} key={index} data={item} updateData={() => setIsLoading(true)} />
                    )}
                </div>
            :
                <NoItem text={keyword? 'No Search Result':'No Product'} style='mt-[30vh]' />
            }
        </Layout>
    )
}

export default Product