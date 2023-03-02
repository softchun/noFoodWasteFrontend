import axios from 'axios'
import Router, { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Layout from '../../components/layout/layout'
import { getTokenFromLocalStorage, handleAuthSSR } from '../../utils/auth'
import dynamic from "next/dynamic"
import Image from 'next/legacy/image'
import Link from 'next/link'
import Loading from '../../components/loading'

const MyMap = dynamic(() => import("../../components/map/map"), { ssr:false })
const MyMapSetting = dynamic(() => import("../../components/mapSetting"), { ssr:false })

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

function StoreSetting() {
    const router = useRouter()
    const { pid } = router.query

    const [store, setStore] = useState<StoreData>()
    const [day, setDay] = useState<number>(0)
    // const [reductionList, setReductionList] = useState([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    
    useEffect(() => {
        async function checkLogin() {
            await handleAuthSSR()
        }
        checkLogin()

        const d = new Date();
        setDay(d.getDay())
    })

    useEffect(() => {
        async function fetchData() {
            const token = getTokenFromLocalStorage()
            const url = `${process.env.NEXT_PUBLIC_API_URL}/store/detail`
            const response = await axios.get(url, {
                headers: { authorization: token }
            })
            if (!response.status) {
                Router.push('/store/login')
            }
            setStore(response.data.store)

            // const url2 = `${process.env.NEXT_PUBLIC_API_URL}/reduction/all`
            // const response2 = await axios.post(url2, {
            //     storeId: pid
            // })
            // if (!response2.status) {
            //     setList([])
            // }
            // setReductionList(response2.data.reductionList)

            setIsLoading(false)
        }
        fetchData()
    }, [isLoading])


    return (
        <Layout>
            {isLoading?
                <Loading style='mt-[32vh]' />
            :
                <div className='flex flex-col gap-6 w-full p-8 text-primary'>
                    
                    {store.isClosed &&
                        <div className='w-full flex justify-center items-center bg-gray-8 text-gray-3 p-3 rounded-lg text-lg'>Close Temperary</div>
                    }
                    {store.coverImage &&
                        <div className='w-full h-[20vw] bg-gray-4 rounded-lg relative overflow-hidden'>
                            <Image src={store.coverImage} alt='cover-image' layout="fill" objectFit="cover" />
                        </div>
                    }
                    <div className='flex gap-4'>
                        <div className='max-w-[10vw] min-w-[10vw] max-h-[10vw] min-h-[10vw] bg-gray-4 rounded-lg relative overflow-hidden'>
                            {store.profileImage && 
                                <Image src={store.profileImage} alt='profile-image' layout="fill" objectFit="cover" />
                            }
                        </div>
                        <div className='flex flex-col gap-2'>
                            <div className='flex items-center gap-4'>
                                <div className='text-4xl font-bold'>{store?.name}</div>
                                <Link href={`/store/my-store/edit`} passHref>
                                    <button className='flex justify-center items-center bg-primary text-white px-4 py-2 rounded-2xl text-base'>Edit Store</button>
                                </Link>
                                
                            </div>
                            {store.detail &&
                                <div>
                                    {store.detail}
                                </div>
                            }
                        </div>
                    </div>
                    <div className='text-base font-normal text-primary flex flex-col gap-2 max-w-[400px]'>
                        <div className='font-bold text-lg'>Open Time:</div>
                        <div className={`flex justify-between w-full ${day===0 && 'font-medium'}`}>
                            <div>{weekday[0]}</div>
                            <div className='w-[160px]'>
                                { (store.openTime.sun.isClosed || !store.openTime.sun.open || !store.openTime.sun.close) ?
                                    'Closed' : store.openTime.sun.open + '-' + store.openTime.sun.close }
                            </div>
                        </div>
                        <div className={`flex justify-between w-full ${day===1 && 'font-medium'}`}>
                            <div className=''>Monday</div>
                            <div className='w-[160px]'>07:30 - 10:45</div>
                        </div>
                    </div>
                    {!store.address &&
                        <div className='flex gap-2 items-center'>
                            <div className='text-lg font-bold'>Address:</div>
                            <div className='text-lg'>5830 Integer St, Colorado, Australia</div>
                        </div>
                    }
                    <div className='w-[60vw] h-[450px] relative'>
                        {/* <MyMapSetting /> */}
                        <MyMap />
                    </div>
                    {/* <div className='text-[24px] font-bold text-primary flex justify-between'>
                        Reduction List
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        {reductionList && reductionList.map((item, index) => 
                            <Modal Component={ReductionModal} Button={ReductionItem} title={item.name} key={index} data={item} />
                        )}
                    </div> */}
                </div>
            }
        </Layout>
    )
}

export default StoreSetting