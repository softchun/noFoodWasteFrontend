import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { getTokenFromLocalStorage, handleAuthSSR } from '../../utils/auth'
import AddProduct from '../product/addProduct'
import Modal from '../modal'
import ModalButton from '../modalButton'
import ProductItem from '../product/productItem'
import ProductList from '../product/productList'

function AddReduction({ onClose, updateData, selectedProduct }) {
    const router = useRouter()

    useEffect(() => {
        async function checkLogin() {
            await handleAuthSSR()
        }
        checkLogin()
    }, [])

    useEffect(() => {
        if (selectedProduct) {
            setProduct(selectedProduct)
        }
    }, [selectedProduct])

    const [product, setProduct] = useState(null)
    const [stock, setStock] = useState<number>(0)
    const [price, setPrice] = useState<number>(0)
    const [expirationDate, setExpirationDate] = useState<string>('')
    const [bestBeforeDate, setBestBeforeDate] = useState<string>('')
    const [disableSubmit, setDisableSubmit] = useState<boolean>(true)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const token = getTokenFromLocalStorage()
            if (!token) {
                return
            }
            const url = `${process.env.NEXT_PUBLIC_API_URL}/reduction/add`
            const response = await axios.post(url, {
                productId: product.id,
                stock,
                price,
                expirationDate,
                bestBeforeDate,
            }, {
                headers: { authorization: token },
            })
            // console.log(response)
            // if (!response.data.status) {
            //     if (response.data.errorCode === 'USER_NOT_FOUND') {
            //         setEmailErrorMessage("This email address is not registered as customer.")
            //     } else if (response.data.errorCode === 'WRONG_PASSWORD') {
            //         setPasswordErrorMessage('Password is incorrect.')
            //     }
            //     return;
            // }
            // router.push('/reduction')
            onClose()
            updateData()
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        console.log(product, price, stock)
        if (!product) {
            setDisableSubmit(true)
        } else if (!product?.id || price <= 0 || stock <= 0) {
            setDisableSubmit(true)
        } else {
            setDisableSubmit(false)
        }
    }, [product, price, stock])

    return (
        <div className='flex flex-col gap-4 m-8 max-w-lg w-full text-base'>
            <label htmlFor='product' className='flex gap-1'>Product<div className='text-error'>*</div></label>
            {product &&
                <ProductItem data={product} style='bg-gray-7 w-full min-w-full max-w-full' />
            }
            <Modal Component={ProductList} title={product?'Change Product':'Select Product'} Button={ModalButton} onClickItem={(item) => setProduct(item)} />
            <label htmlFor='price' className='flex gap-1'>Reduction Price<div className='text-error'>*</div></label>
            <input
                type='number'
                id='price'
                name='price'
                value={price}
                min={0}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder={'Price (at least 0 baht)'}
                className='p-3 border border-brandprimary max-w-[200px]'
            />
            <label htmlFor='stock' className='flex gap-1'>Stock<div className='text-error'>*</div></label>
            <input
                type='number'
                id='stock'
                name='stock'
                value={stock}
                min={0}
                onChange={(e) => setStock(Number(e.target.value))}
                placeholder={'Stock'}
                className='p-3 border border-brandprimary max-w-[200px]'
            />
            <label htmlFor='expirationDate'>Expiration Date</label>
            <input
                type='date'
                id='expirationDate'
                name='expirationDate'
                value={expirationDate}
                onChange={(e) => {setExpirationDate(e.target.value)}}
                className='p-3 border border-brandprimary max-w-[200px]'
            />
            <label htmlFor='bestBeforeDate'>Best Before Date</label>
            <input
                type='date'
                id='bestBeforeDate'
                name='bestBeforeDate'
                value={bestBeforeDate}
                onChange={(e) => {setBestBeforeDate(e.target.value)}}
                className='p-3 border border-brandprimary max-w-[200px]'
            />
            <button
                type='submit'
                disabled={disableSubmit}
                onClick={handleSubmit}
                className='w-40 h-10 mt-4 bg-primary disabled:bg-disabledgray text-white rounded-lg'
            >
                Add Reduction
            </button>
        </div>
    )
}

export default AddReduction