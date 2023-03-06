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

    const [list, setList] = useState<ItemData[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false)
    const [keyword, setKeyword] = useState<string>('')

    useEffect(() => {
        async function fetchData() {
            const token = getTokenFromLocalStorage()
            const url = `${process.env.NEXT_PUBLIC_API_URL}/reduction/all${keyword&&'?keyword='+keyword}`
            const response = await axios.get(url, {
                headers: { authorization: token },
            })
            if (!response.status) {
                setList([])
            }
            setList(response.data.reductionList)
            setIsLoading(false)
        }
        fetchData()
    }, [isLoading])

    async function searhData(keyword: string) {
        const token = getTokenFromLocalStorage()
        const url = `${process.env.NEXT_PUBLIC_API_URL}/reduction/all${keyword&&'?keyword='+keyword}`
        const response = await axios.get(url, {
            headers: { authorization: token },
        })
        if (!response.status) {
            setList([])
        }
        setList(response.data.reductionList)
        setIsLoadingSearch(false)
    }

    return (
        <Layout>
            <div className='text-[42px] font-bold text-primary mx-8 mt-8 flex justify-between'>
                Reductions
                {/* <Modal Component={AddReduction} Button={ModalButton} title='Add Reduction' updateData={() => setIsLoading(true)} /> */}
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
                        <Modal Component={ReductionModal} Button={ReductionItem} title={item.name} key={index} data={item} />
                        // <ReductionItem key={index} data={item} />
                    )}
                </div>
            :
                <NoItem text={keyword? 'No Search Result':'No Reduction'} style='mt-[30vh]' />
            }
        </Layout>
    )
}

export default Reduction