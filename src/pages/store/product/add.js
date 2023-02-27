import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Layout from '../../../components/layout/layout'
import { getTokenFromLocalStorage, handleAuthSSR } from '../../../utils/auth'

function Product({ props }) {
    const router = useRouter()

    useEffect(() => {
        async function checkLogin() {
            await handleAuthSSR()
        }
        checkLogin()
    }, [])

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')
    const [disableSubmit, setDisableSubmit] = useState(true)

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const token = getTokenFromLocalStorage()
            if (!token) {
                return
            }
            const url = `${process.env.NEXT_PUBLIC_API_URL}/product/add`
            const response = await axios.post(url, {
                name,
                price,
                detail: description,
                image
            }, {
                headers: { authorization: token },
            })
            // console.log(response)
            if (!response.data.status) {
                if (response.data.errorCode === 'USER_NOT_FOUND') {
                    setEmailErrorMessage("This email address is not registered as customer.")
                } else if (response.data.errorCode === 'WRONG_PASSWORD') {
                    setPasswordErrorMessage('Password is incorrect.')
                }
                return;
            }
            router.push('/product')
        } catch (error) {
            console.error(error)
        }
    }
    
    useEffect(() => {
        if (!name) {
            setDisableSubmit(true)
        } else if (name.length === 0 || price < 0) {
            setDisableSubmit(true)
        } else {
            setDisableSubmit(false)
        }
    }, [name, price])

    return (
        <Layout>
            <div className='text-[42px] font-bold text-primary m-8'>
                Add Product
            </div>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4 m-8 max-w-lg'>
                <label htmlFor='name'>Product Name</label>
                <input
                    type='text'
                    id='name'
                    name='name'
                    value={name}
                    maxLength={30}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={'Product Name (at most 30 characters)'}
                    className='p-3 border border-brandprimary'
                />
                <label htmlFor='price'>Price</label>
                <input
                    type='number'
                    id='price'
                    name='price'
                    value={price}
                    min={0}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder={'Price (at least 0 baht)'}
                    className='p-3 border border-brandprimary max-w-[200px]'
                />
                <label htmlFor='description'>Description</label>
                <textarea
                    type='text'
                    id='description'
                    name='description'
                    value={description}
                    rows={4}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={'Description (at most 30 characters)'}
                    className='p-3 border border-brandprimary'
                />
                {/* <label htmlFor='image'>Image</label>
                {image && image!=='' &&
                    <image src={image} alt='image' />
                }
                <input
                    type='file'
                    id='image'
                    name='image'
                    value={image}
                    accept="image/*"
                    onChange={(e) => {setImage(e.target.files[0]); console.log(e.target.files[0])}}
                /> */}
                <button
                    type='submit'
                    disabled={disableSubmit}
                    className='w-40 h-10 mt-4 bg-primary disabled:bg-disabledgray text-white rounded-lg'
                >
                    Add Product
                </button>
            </form>
        </Layout>
    )
}

export default Product