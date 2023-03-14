import Image from "next/legacy/image"
import ConfirmModal from "../modal/confirmModal"

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
    onClickButton?: any,
    isStore: boolean,
    handleAcceptOrder?: any,
    handleCancelOrder?: any,
    handleCompleteOrder?: any,
}

function CancelButton({ onClickButton }) {
    return (
        <button
            
            className='bg-primary text-sm text-white font-semibold w-[100px] h-[40px] rounded-[20px] flex justify-center items-center'
            onClick={(e) => {e.stopPropagation();onClickButton();}}
        >
            Cancel
        </button>
    )
}
function AcceptButton({ onClickButton }) {
    return (
        <button
            className='bg-primary text-sm text-white font-semibold w-[100px] h-[40px] rounded-[20px] flex justify-center items-center'
            onClick={(e) => {e.stopPropagation();onClickButton();}}
        >
            Accept
        </button>
    )
}
function CompleteButton({ onClickButton }) {
    return (
        <button
            className='bg-primary text-sm text-white font-semibold w-[100px] h-[40px] rounded-[20px] flex justify-center items-center'
            onClick={(e) => {e.stopPropagation();onClickButton();}}
        >
            Complete
        </button>
    )
}

function OrderItem({data, onClickButton, isStore=false, handleAcceptOrder, handleCancelOrder, handleCompleteOrder}: Props) {

    return (
        <div className='flex flex-col w-[500px] h-fit rounded-3xl bg-white p-4'>
            {isStore ?
                <div className='text-base font-normal pb-4 border-b border-b-gray-5 flex gap-1 items-center cursor-pointer' onClick={() => onClickButton()}>
                    <Image src={'/images/user-icon.svg'} alt='user' width={32} height={32} />
                    {data.userName}
                </div>
                :
                <div className='text-base font-normal pb-4 border-b border-b-gray-5 flex gap-1 items-center cursor-pointer' onClick={() => onClickButton()}>
                    <Image src={'/images/store-icon.svg'} alt='store' width={28} height={28} />
                    {data.storeName}
                </div>
            }
            <div className='flex gap-4 relative w-full py-4 border-b border-b-gray-5 cursor-pointer' onClick={() => onClickButton()}>
                <div className='bg-gray-4 rounded-2xl min-w-[80px] max-w-[80px] h-[80px] overflow-hidden relative'>
                    {(data.reduction)[0].image  &&
                        <Image src={(data.reduction)[0].image} alt='image' layout="fill" objectFit="cover" />
                    }
                </div>
                <div className='flex flex-col gap-2 w-full'>
                    <div className='text-lg font-semibold'>{(data.reduction)[0].name}</div>
                    <div className='flex justify-between w-full'>
                        <div className='flex items-center gap-4 font-medium'>
                            <div className='text-md line-through'>฿{(data.reduction)[0].productPrice}</div>
                            <div className='text-xl'>฿{(data.reduction)[0].price}</div>
                        </div>
                        <div className='text-md font-medium'>Amount: {(data.reduction)[0].amount}</div>
                    </div>
                </div>
            </div>
            {(data.reduction).length > 1 &&
                <div
                    className='text-sm font-normal text-center text-gray-3 w-full py-2 border-b border-b-gray-5 cursor-pointer'
                    onClick={() => onClickButton()}
                >
                    View more items
                </div>
            }
            <div className='flex justify-between gap-4 pt-4'>
                <div>
                    <div className='text-lg font-bold flex gap-2'>
                        Total: ฿{(data.reduction).reduce((sum, item) => sum + (item.amount * item.price), 0)}
                        <div className='text-base font-medium text-gray-2'>({(data.reduction).reduce((sum, item) => sum + item.amount, 0)} {(data.reduction).reduce((sum, item) => sum + item.amount, 0)>1?'pieces':'piece'})</div>
                    </div>
                    <div className='text-xs text-gray-2'>Last update: Thu Jan 05 2023 14:53:01</div>
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

export default OrderItem