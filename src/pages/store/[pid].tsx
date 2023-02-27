import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import AddReduction from '../../components/reduction/addReduction'
import Layout from '../../components/layout/layout'
import Modal from '../../components/modal'
import ModalButton from '../../components/modalButton'
import ReductionItem from '../../components/reduction/reductionItem'
import { getTokenFromLocalStorage, handleAuthSSR } from '../../utils/auth'
import dynamic from "next/dynamic"
import ReductionModal from '../../components/reduction/modal'

const MyMap = dynamic(() => import("../../components/map/map"), { ssr:false })

type OpenData = {
    open: string,
    close: string,
    isClosed: boolean
}
type StoreData = {
    id: string,
    email: string,
    name: string,
    isClosed: boolean;
    detail?: string,
    profileImage?: any,
    coverImage?: any,
    address: string;
    location?: {
        lat: number;
        lng: number;
    };
    openTime: {
        sun: OpenData;
        mon: OpenData;
        tue: OpenData;
        wed: OpenData;
        thu: OpenData;
        fri: OpenData;
        sat: OpenData;
    };
}
type ReductionData = {
    id: string,
    stock: number,
    price: number,
    productId: string,
    name: string,
    productPrice: number,
    detail: string,
    storeId: string,
    storeName: string,
    image: any
}

function Store() {
    const router = useRouter()
    const { pid } = router.query

    const [store, setStore] = useState<StoreData>()
    const [reductionList, setReductionList] = useState<ReductionData[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        async function fetchData() {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/store/detail`
            const response = await axios.post(url, {
                id: pid
            })
            if (!response.status) {
                return
            }
            setStore(response.data.store)

            const url2 = `${process.env.NEXT_PUBLIC_API_URL}/reduction/all`
            const response2 = await axios.post(url2, {
                storeId: pid
            })
            if (!response2.status) {
                setReductionList([])
            } else {
                setReductionList(response2.data.reductionList)
            }
            
            setIsLoading(false)
        }
        fetchData()
    }, [isLoading])


    return (
        <Layout>
            {isLoading?
                <div className='flex justify-center items-center w-full h-full text-2xl font-bold'>Loading...</div>
            :
                <div className='flex flex-col gap-6 w-full m-8'>
                    <div className='text-4xl font-bold text-primary flex justify-between'>
                        {store?.name}
                    </div>
                    <div className='text-lg font-normal text-primary flex justify-between'>
                        Open: 07:30am - 10.45pm
                    </div>
                    <div className='text-xl font-medium text-primary flex justify-between'>
                        Address: 5830 Integer St, Colorado, Australia
                    </div>
                    <div className='w-[60vw] h-[450px] relative'>
                        <MyMap />
                    </div>
                    <div className='text-[24px] font-bold text-primary flex justify-between'>
                        Reduction List
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        {reductionList && reductionList.map((item, index) => 
                            <Modal Component={ReductionModal} Button={ReductionItem} title={item.name} key={index} data={item} />
                        )}
                    </div>
                </div>
            }
        </Layout>
    )
}

export default Store