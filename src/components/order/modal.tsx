import Image from 'next/legacy/image'
import React from 'react'
import { ToastContainer } from 'react-toastify';
import ConfirmModal from '../confirmModal';

const statusNames = {'TO_ACCEPT': 'To Accept', 'TO_PICKUP': 'To Pickup', 'COMPLETE': 'Complete', 'CANCELED': 'Canceled'}

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
    userName: string,
    storeId: string,
    storeName: string,
    status: string,
    reduction: ReductionItemData[],
    lastUpdate: Date,
    minutesDifference: number,
}
type Props = {
    data?: OrderData,
    isStore?: boolean,
    handleAcceptOrder?: any,
    handleCancelOrder?: any,
    handleCompleteOrder?: any,
}

function OrderModal({ data, isStore=false, handleAcceptOrder, handleCancelOrder, handleCompleteOrder}: Props) {

    return (
        <div>
            <ToastContainer enableMultiContainer position="top-center" containerId='order' />
            <div className='m-6 min-h-[30vh] flex flex-col gap-4 justify-between relative'>
                {isStore ?
                    <div className='bg-gray-7 w-full text-md font-normal rounded-3xl p-4 flex gap-1 items-center'>
                        <Image src={'/images/user-icon.svg'} alt='user' width={28} height={28} />
                        {data.userName}
                    </div>
                    :
                    <div className='bg-gray-7 w-full text-md font-normal rounded-3xl p-4 flex gap-1 items-center'>
                        <Image src={'/images/store-icon.svg'} alt='store' width={24} height={24} />
                        {data.storeName}
                    </div>
                }
                {(data.reduction) && (data.reduction).length > 0 && (data.reduction).map((item, index) =>
                    <div className='flex gap-4 relative w-full bg-gray-7 rounded-3xl p-4' key={index}>
                        <div className='bg-gray-4 rounded-2xl min-w-[70px] max-w-[70px] h-[70px] overflow-hidden relative'>
                            {item.image  &&
                                <Image src={item.image} alt='image' layout="fill" objectFit="cover" />
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
                {(data.status === 'TO_ACCEPT' || data.status === 'TO_PICKUP') && (
                isStore ?
                    <div className='w-full text-sm text-error font-normal'>
                        If customer do not pick up order after you accept the order 30 minute, you can cancel the order.
                    </div>
                :
                    <div className='w-full text-sm text-error font-normal'>
                        If you do not pick up in 30 minute after store accept order, the store can cancel the order.<br/>
                        If an order has been canceled multiple times, you will be temporarily unable to place an order.
                    </div>
                )}
                {isStore && data.status === 'TO_ACCEPT' ?
                    <div className='flex gap-4'>
                        <ConfirmModal Button={CancelButton} title='Cancel this order' content='Are you sure to cancel this order?' onConfirm={(e: any) => handleCancelOrder(e, data.id)} />
                        <ConfirmModal Button={AcceptButton} title='Accept this order' content='Are you sure to accept this order?' onConfirm={(e: any) => handleAcceptOrder(e, data.id)} />
                    </div>
                    : isStore && data.status === 'TO_PICKUP' && data.minutesDifference >= 30 ? // >=30 minute
                    <div className='flex justify-end gap-4'>
                        <ConfirmModal Button={CancelButton} title='Cancel this order' content='Are you sure to cancel this order?' onConfirm={(e: any) => handleCancelOrder(e, data.id)} />
                        <ConfirmModal Button={CompleteButton} title='Complete this order' content='Are you sure to complete this order?' onConfirm={(e: any) => handleCompleteOrder(e, data.id)} />
                    </div>
                    : isStore && data.status === 'TO_PICKUP' ? // <30 minute
                    <div className='flex gap-4'>
                        <ConfirmModal Button={CompleteButton} title='Complete this order' content='Are you sure to complete this order?' onConfirm={(e: any) => handleCompleteOrder(e, data.id)} />
                    </div>
                    : !isStore && (data.status === 'TO_ACCEPT' || data.status === 'TO_PICKUP') &&
                    <div className='flex justify-end gap-4'>
                        <ConfirmModal
                            Button={CancelButton} title='Cancel this order'
                            content='Are you sure to cancel this order?'
                            warning='If an order has been canceled multiple times, you will be temporarily unable to place an order.'
                            onConfirm={(e: any) => handleCancelOrder(e, data.id)}
                        />
                    </div>
                }
                
            </div>
        </div>
    )
}

export default OrderModal