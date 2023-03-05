import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { getTokenFromLocalStorage, handleAuthSSR } from '../../utils/auth'
import AddProduct from '../product/addProduct'
import Modal from '../modal'
import ModalButton from '../modalButton'
import ProductItem from '../product/productItem'
import ProductList from '../product/productList'
import { toast } from 'react-toastify';

function formatDate(date) {
    if (!date) return null
    let dateTime = new Date(date)
    let d = dateTime.getDate()
    let m = dateTime.getMonth()
    let y = dateTime.getFullYear()
    return y.toString() + '-' + (m+1).toString().padStart(2, '0') + '-' + d.toString().padStart(2, '0')
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
    expirationDate: string,
    bestBeforeDate: string,
}
type Props = {
    data?: ItemData,
    onClose?: any,
    updateData?: any
}

function EditReduction({ data, onClose, updateData }: Props) {
    const router = useRouter()

    useEffect(() => {
        async function checkLogin() {
            await handleAuthSSR()
        }
        checkLogin()
    }, [])

    useEffect(() => {
        setProduct({
            id: data?.productId,
            name: data?.name,
            price: data?.productPrice,
            detail: data?.detail,
            image: data?.image,
        })
        setStock(data?.stock)
        setPrice(data?.price)
        setExpirationDate(formatDate(data?.expirationDate))
    }, [data])

    const [product, setProduct] = useState<any>()
    const [stock, setStock] = useState<number>()
    const [price, setPrice] = useState<number>(0)
    const [expirationDate, setExpirationDate] = useState<string>('')
    const [bestBeforeDate, setBestBeforeDate] = useState<string>('')
    const [disableSubmit, setDisableSubmit] = useState<boolean>(true)

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            const token = getTokenFromLocalStorage()
            if (!token) {
                return
            }
            const url = `${process.env.NEXT_PUBLIC_API_URL}/reduction/update`
            const response = await axios.post(url, {
                id: data.id,
                productId: product.id,
                stock,
                price,
                expirationDate,
                bestBeforeDate,
            }, {
                headers: { authorization: token },
            })
            console.log(response)
            if (!response.data.status) {
                toast("Plese try again later.", { type: 'error' })
                return;
            }
            toast("Edit data successfully", { type: 'success' })
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
            toast("Plese try again later.", { type: 'error' })
            console.error(error)
        }
    }

    useEffect(() => {
        console.log(product, price, stock, expirationDate)
        if (!product) {
            setDisableSubmit(true)
        } else if (!product?.id || price <= 0 || stock <= 0) {
            setDisableSubmit(true)
        } else {
            setDisableSubmit(false)
        }
    }, [product, price, stock, expirationDate])

    return (
        <div className='flex flex-col gap-4 m-8 max-w-lg w-full text-base'>
            <label htmlFor='product'>Product</label>
            {product &&
                <ProductItem data={product} style='bg-gray-7 w-full min-w-full max-w-full' />
            }
            {/* <Modal Component={ProductList} title={product?'Change Product':'Select Product'} Button={ModalButton} onClickItem={(item) => setProduct(item)} /> */}
            <label htmlFor='price'>Reduction Price</label>
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
            <label htmlFor='stock'>Stock</label>
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
                Submit
            </button>
        </div>
    )
}

export default EditReduction