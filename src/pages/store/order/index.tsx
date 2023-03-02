import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Layout from '../../../components/layout/layout'
import Modal from '../../../components/modal'
import OrderModal from '../../../components/order/modal'
import OrderItem from '../../../components/order/orderItem'
import { getTokenFromLocalStorage, getUser, handleAuthSSR } from '../../../utils/auth'

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
            // await handleAuthSSR('customer')
        }
        checkLogin()
    })

    const [status, setStatus] = useState<string>('TO_ACCEPT')
    const [list, setList] = useState<OrderData[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        async function fetchData() {
            const token = getTokenFromLocalStorage()
            const url = `${process.env.NEXT_PUBLIC_API_URL}/order/store`
            const response = await axios.post(url, {
                status: status
            }, {
                headers: { authorization: token },
            })
            if (!response.status) {
                setList([])
            }
            setList(response.data.orderList)
            setIsLoading(false)
            console.log(response.data.orderList)
        }
        fetchData()
    }, [isLoading, status])

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
            setIsLoading(true)

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
            
            setStatus('CANCELED')
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
            
            setStatus('CANCELED')
            setIsLoading(true)

        } catch (error) {
            toast("Plese try again later.", { type: 'error' })
            console.error(error)
        }
    }


    return (
        <Layout>
            {isLoading?
                <div className='flex justify-center items-center w-full h-full text-2xl font-bold'>Loading...</div>
            :
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
                </div>
            }
        </Layout>
    )
}

export default Order