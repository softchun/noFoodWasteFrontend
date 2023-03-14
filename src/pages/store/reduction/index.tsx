import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import AddReduction from '../../../components/reduction/addReduction'
import Layout from '../../../components/layout/layout'
import Modal from '../../../components/modal/modal'
import ReductionModal from '../../../components/reduction/modal'
import ReductionItem from '../../../components/reduction/reductionItem'
import { getTokenFromLocalStorage, getUser, handleAuthSSR } from '../../../utils/auth'
import SearchBar from '../../../components/ui/searchBar'
import Loading from '../../../components/loading'
import Image from 'next/legacy/image'
import NoItem from '../../../components/noItem'

type ItemData = {
    id: string,
    stock: number,
    price: number,
    productId: string,
    name: string,
    productPrice: number,
    detail: string,
    storeId: string,
    storeName: string,
    storeImage: string,
    image: any,
    expirationDate: string,
    bestBeforeDate: string,
}

type UserData = {
    id: string,
    email: string,
    name: string,
    role: string,
}

function AddModalButton({ onClickButton }: any) {
    return (
        <button
            className="bg-primary text-sm text-white font-semibold p-4  rounded-2xl h-fit flex gap-2 justify-center items-center"
            onClick={() => onClickButton()}
        >
            <Image src={'/images/add-white-icon.svg'} alt='add' width={24} height={24} />
            Add Reduction
        </button>
    )
}

function Reduction() {
    
    const [user, setUser] = useState<UserData>()

    const [list, setList] = useState<ItemData[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [keyword, setKeyword] = useState<string>('')
    
    const [isLoadMore, setIsLoadMore] = useState<boolean>(false)
    const [newBatch, setNewBatch] = useState<ItemData[]>([])

    useEffect(() => {
        async function checkLogin() {
            await handleAuthSSR()
            
            let result = await getUser()
            setUser(result)
        }
        checkLogin()
    }, [])

    const fetchNewData = useCallback(async()=> {
        await fetchData(0)
    }, [])

    useEffect(() => {
        fetchNewData()
    }, [keyword, user, fetchNewData])

    async function fetchData(skip?: number) {
        if (!user || !user?.id) return

        if (skip && skip > 0) {
            setIsLoadMore(true)
        } else {
            setIsLoading(true)
        }

        try{
            const token = getTokenFromLocalStorage()
            const query = `?storeId=${user.id}` + '&limit=12' + `${keyword?'&keyword='+keyword:''}` + `${skip?'&skip='+skip:''}`
            const url = `${process.env.NEXT_PUBLIC_API_URL}/reduction/all${query}`
            const response = await axios.get(url, {
                headers: { authorization: token },
            })
            if (!response.status || !response.data.reductionList) {
                return
            }
            setNewBatch(response.data.reductionList)
            if (skip === 0 || !skip) {
                setList(response.data.reductionList)
            } else if ((response.data.reductionList).length > 0) {
                setList([
                    ...list,
                    ...(response.data.reductionList),
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
                Reductions
                <Modal Component={AddReduction} Button={AddModalButton} title='Add Reduction' updateData={async() => await fetchData(0)} />
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
                        <Modal Component={ReductionModal} Button={ReductionItem} title={item.name} key={index} data={item} editable={true} updateData={async() => await fetchData(0)} />
                    )}
                </div>
            :
                <NoItem text={keyword? 'No Search Result':'No Reduction'} style='mt-[30vh]' />
            }
        </Layout>
    )
}

export default Reduction