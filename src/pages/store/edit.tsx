import axios from 'axios'
import Router, { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import AddReduction from '../../components/reduction/addReduction'
import Layout from '../../components/layout/layout'
import Modal from '../../components/modal'
import ModalButton from '../../components/modalButton'
import ReductionItem from '../../components/reduction/reductionItem'
import { getTokenFromLocalStorage, handleAuthSSR } from '../../utils/auth'
import dynamic from "next/dynamic"
import ReductionModal from '../../components/reduction/modal'
import Image from 'next/image'
import Toggle from '../../components/ui/toggle'

import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { icon } from 'leaflet';
import MapSearch from '../../components/map/mapSearch'
import {uploadFile} from '../../utils/uploadFile'
import { toast } from 'react-toastify'

const ICON = icon({
    iconUrl: '/images/shop-icon.svg',
    iconSize: [32, 32],
})

const MyMap = dynamic(() => import("../../components/map/map"), { ssr:false })
const MyMapSetting = dynamic(() => import("../../components/mapSetting"), { ssr:false })

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const positionInit = {lat: 13.846432943388642, lng: 100.56985012110151}
// const positionInit2 = {lat: 13.846432943388660, lng: 100.56985012110151}
const positionInit2 = {
    lat: 13.869420810923787,
    lng: 100.51786976168559
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
type LocationData = {
    lat: number;
    lng: number;
}
type StoreData = {
    id: string,
    email: string,
    name: string,
    isClosed: boolean;
    detail?: string,
    profileImage?: any,
    coverImage?: any,
    address?: string;
    location?: LocationData;
    openTime: OpenTimeData;
}

function EditStore() {
    const router = useRouter()

    const [store, setStore] = useState<StoreData>()
    const [day, setDay] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    
    const [name, setName] = useState<string>()
    const [isClosed, setIsClosed] = useState<boolean>()
    const [detail, setDetail] = useState<string>()
    const [address, setAddress] = useState<string>()
    const [location, setLocation] = useState<LocationData>(null)
    const [openTime, setOpenTime] = useState<OpenTimeData>()
    const [profileImage, setProfileImage] = useState<string>()
    const [profileImageFile, setProfileImageFile] = useState<File>()
    const [coverImage, setCoverImage] = useState<string>()
    const [coverImageFile, setCoverImageFile] = useState<File>()

    
    useEffect(() => {
        async function checkLogin() {
            await handleAuthSSR()
        }
        checkLogin()

        const d = new Date();
        setDay(d.getDay())
    })

    useEffect(() => {
        async function fetchData() {
            const token = getTokenFromLocalStorage()
            const url = `${process.env.NEXT_PUBLIC_API_URL}/store/detail`
            const response = await axios.get(url, {
                headers: { authorization: token }
            })
            if (!response.status) {
                Router.push('/store/login')
            }
            setStore(response.data.store)

            setName(response.data.store.name)
            setIsClosed(response.data.store.isClosed)
            setDetail(response.data.store.detail)
            setAddress(response.data.store.address)
            setOpenTime(response.data.store.openTime)
            console.log('location res', response.data.store.location)
            if (response.data.store.location && response.data.store.location?.lat && response.data.store.location?.lng) {
                setLocation(response.data.store.location)
                // setLocation(positionInit2)
            }
            setProfileImage(response.data.store.profileImage)
            setCoverImage(response.data.store.coverImage)

            setIsLoading(false)
        }
        fetchData()
    }, [isLoading])

    async function handleUpload() {
        // const profileImageUrl = uploadFile(profileImageFile)
        // console.log('profile url', profileImageUrl)

        // uploadFile(profileImageFile).then((url) => {
        //     console.log('profile url', url)
        // })

        let profileImageUrl = null
        if (profileImageFile) {
            profileImageUrl = await uploadFile(profileImageFile)
            console.log('profile url', profileImageUrl)
        }
    }
    
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            const token = getTokenFromLocalStorage()
            if (!token) {
                return
            }
            let profileImageUrl = null
            if (profileImageFile) {
                profileImageUrl = await uploadFile(profileImageFile)
            }
            let coverImageUrl = null
            if (coverImageFile) {
                coverImageUrl = await uploadFile(coverImageFile)
            }
            console.log('data',
                name,
                openTime,
                isClosed,
                detail,
                address,
                location,
                profileImageUrl,
                coverImageUrl,
            )
            const url = `${process.env.NEXT_PUBLIC_API_URL}/store/update`
            const response = await axios.post(url, {
                name,
                openTime,
                isClosed,
                detail,
                address,
                location,
                profileImage: profileImageUrl,
                coverImage: coverImageUrl,
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
            router.push('/store/my-store')
        } catch (error) {
            toast("Plese try again later.", { type: 'error' })
            console.error(error)
        }
    }

    useEffect(() => {
        console.log('location', location)
    }, [location])

    function LocationMarker() {
        // const [position2, setPosition2] = useState<PositionData>(center)
        const map = useMapEvents({
            click(e) {
                // console.log(e)
                // map.locate()
                setLocation(e.latlng)
                // setPosition(e.latlng)
                map.flyTo(e.latlng, map.getZoom())
                console.log('e', e.latlng)
            },
            // locationfound(e) {
            //     setPosition(e.latlng)
            //     map.flyTo(e.latlng, map.getZoom())
            // },
        })

        return location === null ? null : (
            <Marker position={location} icon={ICON}>
                <Popup>You are here</Popup>
            </Marker>
        )
    }

    return (
        <Layout>
            {isLoading?
                <div className='flex justify-center items-center w-full h-full text-2xl font-bold'>Loading...</div>
            :
                <div className='flex flex-col gap-6 w-full p-8 text-primary'>
                    <div className='text-4xl font-bold'>Edit Store</div>
                    {store.isClosed === false &&
                        <div className='w-full flex justify-center items-center bg-gray-8 text-gray-3 p-3 rounded-lg text-lg'>Close Temperary</div>
                    }
                    <div className='flex flex-col gap-3'>
                        <div className='font-bold text-lg'>Cover Image</div>
                        <div className='w-full h-[20vw] bg-gray-4 rounded-lg relative overflow-hidden'>
                            {!coverImage && <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>No Image</div>}
                            {coverImage &&
                                <Image src={coverImage} alt='cover-image' fill />
                            }
                            <label htmlFor='cover-image' className='bg-gray-7  p-2 rounded-2xl text-base absolute bottom-2 right-2 cursor-pointer'>
                                Edit
                            </label>
                            <input
                                type='file'
                                id='cover-image'
                                name='cover-image'
                                accept="image/*"
                                className='hidden'
                                onChange={(e) => {setCoverImageFile(e.target.files[0]); setCoverImage(URL.createObjectURL(e.target.files[0]));}}
                            />
                        </div>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <div className='font-bold text-lg'>Profile Image</div>
                        <div className='max-w-[10vw] min-w-[100px] max-h-[10vw] min-h-[100px] w-full h-full aspect-square bg-gray-4 rounded-lg relative overflow-hidden'>
                            {!profileImage && <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm'>No Image</div>}
                            {profileImage &&
                                <Image src={profileImage} alt='profile-image' fill />
                            }
                            <label htmlFor='profile-image' className='bg-gray-7 p-2 rounded-2xl text-sm absolute bottom-2 right-2 cursor-pointer'>
                                Edit
                            </label>
                            <input
                                type='file'
                                id='profile-image'
                                name='profile-image'
                                accept="image/*"
                                className='hidden'
                                onChange={(e) => {setProfileImageFile(e.target.files[0]); setProfileImage(URL.createObjectURL(e.target.files[0]));}}
                            />
                        </div>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <div className='font-bold text-lg'>Store Name (*required)</div>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            value={name}
                            maxLength={30}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={'Store Name (at most 30 characters)'}
                            className='p-3 border border-brandprimary rounded-lg'
                        />
                    </div>
                    <div className='flex flex-col gap-3'>
                        <div className='font-bold text-lg'>Detail</div>
                        <textarea
                            id='detail'
                            name='detail'
                            value={detail}
                            rows={4}
                            onChange={(e) => setDetail(e.target.value)}
                            placeholder={'Detail of your store'}
                            className='p-3 border border-brandprimary rounded-lg'
                        />
                    </div>
                    <div className='flex gap-3'>
                        <div className='font-bold text-lg'>Close Temperary</div>
                        <Toggle enabled={isClosed} setEnabled={(enabled: boolean) => setIsClosed(enabled)} />
                    </div>
                    <div className='text-base font-normal text-primary flex flex-col gap-2 max-w-[700px]'>
                        <div className='font-bold text-lg'>Open Time</div>
                        <div className={`flex flex-wrap justify-between w-full`}>
                            <div className='font-medium w-[100px]'>{weekday[0]}</div>
                            <Toggle title='Closed' enabled={openTime.sun.isClosed} setEnabled={(enabled: boolean) => setOpenTime({...openTime, sun: {...openTime.sun, isClosed: enabled}})} />
                            <div className={`flex flex-wrap gap-x-8 ${openTime.sun.isClosed && 'text-gray-4'}`}>
                                <div className='flex gap-2'>
                                    <div>Open:</div>
                                    <input
                                        type='time'
                                        id='open-sun'
                                        name='open-sun'
                                        value={openTime.sun.open}
                                        disabled={openTime.sun.isClosed}
                                        onChange={(e) => setOpenTime({...openTime, sun: {...openTime.sun, open: e.target.value}})}
                                    />
                                </div>
                                <div className='flex gap-2'>
                                    <div>Close:</div>
                                    <input
                                        type='time'
                                        id='close-sun'
                                        name='close-sun'
                                        value={openTime.sun.close}
                                        disabled={openTime.sun.isClosed}
                                        onChange={(e) => setOpenTime({...openTime, sun: {...openTime.sun, close: e.target.value}})}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={`flex flex-wrap justify-between w-full`}>
                            <div className='font-medium w-[100px]'>{weekday[1]}</div>
                            <Toggle title='Closed' enabled={openTime.mon.isClosed} setEnabled={(enabled: boolean) => setOpenTime({...openTime, mon: {...openTime.mon, isClosed: enabled}})} />
                            <div className={`flex flex-wrap gap-x-8 ${openTime.mon.isClosed && 'text-gray-4'}`}>
                                <div className='flex gap-2'>
                                    <div>Open:</div>
                                    <input
                                        type='time'
                                        id='open-mon'
                                        name='open-mon'
                                        value={openTime.mon.open}
                                        disabled={openTime.mon.isClosed}
                                        onChange={(e) => setOpenTime({...openTime, mon: {...openTime.mon, open: e.target.value}})}
                                    />
                                </div>
                                <div className='flex gap-2'>
                                    <div>Close:</div>
                                    <input
                                        type='time'
                                        id='close-mon'
                                        name='close-mon'
                                        value={openTime.mon.close}
                                        disabled={openTime.mon.isClosed}
                                        onChange={(e) => setOpenTime({...openTime, mon: {...openTime.mon, close: e.target.value}})}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={`flex flex-wrap justify-between w-full`}>
                            <div className='font-medium w-[100px]'>{weekday[2]}</div>
                            <Toggle title='Closed' enabled={openTime.tue.isClosed} setEnabled={(enabled: boolean) => setOpenTime({...openTime, tue: {...openTime.tue, isClosed: enabled}})} />
                            <div className={`flex flex-wrap gap-x-8 ${openTime.tue.isClosed && 'text-gray-4'}`}>
                                <div className='flex gap-2'>
                                    <div>Open:</div>
                                    <input
                                        type='time'
                                        id='open-tue'
                                        name='open-tue'
                                        value={openTime.tue.open}
                                        disabled={openTime.tue.isClosed}
                                        onChange={(e) => setOpenTime({...openTime, tue: {...openTime.tue, open: e.target.value}})}
                                    />
                                </div>
                                <div className='flex gap-2'>
                                    <div>Close:</div>
                                    <input
                                        type='time'
                                        id='close-tue'
                                        name='close-tue'
                                        value={openTime.tue.close}
                                        disabled={openTime.tue.isClosed}
                                        onChange={(e) => setOpenTime({...openTime, tue: {...openTime.tue, close: e.target.value}})}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={`flex flex-wrap justify-between w-full`}>
                            <div className='font-medium w-[100px]'>{weekday[3]}</div>
                            <Toggle title='Closed' enabled={openTime.wed.isClosed} setEnabled={(enabled: boolean) => setOpenTime({...openTime, wed: {...openTime.wed, isClosed: enabled}})} />
                            <div className={`flex flex-wrap gap-x-8 ${openTime.wed.isClosed && 'text-gray-4'}`}>
                                <div className='flex gap-2'>
                                    <div>Open:</div>
                                    <input
                                        type='time'
                                        id='open-wed'
                                        name='open-wed'
                                        value={openTime.wed.open}
                                        disabled={openTime.wed.isClosed}
                                        onChange={(e) => setOpenTime({...openTime, wed: {...openTime.wed, open: e.target.value}})}
                                    />
                                </div>
                                <div className='flex gap-2'>
                                    <div>Close:</div>
                                    <input
                                        type='time'
                                        id='close-wed'
                                        name='close-wed'
                                        value={openTime.wed.close}
                                        disabled={openTime.wed.isClosed}
                                        onChange={(e) => setOpenTime({...openTime, wed: {...openTime.wed, close: e.target.value}})}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={`flex flex-wrap justify-between w-full`}>
                            <div className='font-medium w-[100px]'>{weekday[4]}</div>
                            <Toggle title='Closed' enabled={openTime.thu.isClosed} setEnabled={(enabled: boolean) => setOpenTime({...openTime, thu: {...openTime.thu, isClosed: enabled}})} />
                            <div className={`flex flex-wrap gap-x-8 ${openTime.thu.isClosed && 'text-gray-4'}`}>
                                <div className='flex gap-2'>
                                    <div>Open:</div>
                                    <input
                                        type='time'
                                        id='open-thu'
                                        name='open-thu'
                                        value={openTime.thu.open}
                                        disabled={openTime.thu.isClosed}
                                        onChange={(e) => setOpenTime({...openTime, thu: {...openTime.thu, open: e.target.value}})}
                                    />
                                </div>
                                <div className='flex gap-2'>
                                    <div>Close:</div>
                                    <input
                                        type='time'
                                        id='close-thu'
                                        name='close-thu'
                                        value={openTime.thu.close}
                                        disabled={openTime.thu.isClosed}
                                        onChange={(e) => setOpenTime({...openTime, thu: {...openTime.thu, close: e.target.value}})}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={`flex flex-wrap justify-between w-full`}>
                            <div className='font-medium w-[100px]'>{weekday[5]}</div>
                            <Toggle title='Closed' enabled={openTime.fri.isClosed} setEnabled={(enabled: boolean) => setOpenTime({...openTime, fri: {...openTime.fri, isClosed: enabled}})} />
                            <div className={`flex flex-wrap gap-x-8 ${openTime.fri.isClosed && 'text-gray-4'}`}>
                                <div className='flex gap-2'>
                                    <div>Open:</div>
                                    <input
                                        type='time'
                                        id='open-fri'
                                        name='open-fri'
                                        value={openTime.fri.open}
                                        disabled={openTime.fri.isClosed}
                                        onChange={(e) => setOpenTime({...openTime, fri: {...openTime.fri, open: e.target.value}})}
                                    />
                                </div>
                                <div className='flex gap-2'>
                                    <div>Close:</div>
                                    <input
                                        type='time'
                                        id='close-fri'
                                        name='close-fri'
                                        value={openTime.fri.close}
                                        disabled={openTime.fri.isClosed}
                                        onChange={(e) => setOpenTime({...openTime, fri: {...openTime.fri, close: e.target.value}})}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={`flex flex-wrap justify-between w-full`}>
                            <div className='font-medium w-[100px]'>{weekday[6]}</div>
                            <Toggle title='Closed' enabled={openTime.sat.isClosed} setEnabled={(enabled: boolean) => setOpenTime({...openTime, sat: {...openTime.sat, isClosed: enabled}})} />
                            <div className={`flex flex-wrap gap-x-8 ${openTime.sat.isClosed && 'text-gray-4'}`}>
                                <div className='flex gap-2'>
                                    <div>Open:</div>
                                    <input
                                        type='time'
                                        id='open-sat'
                                        name='open-sat'
                                        value={openTime.sat.open}
                                        disabled={openTime.sat.isClosed}
                                        onChange={(e) => setOpenTime({...openTime, sat: {...openTime.sat, open: e.target.value}})}
                                    />
                                </div>
                                <div className='flex gap-2'>
                                    <div>Close:</div>
                                    <input
                                        type='time'
                                        id='close-sat'
                                        name='close-sat'
                                        value={openTime.sat.close}
                                        disabled={openTime.sat.isClosed}
                                        onChange={(e) => setOpenTime({...openTime, sat: {...openTime.sat, close: e.target.value}})}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <div className='font-bold text-lg'>Address</div>
                        <textarea
                            id='address'
                            name='address'
                            value={address}
                            rows={2}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder={'Location of your store'}
                            className='p-3 border border-brandprimary rounded-lg'
                        />
                    </div>
                    <div className='flex flex-col gap-3'>
                        <div className='font-bold text-lg'>Location</div>
                        <textarea
                            id='address'
                            name='address'
                            value={address}
                            rows={2}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder={'Location of your store'}
                            className='p-3 border border-brandprimary rounded-lg'
                        />
                    </div>
                    <div className='w-[60vw] h-[450px] relative'>
                        {/* <MyMapSetting position={location||positionInit} setPosition={(position: LocationData) => setLocation(position)} /> */}
                        <MapContainer center={positionInit} zoom={18} scrollWheelZoom={true}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <LocationMarker />
                            <MapSearch />
                        </MapContainer>
                    </div>
                    <button onClick={() => handleUpload()} >Get URL</button>
                    <button onClick={(e) => handleSubmit(e)} className='flex justify-center items-center bg-primary text-white px-4 py-2 rounded-2xl text-base'>Save Change</button>
                </div>
            }
        </Layout>
    )
}

export default EditStore