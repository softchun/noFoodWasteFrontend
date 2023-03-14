import axios from 'axios'
import Image from 'next/legacy/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getTokenFromLocalStorage, handleAuthSSR } from '../../utils/auth'
import { uploadFile } from '../../utils/uploadFile'

type ItemData = {
    id: string,
    price: number,
    name: string,
    detail: string,
    storeId: string,
    image: any
}
type Props = {
    data?: ItemData,
    onClose?: any,
    updateData?: any,
}

function EditProduct({ data, onClose, updateData }: Props) {
    const router = useRouter()

    useEffect(() => {
        async function checkLogin() {
            await handleAuthSSR()
        }
        checkLogin()
    }, [])
    
    useEffect(() => {
        setName(data?.name)
        setPrice(data?.price)
        setDescription(data?.detail)
        setImage(data?.image)
    }, [data])

    const [name, setName] = useState<string>('')
    const [price, setPrice] = useState<number>(0)
    const [description, setDescription] = useState<string>('')
    const [image, setImage] = useState<string>('')
    const [imageFile, setImageFile] = useState<File>()
    const [disableSubmit, setDisableSubmit] = useState<boolean>(true)

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            const token = getTokenFromLocalStorage()
            if (!token) {
                return
            }
            let imageUrl = null
            if (imageFile) {
                imageUrl = await uploadFile(imageFile)
            }
            const url = `${process.env.NEXT_PUBLIC_API_URL}/product/update`
            const response = await axios.post(url, {
                id: data.id,
				name: name,
                price: price,
                detail: description,
                image: imageUrl,
            }, {
                headers: { authorization: token },
            })
            if (!response.data.status) {
                toast("Plese try again later.", { type: 'error' })
                return;
            }
            onClose()
            updateData()
            toast("Edit Product successfully", { type: 'success' })
        } catch (error) {
            toast("Plese try again later.", { type: 'error' })
            console.error(error)
        }
    }

    useEffect(() => {
        if (!name) {
            setDisableSubmit(true)
        } else if (name.length === 0 || price <= 0) {
            setDisableSubmit(true)
        } else {
            setDisableSubmit(false)
        }
    }, [name, price])

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 m-8 max-w-lg w-full text-base'>
            <label htmlFor='name' className='flex gap-1'>Product Name<div className='text-error'>*</div></label>
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
            <label htmlFor='price' className='flex gap-1'>Price<div className='text-error'>*</div></label>
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
            <label htmlFor='description'>Description</label>
            <textarea
                id='description'
                name='description'
                value={description}
                rows={4}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={'Description (at most 30 characters)'}
                className='p-3 border border-brandprimary'
            />
            <label htmlFor='image'>Image</label>
            <input
                type='file'
                id='image'
                name='image'
                accept="image/*"
                onChange={(e) => {setImageFile(e.target.files[0]); setImage(URL.createObjectURL(e.target.files[0]));}}
            />
            {image && image!=='' &&
                <div className='relative h-[120px] w-[120px] rounded-xl overflow-hidden'>
                    <Image src={image} alt='image' layout="fill" objectFit="cover" />
                </div>
                
            }
            <button
                type='submit'
                disabled={disableSubmit}
                className='w-40 h-10 mt-4 bg-primary disabled:bg-disabledgray text-white rounded-lg'
            >
                Update
            </button>
        </form>
    )
}

export default EditProduct