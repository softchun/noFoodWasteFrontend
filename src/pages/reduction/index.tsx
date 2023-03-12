import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Layout from '../../components/layout/layout'
import Loading from '../../components/loading'
import Modal from '../../components/modal'
import NoItem from '../../components/noItem'
import ReductionModal from '../../components/reduction/modal'
import ReductionItem from '../../components/reduction/reductionItem'
import SearchBar from '../../components/ui/searchBar'
import { getTokenFromLocalStorage, handleAuthSSR } from '../../utils/auth'

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

function Reduction() {

    useEffect(() => {
        async function checkLogin() {
            await handleAuthSSR('customer')
        }
        checkLogin()
    })

    const [list, setList] = useState<ItemData[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [keyword, setKeyword] = useState<string>('')

    const [isLoadMore, setIsLoadMore] = useState<boolean>(false)
    const [newBatch, setNewBatch] = useState<ItemData[]>([])

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
        const query = '?limit=12' + `${keyword?'&keyword='+keyword:''}` + `${skip?'&skip='+skip:''}`
        const url = `${process.env.NEXT_PUBLIC_API_URL}/reduction/all${query}`
        const response = await axios.get(url, {
            headers: { authorization: token },
        })
        if (!response.status) {
            setList([])
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
            <div className='text-[42px] font-bold text-primary mx-8 mt-8 flex justify-between'>
                Reductions
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
            (list && list?.length > 0) ?
                <div className='flex flex-wrap gap-6 m-8'>
                    {list && list.map((item, index) => 
                        <Modal Component={ReductionModal} Button={ReductionItem} title={item.name} key={index} data={item} />
                    )}
                </div>
            :
                <NoItem text={keyword? 'No Search Result':'No Reduction'} style='mt-[30vh]' />
            }
        </Layout>
    )
}

export default Reduction