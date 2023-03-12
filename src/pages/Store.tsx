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
    const [keyword, setKeyword] = useState<string>('')
    
    const [isLoadMore, setIsLoadMore] = useState<boolean>(false)
    const [newBatch, setNewBatch] = useState<StoreData[]>([])

    useEffect(() => {
        fetchData(0)
    }, [keyword])

    async function fetchData(skip?: number) {
        if (skip && skip > 0) {
            setIsLoadMore(true)
        } else {
            setIsLoading(true)
        }

        const token = getTokenFromLocalStorage()
        const query = '?limit=6' + `${keyword?'&keyword='+keyword:''}` + `${skip?'&skip='+skip:''}`
        const url = `${process.env.NEXT_PUBLIC_API_URL}/store/all${query}`
        const response = await axios.get(url, {
            headers: { authorization: token },
        })
        if (!response.status) {
            setList([])
            return
        }
        setNewBatch(response.data.storeList)
        if (skip === 0 || !skip) {
            setList(response.data.storeList)
        } else if ((response.data.storeList).length > 0) {
            setList([
                ...list,
                ...(response.data.storeList),
            ])
        }
        setIsLoadMore(false)
        setIsLoading(false)
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
            <div className='text-[42px] font-bold text-primary mx-8 mt-8'>
                Store
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