import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Layout from '../components/layout/layout'
import ReductionItem from '../components/reduction/reductionItem'
import StoreItem from '../components/storeItem'
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
        }
        fetchData()
    }, [])


    return (
        <Layout>
            <div className='text-[42px] font-bold text-primary m-8'>
                Store
            </div>
            <div className='flex flex-wrap gap-6 m-8'>
                {list && list.map((item, index) => 
                    <Link href={`/store/${item.id}`} key={index} passHref>
                        <StoreItem data={item} />
                    </Link>
                )}
            </div>
        </Layout>
    )
}

export default Store