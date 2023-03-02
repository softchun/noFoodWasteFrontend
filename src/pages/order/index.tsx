import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Layout from '../../components/layout/layout'
import Loading from '../../components/loading'
import Modal from '../../components/modal'
import ModalButton from '../../components/modalButton'
import OrderModal from '../../components/order/modal'
import OrderItem from '../../components/order/orderItem'
import { getTokenFromLocalStorage, getUser, handleAuthSSR } from '../../utils/auth'

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
        fetchData()
    }, [status])

    async function fetchData() {
        setIsLoading(true)
        const token = getTokenFromLocalStorage()
        const url = `${process.env.NEXT_PUBLIC_API_URL}/order`
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

    const handleCancelOrder = async (e: any, id: string) => {
        e.preventDefault()
        try {
            const token = getTokenFromLocalStorage()
            if (!token) {
                return
            }
            const url = `${process.env.NEXT_PUBLIC_API_URL}/order/update-status`
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


    return (
        <Layout>
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
                {isLoading?
                    <Loading style='mt-[20vh]' />
                :
                    <div className='flex flex-wrap gap-6 mt-8'>
                        {list && list.map((item, index) => 
                            <Modal
                                Component={OrderModal} Button={OrderItem}
                                title={'Order detail'} key={index} data={item}
                                handleCancelOrder={(e: any, id: string) => handleCancelOrder(e, id)}
                            />
                        )}
                    </div>
                }
            </div>
        </Layout>
    )
}

export default Order