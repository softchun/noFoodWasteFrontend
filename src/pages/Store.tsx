import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Layout from '../components/layout/layout'
import Loading from '../components/loading'
import NoItem from '../components/noItem'
import StoreItem from '../components/storeItem'
import SearchBar from '../components/ui/searchBar'
import { getTokenFromLocalStorage } from '../utils/auth'

type OpenData = {
    open: string,
    close: string,
    isClosed: boolean
}
type OpenTimeData = {
    all: {
        open: string;
        close: string;
        isClosed: boolean;
        isAll: boolean;
    };
    sun: OpenData;
    mon: OpenData;
    tue: OpenData;
    wed: OpenData;
    thu: OpenData;
    fri: OpenData;
    sat: OpenData;
}
type StoreData = {
    id: string,
    email: string,
    name: string,
    isClosed: boolean;
    detail?: string,
    profileImage?: any,
    coverImage?: any,
    address?: string;
    location?: {
        lat: number;
        lng: number;
    };
    openTime: OpenTimeData;
}
function Store() {

    const [list, setList] = useState<StoreData[]>([])
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
        const url = `${process.env.NEXT_PUBLIC_API_URL}/store/all${keyword&&'?keyword='+keyword}`
        const response = await axios.get(url, {
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
                <Loading style='mt-[20vh]' />
            :
            list && list?.length > 0 ?
                <div className='flex flex-wrap gap-6 m-8'>
                    {list && list.map((item, index) => 
                        <Link href={`/store/${item.id}`} key={index} passHref>
                            <StoreItem data={item} />
                        </Link>
                    )}
                </div>
            :
                <NoItem text={keyword? 'No Search Result':'No Store'} style='mt-[30vh]' />
            }
        </Layout>
    )
}

export default Store