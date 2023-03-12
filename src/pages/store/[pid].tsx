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
import Loading from '../../components/loading'
import Image from 'next/legacy/image'

const MyMap = dynamic(() => import("../../components/map/map"), { ssr:false })

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

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
    address?: string;
    location?: {
        lat: number;
        lng: number;
    };
    openTime: {
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
    
    const [isLoadMore, setIsLoadMore] = useState<boolean>(false)
    const [newBatch, setNewBatch] = useState<ReductionData[]>([])

    useEffect(() => {
        fetchData(0)
    }, [pid])

    async function fetchData(skip?: number) {
        if (!pid) return;

        if (skip && skip > 0) {
            setIsLoadMore(true)
        } else {
            setIsLoading(true)

            const url = `${process.env.NEXT_PUBLIC_API_URL}/store/detail/${pid}`
            const response = await axios.get(url)
            if (!response.status) {
                return
            }
            setStore(response.data.store)

        }

        const query = `?storeId=${pid}` + '&limit=6' + `${skip?'&skip='+skip:''}`
        const url2 = `${process.env.NEXT_PUBLIC_API_URL}/reduction/all${query}`
        const response2 = await axios.get(url2)
        if (!response2.status) {
            setReductionList([])
            return
        }
        
        setNewBatch(response2.data.reductionList)
        if (skip === 0 || !skip) {
            setReductionList(response2.data.reductionList)
        } else if ((response2.data.reductionList).length > 0) {
            setReductionList([
                ...reductionList,
                ...(response2.data.reductionList),
            ])
        }
        setIsLoadMore(false)
        setIsLoading(false)
    }

    const handleScroll = async(e: any) => {

        const { offsetHeight, scrollTop, scrollHeight} = e.target
        const threshold = 200
    
        if (offsetHeight + scrollTop >= scrollHeight - threshold && !isLoading && !isLoadMore && newBatch.length > 0) {
            await fetchData(reductionList.length)
        }
    }

    return (
        <Layout onScroll={(!isLoading && !isLoadMore && newBatch?.length > 0) ? handleScroll : null}>
            {(isLoading && !isLoadMore)?
                <Loading style='mt-[32vh]' />
            :
                <div className='flex flex-col gap-6 w-full p-8 text-primary'>
                    {(store?.isClosed) &&
                        <div className='w-full flex justify-center items-center bg-gray-8 text-gray-3 p-3 rounded-lg text-lg'>Close Temperary</div>
                    }
                    {(store?.coverImage) &&
                        <div className='w-full h-[20vw] bg-gray-4 rounded-lg relative overflow-hidden'>
                            <Image src={store?.coverImage} alt='cover-image' layout="fill" objectFit="cover" />
                        </div>
                    }
                    <div className='flex gap-4'>
                        <div className='max-w-[10vw] min-w-[10vw] max-h-[10vw] min-h-[10vw] bg-gray-4 rounded-lg relative overflow-hidden'>
                            {(store?.profileImage) && 
                                <Image src={store?.profileImage} alt='profile-image' layout="fill" objectFit="cover" />
                            }
                        </div>
                        <div className='flex flex-col gap-2'>
                            <div className='flex items-center gap-4'>
                                <div className='text-4xl font-bold'>{store?.name}</div>
                            </div>
                            {(store?.detail) &&
                                <div>
                                    {store.detail}
                                </div>
                            }
                        </div>
                    </div>
                    <div className='text-base font-normal text-primary flex flex-col gap-2 max-w-[400px]'>
                        <div className='font-bold text-lg'>Open Time:</div>
                        {(store?.openTime) && ( store?.openTime.all.isAll ? weekday.map((item, index) =>
                            <div key={index} className={`flex justify-between w-full ${index===(new Date()).getDay() && 'font-semibold'}`}>
                                <div>{item}</div>
                                <div className='w-[160px]'>
                                    { store.openTime.all.isClosed ? 'Closed' : (!store.openTime.all.open || !store.openTime.all.close) ?
                                        'Open' : store.openTime.all.open + '-' + store.openTime.all.close }
                                </div>
                            </div>)
                        :
                            <>
                            <div className={`flex justify-between w-full ${(new Date()).getDay()===0 && 'font-semibold'}`}>
                                <div>{weekday[0]}</div>
                                <div className='w-[160px]'>
                                    { store.openTime.sun.isClosed ? 'Closed' : (!store.openTime.sun.open || !store.openTime.sun.close) ?
                                        'Open' : store.openTime.sun.open + '-' + store.openTime.sun.close }
                                </div>
                            </div>
                            <div className={`flex justify-between w-full ${(new Date()).getDay()===1 && 'font-semibold'}`}>
                                <div>{weekday[1]}</div>
                                <div className='w-[160px]'>
                                    { store.openTime.mon.isClosed ? 'Closed' : (!store.openTime.mon.open || !store.openTime.mon.close) ?
                                        'Open' : store.openTime.mon.open + '-' + store.openTime.mon.close }
                                </div>
                            </div>
                            <div className={`flex justify-between w-full ${(new Date()).getDay()===2 && 'font-semibold'}`}>
                                <div>{weekday[2]}</div>
                                <div className='w-[160px]'>
                                    { store.openTime.tue.isClosed ? 'Closed' : (!store.openTime.tue.open || !store.openTime.tue.close) ?
                                        'Open' : store.openTime.tue.open + '-' + store.openTime.tue.close }
                                </div>
                            </div>
                            <div className={`flex justify-between w-full ${(new Date()).getDay()===3 && 'font-semibold'}`}>
                                <div>{weekday[3]}</div>
                                <div className='w-[160px]'>
                                    { store.openTime.wed.isClosed ? 'Closed' : (!store.openTime.wed.open || !store.openTime.wed.close) ?
                                        'Open' : store.openTime.wed.open + '-' + store.openTime.wed.close }
                                </div>
                            </div>
                            <div className={`flex justify-between w-full ${(new Date()).getDay()===4 && 'font-semibold'}`}>
                                <div>{weekday[4]}</div>
                                <div className='w-[160px]'>
                                    { store.openTime.thu.isClosed ? 'Closed' : (!store.openTime.thu.open || !store.openTime.thu.close) ?
                                        'Open' : store.openTime.thu.open + '-' + store.openTime.thu.close }
                                </div>
                            </div>
                            <div className={`flex justify-between w-full ${(new Date()).getDay()===5 && 'font-semibold'}`}>
                                <div>{weekday[5]}</div>
                                <div className='w-[160px]'>
                                    { store.openTime.fri.isClosed ? 'Closed' : (!store.openTime.fri.open || !store.openTime.fri.close) ?
                                        'Open' : store.openTime.fri.open + '-' + store.openTime.fri.close }
                                </div>
                            </div>
                            <div className={`flex justify-between w-full ${(new Date()).getDay()===6 && 'font-semibold'}`}>
                                <div>{weekday[6]}</div>
                                <div className='w-[160px]'>
                                    { store.openTime.sat.isClosed ? 'Closed' : (!store.openTime.sat.open || !store.openTime.sat.close) ?
                                        'Open' : store.openTime.sat.open + '-' + store.openTime.sat.close }
                                </div>
                            </div>
                            </>)
                        }
                    </div>
                    {(store?.address) &&
                        <div className='flex gap-2 items-center'>
                            <div className='text-lg font-bold'>Address:</div>
                            <div className='text-lg'>{store.address}</div>
                        </div>
                    }
                    {store?.location && store?.location?.lat && store?.location?.lng &&
                        <div className='flex flex-col gap-2'>
                            <div className='text-lg font-bold'>Map Location:</div>
                            <div className='w-[60vw] h-[450px] relative'>
                                <MyMap data={store.location} storeName={store.name} />
                            </div>
                        </div>
                    }
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