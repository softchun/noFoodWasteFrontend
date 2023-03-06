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
            const url = `${process.env.NEXT_PUBLIC_API_URL}/reduction/all?storeId=${result.id}${keyword&&'?keyword='+keyword}`
            const response = await axios.get(url, {
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
        const url = `${process.env.NEXT_PUBLIC_API_URL}/reduction/all?storeId=${user.id}${keyword&&'?keyword='+keyword}`
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
            <div className='text-[42px] font-bold text-primary mx-8 mt-8 flex justify-between items-center'>
                Reductions
                <Modal Component={AddReduction} Button={AddModalButton} title='Add Reduction' updateData={() => setIsLoading(true)} />
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
                        <Modal Component={ReductionModal} Button={ReductionItem} title={item.name} key={index} data={item} editable={true} updateData={() => setIsLoading(true)} />
                    )}
                </div>
            :
                <NoItem text={keyword? 'No Search Result':'No Reduction'} style='mt-[30vh]' />
            }
        </Layout>
    )
}

export default Reduction