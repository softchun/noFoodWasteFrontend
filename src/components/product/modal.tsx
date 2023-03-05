import axios from 'axios'
import Image from 'next/legacy/image'
import React, { useEffect, useState } from 'react'
import { getTokenFromLocalStorage } from '../../utils/auth'
import { toast, ToastContainer } from 'react-toastify';
import Modal from '../modal';
import ConfirmModal from '../confirmModal';
import EditProduct from './editProduct';
import ReductionModal from '../reduction/modal';
import AddReduction from '../reduction/addReduction';

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
            className='w-[50%] h-10 border-2 border-primary text-primary text-base font-medium rounded-lg'
            onClick={() => onClickButton()}
        >
            Edit
        </button>
    )
}

function DeleteButton({ onClickButton }) {
    return (
        <button
            className='w-[50%] h-10 border-2 border-error text-error text-base font-medium rounded-lg'
            onClick={() => onClickButton()}
        >
            Delete
        </button>
    )
}

function AddReductionButton({ onClickButton }) {
    return (
        <button
            className='w-full h-10 border-2 border-warning text-warning text-base font-medium rounded-lg'
            onClick={() => onClickButton()}
        >
            Add Reduction
        </button>
    )
}

function ReductionItem({ data, onClickButton }) {
    return (
        <button
            className='w-[45%] p-4 bg-gray-6 text-base font-medium rounded-2xl flex flex-col gap-4'
            onClick={() => onClickButton()}
        >
            <div className='flex gap-2 items-center'>
                <div className='bg-warning text-md font-semibold p-1 flex justify-center items-center rounded-md'>{discount(data.productPrice, data.price)}%</div>
                <div>reduced to ฿{data.price}</div>
            </div>
            {data.expirationDate && <div className='text-base font-medium text-error'>Expires : {formatDate(data.expirationDate)}</div>}
        </button>
    )
}

type ItemData = {
    id: string,
    price: number,
    name: string,
    detail: string,
    storeId: string,
    image: any,
    reductions: any
}
type Props = {
    data?: ItemData,
    onClose?: any,
    onClickItem?: any,
    updateData?: any,
}

function ProductModal({ data, onClose, onClickItem, updateData }: Props) {
    
    const handleDelete = async (e: any) => {
        e.preventDefault()
        try {
            const token = getTokenFromLocalStorage()
            if (!token) {
                return
            }
            const url = `${process.env.NEXT_PUBLIC_API_URL}/product/delete`
            const response = await axios.post(url, {
                id: data.id,
            }, {
                headers: { authorization: token },
            })
            console.log(response)
            if (!response.data.status) {
                toast("Please try again later.", { type: 'error', containerId: 'product' })
                return;
            }
            toast("Delete item successfully", { type: 'success' })
            // router.push('/product')
            onClose()
            updateData()
        } catch (error) {
            toast("Please try again later.", { type: 'error', containerId: 'product' })
            console.error(error)
        }
    }

    return (
        <div>
            <ToastContainer enableMultiContainer position="top-center" containerId='product' />
            <div className='m-8 min-h-[30vh] flex flex-col gap-6 justify-between relative'>
                <div className='flex gap-6'>
                    <div className='bg-gray-4 rounded-3xl w-[180px] min-w-[180px] h-[180px] overflow-hidden relative'>
                        {data.image  &&
                            <Image src={data.image} alt='image' layout="fill" objectFit="cover" />
                        }
                    </div>
                    <div className='flex flex-col gap-2'>
                        <div className='text-xl font-bold flex gap-2'>{data.name}</div>
                        {/* <div className='text-base font-medium text-error'>{data.stock} Left</div> */}
                        <div className='flex items-center gap-4 font-semibold'>
                            {/* <div className='text-lg line-through'>฿{data.productPrice}</div> */}
                            <div className='text-2xl'>฿{data.price}</div>
                        </div>
                        {/* {data.expirationDate && <div className='text-base font-medium text-error'>Expires : {formatDate(data.expirationDate)}</div>} */}
                    </div>
                </div>
                {data.detail && <div className='text-base font-normal'>Description: {data.detail}</div>}
                <div className='flex gap-4'>
                    <Modal Component={EditProduct} Button={EditButton} title='Edit Product' data={data} updateData={() => {onClose(); updateData();}} />
                    <ConfirmModal Button={DeleteButton} title='Delete Product' content='Are you sure to delete this product.' onConfirm={handleDelete} />
                </div>
                {data.reductions && (data.reductions).length > 0 &&
                    <div>
                        <div className='text-lg font-semibold'>Reduction of Product</div>
                        <div className='flex flex-wrap gap-4 mt-4'>
                            {(data.reductions).map((item, index) => 
                                <Modal
                                    Component={ReductionModal} Button={ReductionItem}
                                    title={data.name} key={index} editable={true}
                                    updateData={updateData}
                                    data={({
                                        ...item,
                                        name: data.name,
                                        productPrice: data.price,
                                        image: data.image,
                                        detail: data.detail
                                    })}
                                />
                            )}
                        </div>
                    </div>
                }
                <Modal Component={AddReduction} Button={AddReductionButton} title='Add Reduction' selectedProduct={data} updateData={() => {onClose(); updateData();}} />
            </div>
            {/* {!editable && <div className='flex gap-4 items-center bg-primary text-white p-4 rounded-b-3xl'>
                <div className='bg-gray-5 rounded-3xl w-[60px] min-w-[60px] h-[60px]'></div>
                <div className='flex flex-col flex-1 gap-2'>
                    <div className='text-base font-semibold'>{data.storeName}</div>
                    <div className='text-base font-normal'>07:30am - 10.45pm</div>
                </div>
                <button className='bg-gray-5 rounded-full w-10 h-10 text-primary text-xl font-bold'>{'>'}</button>
            </div>} */}
        </div>
    )
}

export default ProductModal