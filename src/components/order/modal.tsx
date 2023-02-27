import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { getTokenFromLocalStorage } from '../../utils/auth'
import { toast, ToastContainer } from 'react-toastify';
import Modal from '../modal';
import ConfirmModal from '../confirmModal';
import ChangeStore from '../modal/changeStore';

function discount(previous, current) {
    return parseFloat((((current - previous) / previous) * 100).toFixed(2))
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const statusNames = {'TO_ACCEPT': 'To Accept', 'TO_PICKUP': 'To Pickup', 'COMPLETE': 'Complete', 'CANCELED': 'Canceled'}

function formatDate(date) {
    let dateTime = new Date(date)
    let d = dateTime.getDate()
    let m = dateTime.getMonth()
    let y = dateTime.getFullYear()
    return d + ' ' + monthNames[m] + ' ' + y
}

function CancelButton({ onClickButton }) {
    return (
        <button
            className='w-full h-10 border-2 border-error text-error text-base font-medium rounded-lg'
            onClick={() => onClickButton()}
        >
            Cancel Order
        </button>
    )
}
function AcceptButton({ onClickButton }) {
    return (
        <button
            className='w-full h-10 border-2 border-primary text-primary text-base font-medium rounded-lg'
            onClick={() => onClickButton()}
        >
            Accept Order
        </button>
    )
}
function CompleteButton({ onClickButton }) {
    return (
        <button
            className='w-full h-10 border-2 border-primary text-primary text-base font-medium rounded-lg'
            onClick={() => onClickButton()}
        >
            Complete Order
        </button>
    )
}

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
    image: any,
    expirationDate: string
}
type Props = {
    data?: OrderData,
    isStore?: boolean,
    onClose?: any,
    onClickItem?: any,
    updateData?: any,
    handleAcceptOrder?: any,
    handleCancelOrder?: any,
    handleCompleteOrder?: any,
}

function OrderModal({ data, isStore=false, onClose, onClickItem, updateData, handleAcceptOrder, handleCancelOrder, handleCompleteOrder}: Props) {

    return (
        <div>
            <ToastContainer enableMultiContainer position="top-center" containerId='order' />
            <div className='m-8 min-h-[30vh] flex flex-col gap-4 justify-between relative'>
                <div className='bg-gray-7 w-full text-md font-normal rounded-3xl p-4'>{data.storeName}</div>
                {(data.reduction) && (data.reduction).length > 0 && (data.reduction).map((item, index) =>
                    <div className='flex gap-4 relative w-full bg-gray-7 rounded-3xl p-4' key={index}>
                        <div className='bg-gray-4 rounded-2xl min-w-[70px] max-w-[70px] h-[70px] overflow-hidden relative'>
                            {(data.reduction)[0].image  &&
                                <Image src={(data.reduction)[0].image} alt='image' fill />
                            }
                        </div>
                        <div className='flex flex-col gap-2 w-full'>
                            <div className='text-lg font-semibold'>{item.name}</div>
                            {/* <div className='text-base font-medium text-error'>{data.stock} Left</div> */}
                            <div className='flex justify-between w-full'>
                                <div className='flex items-center gap-4 font-medium'>
                                    <div className='text-md line-through'>฿{item.productPrice}</div>
                                    <div className='text-xl'>฿{item.price}</div>
                                </div>
                                <div className='text-md font-medium'>Amount: {item.amount}</div>
                            </div>
                        </div>
                        {/* <div className='bg-warning font-semibold w-[70px] h-[30px] absolute top-2 right-0 flex justify-center items-center'>{discount(data.productPrice, data.price)}%</div> */}
                    </div>
                )}
                <div className='flex justify-between items-center gap-4'>
                    <div className='flex flex-col gap-2'>
                        <div className='text-lg font-bold flex gap-2'>
                            Total: ฿{(data.reduction).reduce((sum, item) => sum + (item.amount * item.price), 0)}
                            <div className='text-base font-medium text-gray-2'>({(data.reduction).reduce((sum, item) => sum + item.amount, 0)} {(data.reduction).reduce((sum, item) => sum + item.amount, 0)>1?'pieces':'piece'})</div>
                        </div>
                        <div className='text-xs text-gray-2 '>Last update: Thu Jan 05 2023 14:53:01</div>
                    </div>
                    <div className='bg-primary text-sm text-white font-semibold px-3 h-[40px] rounded-[20px] flex justify-center items-center'>
                        Status: {statusNames[data.status]}
                    </div>
                </div>
                {isStore && data.status === 'TO_ACCEPT' ?
                    <div className='flex gap-4'>
                        <ConfirmModal Button={CancelButton} title='Cancel this order' content='Are you sure to cancel this order.' onConfirm={(e: any) => handleCancelOrder(e, data.id)} />
                        <ConfirmModal Button={AcceptButton} title='Accept this order' content='Are you sure to accept this order.' onConfirm={(e: any) => handleAcceptOrder(e, data.id)} />
                    </div>
                    : isStore && data.status === 'TO_PICKUP' && data.minutesDifference >= 30 ? // >=30 minute
                    <div className='flex justify-end gap-4'>
                        <ConfirmModal Button={CancelButton} title='Cancel this order' content='Are you sure to cancel this order.' onConfirm={(e: any) => handleCancelOrder(e, data.id)} />
                        <ConfirmModal Button={CompleteButton} title='Complete this order' content='Are you sure to complete this order.' onConfirm={(e: any) => handleCompleteOrder(e, data.id)} />
                    </div>
                    : isStore && data.status === 'TO_PICKUP' ? // <30 minute
                    <div className='flex gap-4'>
                        <ConfirmModal Button={CompleteButton} title='Complete this order' content='Are you sure to complete this order.' onConfirm={(e: any) => handleCompleteOrder(e, data.id)} />
                    </div>
                    : !isStore && (data.status === 'TO_ACCEPT' || data.status === 'TO_PICKUP') &&
                    <div className='flex justify-end gap-4'>
                        <ConfirmModal Button={CancelButton} title='Cancel this order' content='Are you sure to cancel this order.' onConfirm={(e: any) => handleCancelOrder(e, data.id)} />
                    </div>
                }
                
            </div>
        </div>
    )
}

export default OrderModal