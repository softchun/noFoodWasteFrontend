import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AddReduction from '../../../components/reduction/addReduction'
import Layout from '../../../components/layout/layout'
import Modal from '../../../components/modal'
import ModalButton from '../../../components/modalButton'
import ReductionModal from '../../../components/reduction/modal'
import ReductionItem from '../../../components/reduction/reductionItem'
import { getTokenFromLocalStorage, getUser, handleAuthSSR } from '../../../utils/auth'
import SearchBar from '../../../components/ui/searchBar'
import Loading from '../../../components/loading'

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

type UserData = {
    id: string,
    email: string,
    name: string,
    role: string,
}

function Reduction() {
    
    useEffect(() => {
        async function checkLogin() {
            await handleAuthSSR()
        }
        checkLogin()
    })
    
    const [user, setUser] = useState<UserData>()

    const [list, setList] = useState<ItemData[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false)
    const [keyword, setKeyword] = useState<string>('')

    useEffect(() => {
        async function fetchData() {
            let result = await getUser()
            setUser(result)

            const token = getTokenFromLocalStorage()
            const url = `${process.env.NEXT_PUBLIC_API_URL}/reduction/all`
            const response = await axios.post(url, {
                storeId: result.id,
            }, {
                headers: { authorization: token },
            })
            if (!response.status) {
                setList([])
            }
            setList(response.data.reductionList)
            setIsLoading(false)
            // console.log(response.data.reductionList)
        }
        fetchData()
    }, [isLoading])

    async function searhData(keyword: string) {
        const token = getTokenFromLocalStorage()
        const url = `${process.env.NEXT_PUBLIC_API_URL}/reduction/filter`
        const response = await axios.post(url, {
            keyword: keyword,
            storeId: user.id,
        }, {
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
                <Modal Component={AddReduction} Button={ModalButton} title='Add Reduction' updateData={() => setIsLoading(true)} />
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
                <div className='flex flex-wrap gap-6 m-8'>
                    {list && list.map((item, index) => 
                        <Modal Component={ReductionModal} Button={ReductionItem} title={item.name} key={index} data={item} editable={true} updateData={() => setIsLoading(true)} />
                    )}
                </div>
            }
        </Layout>
    )
}

export default Reduction