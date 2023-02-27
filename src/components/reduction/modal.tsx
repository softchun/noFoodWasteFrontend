import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { getTokenFromLocalStorage } from '../../utils/auth'
import { toast, ToastContainer } from 'react-toastify';
import Modal from '../modal';
import EditReduction from './editReduction';
import ConfirmModal from '../confirmModal';
import ChangeStore from '../modal/changeStore';

function discount(previous, current) {
    return parseFloat((((current - previous) / previous) * 100).toFixed(2))
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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

function formatImageSrc(image) {
    return 'data:' + image.img.contentType + ';base64,' + Buffer.from(image.img.data.data).toString('base64')
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
            console.log(response)
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
            console.log(response)
            if (!response.data.status) {
                if (response.data.errorCode === 'NOT_ENOUGH') {
                    toast("Can not add this reduction more.", { type: 'error' })
                }
                return;
            }
            toast("Add to cart successfully", { type: 'success', containerId: 'reduction' })
            // router.push('/product')
            // onClose()
            // updateData()
        } catch (error) {
            toast("Can not add this reduction more.", { type: 'error' })
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
            console.log(response)
            if (!response.data.status) {
                toast("Please try again later.", { type: 'error' })
                return;
            }
            toast("Delete item successfully", { type: 'success' })
            // router.push('/product')
            onClose()
            updateData()
        } catch (error) {
            toast("Please try again later.", { type: 'error' })
            console.error(error)
        }
    }

    return (
        <div>
            <ToastContainer enableMultiContainer position="top-center" containerId='reduction' />
            <div className='m-8 min-h-[30vh] flex flex-col justify-between relative'>
                <div className='flex gap-6'>
                    <div className='bg-gray-4 rounded-3xl w-[180px] min-w-[180px] h-[180px] overflow-hidden relative'>
                        {/* {data.image  &&
                            <Image src={formatImageSrc(data.image)} alt='image' fill />
                        } */}
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
                    </div>
                </div>
                {editable ?
                    <div className='flex gap-4'>
                        <Modal Component={EditReduction} Button={EditButton} title='Edit Reduction' data={data} updateData={() => {onClose(); updateData();}} />
                        <ConfirmModal Button={DeleteButton} title='Delete Reduction' content='Are you sure to delete this reduction.' onConfirm={handleDelete} />
                    </div>
                    :
                    <button
                        className='w-full h-10 mt-6 border-2 border-primary text-primary text-base font-medium disabled:bg-disabledgray rounded-lg'
                        onClick={handleSubmit}
                    >
                        Add to cart
                    </button>
                }
                
            </div>
            {!editable && <div className='flex gap-4 items-center bg-primary text-white p-4 rounded-b-3xl'>
                <div className='bg-gray-5 rounded-3xl w-[60px] min-w-[60px] h-[60px]'></div>
                <div className='flex flex-col flex-1 gap-2'>
                    <div className='text-base font-semibold'>{data.storeName}</div>
                    <div className='text-base font-normal'>07:30am - 10.45pm</div>
                </div>
                <button className='bg-gray-5 rounded-full w-10 h-10 text-primary text-xl font-bold'>{'>'}</button>
            </div>}
            {showChangeStoreModal &&
                <ChangeStore onCancel={() => setShowChangeStoreModal(false)} onConfirm={async(e: any) => {setShowChangeStoreModal(false); await handleAddToCart(e); }} />
            }
        </div>
    )
}

export default ReductionModal