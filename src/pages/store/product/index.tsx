import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AddProduct from '../../../components/product/addProduct'
import Layout from '../../../components/layout/layout'
import Modal from '../../../components/modal/modal'
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

    const [list, setList] = useState<ItemData[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [keyword, setKeyword] = useState<string>('')
    
    const [isLoadMore, setIsLoadMore] = useState<boolean>(false)
    const [newBatch, setNewBatch] = useState<ItemData[]>([])

    useEffect(() => {
        async function checkLogin() {
            await handleAuthSSR()
        }
        checkLogin()
    }, [])

    useEffect(() => {
        fetchData(0)
    }, [keyword])

    async function fetchData(skip?: number) {
        if (skip && skip > 0) {
            setIsLoadMore(true)
        } else {
            setIsLoading(true)
        }

        try{
            const token = getTokenFromLocalStorage()
            if (!token) {
                return
            }
            const query = '?limit=12' + `${keyword?'&keyword='+keyword:''}` + `${skip?'&skip='+skip:''}`
            const url = `${process.env.NEXT_PUBLIC_API_URL}/product/all${query}`
            const response = await axios.get(url, {
                headers: { authorization: token },
            })
            if (!response.status || !response.data.productList) {
                return
            }
            setNewBatch(response.data.productList)
            if (skip === 0 || !skip) {
                setList(response.data.productList)
            } else if ((response.data.productList).length > 0) {
                setList([
                    ...list,
                    ...(response.data.productList),
                ])
            }
            setIsLoadMore(false)
            setIsLoading(false)
        } catch (error) {
            console.error(error)
        }
    }

    const handleScroll = async(e: any) => {

        const { offsetHeight, scrollTop, scrollHeight} = e.target
        const threshold = 200
    
        if (offsetHeight + scrollTop >= scrollHeight - threshold && !isLoading && !isLoadMore && newBatch.length > 0) {
            await fetchData(list.length)
        }
    }

    return (
        <Layout onScroll={(!isLoading && !isLoadMore && newBatch?.length > 0) ? handleScroll : null}>
            <div className='text-[42px] font-bold text-primary mx-8 mt-8 flex justify-between items-center'>
                Products
                <Modal Component={AddProduct} Button={AddModalButton} title='Add Product' updateData={async() => await fetchData(0)} />
            </div>
            <div className='mx-8 mt-2'>
                <SearchBar
                    keyword={keyword}
                    onSearch={(text: string) => {setKeyword(text);}}
                    onCancelSearch={() => {setKeyword('');}}
                />
            </div>
            {(isLoading && !isLoadMore)?
                <Loading style='mt-[20vh]' />
            :
            list && list?.length > 0 ?
                <div className='flex flex-wrap gap-6 m-8'>
                    {list && list.map((item, index) => 
                        <Modal Component={ProductModal} Button={ProductItem} title={item.name} key={index} data={item} updateData={async() => await fetchData(0)} />
                    )}
                </div>
            :
                <NoItem text={keyword? 'No Search Result':'No Product'} style='mt-[30vh]' />
            }
        </Layout>
    )
}

export default Product