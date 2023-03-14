import axios from 'axios'
import Image from 'next/legacy/image'
import React, { useState } from 'react'
import { getTokenFromLocalStorage } from '../../utils/auth'
import { toast, ToastContainer } from 'react-toastify';
import Modal from '../modal/modal';
import EditReduction from './editReduction';
import ConfirmModal from '../modal/confirmModal';
import ChangeStore from '../modal/changeStore';
import formatOpenTime from '../../utils/formatOpenTime';

function discount(previous, current) {
    return parseFloat((((current - previous) / previous) * 100).toFixed(2))
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const weekdayShort = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function formatDate(date) {
    let dateTime = new Date(date)
    let d = dateTime.getDate()
    let m = dateTime.getMonth()
    let y = dateTime.getFullYear()
    return d + ' ' + monthNames[m] + ' ' + y
}

function EditButton({ onClickButton }) {
    return (
        <button
            className='w-[50%] h-10 mt-6 border-2 border-primary text-primary text-base font-medium rounded-lg'
            onClick={() => onClickButton()}
        >
            Edit
        </button>
    )
}

function DeleteButton({ onClickButton }) {
    return (
        <button
            className='w-[50%] h-10 mt-6 border-2 border-error text-error text-base font-medium rounded-lg'
            onClick={() => onClickButton()}
        >
            Delete
        </button>
    )
}

type OpenData = {
    open: string,
    close: string,
    isClosed: boolean
}
type OpenTimeData = {
    all: {
        open: string;
        close: string;
        isClosed: boolean;
        isAll: boolean;
    };
    sun: OpenData;
    mon: OpenData;
    tue: OpenData;
    wed: OpenData;
    thu: OpenData;
    fri: OpenData;
    sat: OpenData;
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
    storeImage: string,
    storeOpenTime: OpenTimeData,
    image: any,
    expirationDate: string,
    bestBeforeDate: string,
}
type Props = {
    data?: ItemData,
    editable?: boolean,
    onClose?: any,
    onClickItem?: any,
    updateData?: any,
}

function ReductionModal({ data, editable=false, onClose, onClickItem, updateData }: Props) {

    const [showChangeStoreModal, setShowChangeStoreModal] = useState<boolean>(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            const token = getTokenFromLocalStorage()
            if (!token) {
                return
            }
            const url = `${process.env.NEXT_PUBLIC_API_URL}/cart/check-store`
            const response = await axios.post(url, {
                reductionId: data.id,
            }, {
                headers: { authorization: token },
            })
            if (!response.data.status) {
                toast("Please try again later.", { type: 'error' })
                return;
            }
            if (response.data.isSameStore === true) {
                handleAddToCart(e)
            } else if (response.data.isSameStore === false) {
                setShowChangeStoreModal(true)
            } else {
                toast("Please try again later.", { type: 'error' })
            }
        } catch (error) {
            toast("Please try again later.", { type: 'error' })
            console.error(error)
        }
    }
    
    const handleAddToCart = async (e: any) => {
        e.preventDefault()
        try {
            const token = getTokenFromLocalStorage()
            if (!token) {
                return
            }
            const url = `${process.env.NEXT_PUBLIC_API_URL}/cart/add`
            const response = await axios.post(url, {
                reductionId: data.id,
                amount: 1,
            }, {
                headers: { authorization: token },
            })
            if (!response.data.status) {
                if (response.data.errorCode === 'NOT_ENOUGH') {
                    toast("Can not add this reduction more.", { type: 'error', containerId: 'reduction' })
                }
                return;
            }
            toast("Add to cart successfully", { type: 'success', containerId: 'reduction' })
        } catch (error) {
            toast("Can not add this reduction more.", { type: 'error', containerId: 'reduction' })
            console.error(error)
        }
    }
    
    const handleDelete = async (e: any) => {
        e.preventDefault()
        try {
            const token = getTokenFromLocalStorage()
            if (!token) {
                return
            }
            const url = `${process.env.NEXT_PUBLIC_API_URL}/reduction/delete`
            const response = await axios.post(url, {
                id: data.id,
            }, {
                headers: { authorization: token },
            })
            if (!response.data.status) {
                toast("Please try again later.", { type: 'error', containerId: 'reduction' })
                return;
            }
            toast("Delete item successfully", { type: 'success' })
            onClose()
            updateData()
        } catch (error) {
            toast("Please try again later.", { type: 'error', containerId: 'reduction' })
            console.error(error)
        }
    }

    return (
        <div>
            <ToastContainer enableMultiContainer position="top-center" containerId='reduction' />
            <div className='m-8 min-h-[30vh] flex flex-col justify-between relative'>
                <div className='flex gap-6'>
                    <div className='bg-gray-4 rounded-3xl w-[180px] min-w-[180px] h-[180px] overflow-hidden relative'>
                        {data.image  &&
                            <Image src={data.image} alt='image' layout="fill" objectFit="cover" />
                        }
                    </div>
                    <div className='flex flex-col gap-2'>
                        <div className='text-xl font-bold flex gap-2'>{data.name}
                            <div className='bg-warning text-sm font-semibold w-[70px] h-[30px] flex justify-center items-center'>{discount(data.productPrice, data.price)}%</div></div>
                        <div className='text-base font-medium text-error'>{data.stock} Left</div>
                        <div className='flex items-center gap-4 font-semibold'>
                            <div className='text-lg line-through'>฿{data.productPrice}</div>
                            <div className='text-2xl'>฿{data.price}</div>
                        </div>
                        {data.expirationDate && <div className='text-base font-medium text-error'>Expires : {formatDate(data.expirationDate)}</div>}
                        {data.bestBeforeDate && <div className='text-base font-medium text-warning'>Best Before : {formatDate(data.bestBeforeDate)}</div>}
                    </div>
                </div>
                {data.detail && 
                    <div className='mt-3'>Detail : {data.detail}</div>
                }
                {editable ?
                    <div className='flex gap-4'>
                        <Modal Component={EditReduction} Button={EditButton} title='Edit Reduction' data={data} updateData={() => {onClose(); updateData();}} />
                        <ConfirmModal Button={DeleteButton} title='Delete Reduction' content='Are you sure to delete this reduction.' onConfirm={handleDelete} />
                    </div>
                    :
                    <button
                        className='w-full h-10 mt-6 border-2 border-primary text-primary text-base font-medium disabled:bg-disabledgray rounded-lg flex justify-center items-center'
                        onClick={handleSubmit}
                    >
                        <div className='flex items-center gap-2'>
                            <Image src={'/images/add-icon.svg'} alt='add' width={22} height={22} />
                            Add to cart
                        </div>
                    </button>
                }
                
            </div>
            {!editable && <div className='flex gap-4 items-center bg-primary text-white p-4 rounded-b-3xl'>
                <div className='bg-gray-5 rounded-2xl w-[60px] min-w-[60px] h-[60px] overflow-hidden relative'>
                    {data.storeImage  &&
                        <Image src={data.storeImage} alt='image' layout="fill" objectFit="cover" />
                    }
                </div>
                <div className='flex flex-col flex-1 gap-2'>
                    <div className='text-base font-semibold'>{data.storeName}</div>
                    <div className='text-base font-medium flex gap-1 items-center'>
                        <Image src={'/images/clock-white-icon.svg'} alt='clock' width={24} height={24} />
                        {formatOpenTime(data.storeOpenTime)}
                    </div>
            </div>
                <button className='w-10 h-10'>
                    <Image src={'/images/view-store-icon.svg'} alt='view-store' width={40} height={40} />
                </button>
            </div>}
            {showChangeStoreModal &&
                <ChangeStore onCancel={() => setShowChangeStoreModal(false)} onConfirm={async(e: any) => {setShowChangeStoreModal(false); await handleAddToCart(e); }} />
            }
        </div>
    )
}

export default ReductionModal