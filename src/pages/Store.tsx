import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Layout from '../components/layout/layout'
import ReductionItem from '../components/reduction/reductionItem'
import StoreItem from '../components/storeItem'
import SearchBar from '../components/ui/searchBar'
import { getTokenFromLocalStorage, handleAuthSSR } from '../utils/auth'

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
function Store() {

    const [list, setList] = useState<ItemData[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false)
    const [keyword, setKeyword] = useState<string>('')

    useEffect(() => {
        async function fetchData() {
            const token = getTokenFromLocalStorage()
            const url = `${process.env.NEXT_PUBLIC_API_URL}/store/all`
            const response = await axios.get(url, {
                headers: { authorization: token },
            })
            if (!response.status) {
                setList([])
            }
            setList(response.data.storeList)
            setIsLoading(false)
        }
        fetchData()
    }, [isLoading])

    async function searhData(keyword: string) {
        const token = getTokenFromLocalStorage()
        const url = `${process.env.NEXT_PUBLIC_API_URL}/store/all`
        const response = await axios.post(url, {
            keyword: keyword,
        }, {
            headers: { authorization: token },
        })
        if (!response.status) {
            setList([])
        }
        setList(response.data.storeList)
        setIsLoadingSearch(false)
    }

    return (
        <Layout>
            <div className='text-[42px] font-bold text-primary mx-8 mt-8'>
                Store
            </div>
            <div className='mx-8 mt-2'>
                <SearchBar
                    keyword={keyword}
                    onSearch={(text: string) => {setKeyword(text); searhData(text); setIsLoadingSearch(true);}}
                    onCancelSearch={() => {setKeyword(''); setIsLoading(true);}}
                />
            </div>
            {isLoading || isLoadingSearch?
                <div className='flex justify-center items-center w-full h-full text-2xl font-bold'>Loading...</div>
            :
                <div className='flex flex-wrap gap-6 m-8'>
                    {list && list.map((item, index) => 
                        <Link href={`/store/${item.id}`} key={index} passHref>
                            <StoreItem data={item} />
                        </Link>
                    )}
                </div>
            }
        </Layout>
    )
}

export default Store