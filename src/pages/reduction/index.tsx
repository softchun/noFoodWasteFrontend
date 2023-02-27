import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Layout from '../../components/layout/layout'
import Modal from '../../components/modal'
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
    image: any
}

function Reduction() {

    const [list, setList] = useState<ItemData[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [keyword, setKeyword] = useState<string>('')

    useEffect(() => {
        async function fetchData() {
            const token = getTokenFromLocalStorage()
            const url = `${process.env.NEXT_PUBLIC_API_URL}/reduction/all`
            const response = await axios.post(url, {
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


    return (
        <Layout>
            {isLoading?
                <div className='flex justify-center items-center w-full h-full text-2xl font-bold'>Loading...</div>
            :
                <>
                <div className='text-[42px] font-bold text-primary m-8 flex justify-between'>
                    Reductions
                    {/* <Modal Component={AddReduction} Button={ModalButton} title='Add Reduction' updateData={() => setIsLoading(true)} /> */}
                </div>
                <SearchBar
                    keyword={keyword}
                    onSearch={(text: string) => {console.log('text', text)}}
                    onCancelSearch={(text: string) => {console.log('text', text)}}
                />
                <div className='flex flex-wrap gap-6 m-8'>
                    {list && list.map((item, index) => 
                        <Modal Component={ReductionModal} Button={ReductionItem} title={item.name} key={index} data={item} />
                        // <ReductionItem key={index} data={item} />
                    )}
                </div>
                </>
            }
        </Layout>
    )
}

export default Reduction