import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Layout from '../../../components/layout/layout'
import Loading from '../../../components/loading'
import Modal from '../../../components/modal'
import NoItem from '../../../components/noItem'
import OrderModal from '../../../components/order/modal'
import OrderItem from '../../../components/order/orderItem'
import { getTokenFromLocalStorage, handleAuthSSR } from '../../../utils/auth'

type ReductionItemData = {
    id: string,
    productId: string,
    storeId: string,
    name: string,
    price: number,
    productPrice: number,
    amount: number,
    image: string,
    detail: string,
    expirationDate: Date,
}
type OrderData = {
    id: string,
    userId: string,
    userName: string,
    storeId: string,
    storeName: string,
    status: string,
    reduction: ReductionItemData[],
    lastUpdate: Date,
    minutesDifference: number,
}

function Order() {
    
    useEffect(() => {
        async function checkLogin() {
            await handleAuthSSR()
        }
        checkLogin()
    })

    const [status, setStatus] = useState<string>('TO_ACCEPT')   // TO_ACCEPT, TO_PICKUP, COMPLETE, CANCELED
    const [list, setList] = useState<OrderData[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [isLoadMore, setIsLoadMore] = useState<boolean>(false)
    const [newBatch, setNewBatch] = useState<OrderData[]>([])

    useEffect(() => {
        fetchData(0)
    }, [status])

    async function fetchData(skip?: number) {
        if (skip && skip > 0) {
            setIsLoadMore(true)
        } else {
            setIsLoading(true)
        }
        
        const token = getTokenFromLocalStorage()
        const query = '?limit=12' + `${status?'&status='+status:''}` + `${skip?'&skip='+skip:''}`
        const url = `${process.env.NEXT_PUBLIC_API_URL}/order/store/all${query}`
        const response = await axios.get(url, {
            headers: { authorization: token },
        })
        if (!response.status) {
            setList([])
            return
        }
        setNewBatch(response.data.orderList)
        if (skip === 0 || !skip) {
            setList(response.data.orderList)
        } else if ((response.data.orderList).length > 0) {
            setList([
                ...list,
                ...(response.data.orderList),
            ])
        }
        setIsLoadMore(false)
        setIsLoading(false)
    }

    const handleCancelOrder = async (e: any, id: string) => {
        e.preventDefault()
        e.stopPropagation()
        try {
            const token = getTokenFromLocalStorage()
            if (!token) {
                return
            }
            const url = `${process.env.NEXT_PUBLIC_API_URL}/order/store/update-status`
            const response = await axios.post(url, {
                id: id,
                newStatus: 'CANCELED'
            }, {
                headers: { authorization: token },
            })
            console.log(response)
            if (!response.data.status) {
                toast("Plese try again later.", { type: 'error' })
                return;
            }
            toast("Cancel order successfully", { type: 'success' })
            
            setStatus('CANCELED')

        } catch (error) {
            toast("Plese try again later.", { type: 'error' })
            console.error(error)
        }
    }
    const handleAcceptOrder = async (e: any, id: string) => {
        e.preventDefault()
        e.stopPropagation()
        try {
            const token = getTokenFromLocalStorage()
            if (!token) {
                return
            }
            const url = `${process.env.NEXT_PUBLIC_API_URL}/order/store/update-status`
            const response = await axios.post(url, {
                id: id,
                newStatus: 'TO_PICKUP'
            }, {
                headers: { authorization: token },
            })
            console.log(response)
            if (!response.data.status) {
                toast("Plese try again later.", { type: 'error' })
                return;
            }
            toast("Accept order successfully", { type: 'success' })
            
            setStatus('TO_PICKUP')
            setIsLoading(true)

        } catch (error) {
            toast("Plese try again later.", { type: 'error' })
            console.error(error)
        }
    }
    const handleCompleteOrder = async (e: any, id: string) => {
        e.preventDefault()
        e.stopPropagation()
        try {
            const token = getTokenFromLocalStorage()
            if (!token) {
                return
            }
            const url = `${process.env.NEXT_PUBLIC_API_URL}/order/store/update-status`
            const response = await axios.post(url, {
                id: id,
                newStatus: 'COMPLETE'
            }, {
                headers: { authorization: token },
            })
            console.log(response)
            if (!response.data.status) {
                toast("Plese try again later.", { type: 'error' })
                return;
            }
            toast("Complete order successfully", { type: 'success' })
            
            setStatus('COMPLETE')
            setIsLoading(true)

        } catch (error) {
            toast("Plese try again later.", { type: 'error' })
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
            <div className='flex flex-col m-8'>
                <div className='text-4xl font-bold text-primary flex justify-between'>
                    Order
                </div>
                <div className='flex gap-8 mt-6 text-lg font-semibold text-primary'>
                    <button
                        onClick={() => setStatus('TO_ACCEPT')}
                        className={`p-2 ${status==='TO_ACCEPT'&&'border-b-2 border-b-primary'}`}
                    >
                        To Accept
                    </button>
                    <button
                        onClick={() => setStatus('TO_PICKUP')}
                        className={`p-2 ${status==='TO_PICKUP'&&'border-b-2 border-b-primary'}`}
                    >
                        To Pickup
                    </button>
                    <button
                        onClick={() => setStatus('COMPLETE')}
                        className={`p-2 ${status==='COMPLETE'&&'border-b-2 border-b-primary'}`}
                    >
                        Complete
                    </button>
                    <button
                        onClick={() => setStatus('CANCELED')}
                        className={`p-2 ${status==='CANCELED'&&'border-b-2 border-b-primary'}`}
                    >
                        Canceled
                    </button>
                </div>
                {(isLoading && !isLoadMore)?
                    <Loading style='mt-[20vh]' />
                :
                list && list?.length > 0 ?
                    <div className='flex flex-wrap gap-6 mt-8'>
                        {list && list.map((item, index) => 
                            <Modal
                                Component={OrderModal} Button={OrderItem}
                                title={'Order detail'} key={index} data={item} isStore={true}
                                handleCancelOrder={(e: any, id: string) => handleCancelOrder(e, id)}
                                handleAcceptOrder={(e: any, id: string) => handleAcceptOrder(e, id)}
                                handleCompleteOrder={(e: any, id: string) => handleCompleteOrder(e, id)}
                            />
                        )}
                    </div>
                :
                <NoItem text='No Order' style='mt-[30vh]' />
                }
            </div>
        </Layout>
    )
}

export default Order