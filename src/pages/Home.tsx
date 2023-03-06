import React from 'react'
import Layout from '../components/layout/layout'
import Image from 'next/legacy/image'
import Link from 'next/link'

function Home() {
    return (
        <Layout>
            <div className='flex justify-center px-10 py-20 text-primary'>
                <div className='flex gap-[2vw] items-center w-fit max-w-5xl'>
                    <div className='basis-1/2'>
                        <div className='text-4xl desktop:text-5xl font-bold'>STOP FOOD WASTE TOGETHER</div>
                        <div className='mt-4 text-lg desktop:text-xl font-semibold'>Food waste is a big problem, and we can be a solution.</div>
                        <div className='mt-2 text-lg desktop:text-xl font-medium'>No food waste is the web application that lets you rescue unsold food at your favorite spots from an untimely fate.</div>
                        <Link href={`/reduction`} passHref>
                            <div className="bg-primary hover:bg-info text-sm desktop:text-base text-white font-semibold mt-6 px-6 py-4 w-fit rounded-3xl flex justify-center items-center">
                                Explore!
                            </div>
                        </Link>
                    </div>
                    <div className='w-[40vw] h-[24vw] max-w-[600px] max-h-[360px] min-w-[400px] min-h-[240px] overflow-hidden relative'>
                        <Image src={'/images/zero-waste.svg'} alt='zero-waste' layout="fill" objectFit="cover" />
                    </div>
                </div>
            </div>
            <div className='flex justify-center px-10 py-20 text-white bg-primary'>
                <div className='flex flex-col gap-6 items-center w-fit max-w-5xl'>
                    <div className='text-2xl desktop:text-3xl font-bold'>MORE THAN 1/3 OF ALL FOOD IS BEING WASTED</div>
                    <div className='text-lg desktop:text-xl text-center font-medium'>Use the web application to explore stores and restaurants in your local area and save food from going to waste at a great price.</div>
                    <div className='flex justify-between gap-[2vw]'>
                        <div className='w-[20vw] h-[20vw] max-w-[300px] max-h-[300px] min-w-[200px] min-h-[200px] overflow-hidden relative'>
                            <Image src={'/images/home-2-1.svg'} alt='home' layout="fill" objectFit="cover" />
                        </div>
                        <div className='w-[20vw] h-[20vw] max-w-[300px] max-h-[300px] min-w-[200px] min-h-[200px] overflow-hidden relative'>
                            <Image src={'/images/home-2-2.svg'} alt='home' layout="fill" objectFit="cover" />
                        </div>
                        <div className='w-[20vw] h-[20vw] max-w-[300px] max-h-[300px] min-w-[200px] min-h-[200px] overflow-hidden relative'>
                            <Image src={'/images/home-2-3.svg'} alt='home' layout="fill" objectFit="cover" />
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex justify-center px-10 py-20 text-primary'>
                <div className='flex gap-[2vw] items-center w-fit max-w-5xl'>
                    <div className='w-[40vw] h-[24vw] max-w-[600px] max-h-[360px] min-w-[400px] min-h-[240px] overflow-hidden relative'>
                        <Image src={'/images/home-customer.svg'} alt='home-customer' layout="fill" objectFit="cover" />
                    </div>
                    <div className='basis-1/2'>
                        <div className='text-3xl desktop:text-4xl font-bold'>Explore stores and restaurants in your local area and save food!</div>
                        <div className='mt-6 text-lg desktop:text-xl font-medium'>☻ RESCUE GOOD FOOD FROM LOCAL FAVORITES.</div>
                        <div className='mt-2 text-lg desktop:text-xl font-medium'>☻ HELP THE PLANET BY PREVENTING WASTE.</div>
                        <Link href={`/store`} passHref>
                            <div className="bg-primary hover:bg-info text-sm desktop:text-base text-white font-semibold mt-6 px-6 py-4 w-fit rounded-3xl flex justify-center items-center">
                                Explore!
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <div className='flex justify-center px-10'>
            <div className='bg-primary w-full max-w-5xl h-1 rounded'></div>
            </div>
            <div className='flex justify-center px-10 py-20 text-primary'>
                <div className='flex gap-[2vw] items-center w-fit max-w-5xl'>
                    <div className='basis-1/2'>
                        <div className='text-3xl desktop:text-4xl font-bold'>Reduce food waste for your store!</div>
                        <div className='mt-6 text-lg desktop:text-xl font-medium'>☻ TURN YOUR SURPLUS FOOD INTO EXTRA INCOME WITH MINIMAL EFFORT.</div>
                        <div className='mt-2 text-lg desktop:text-xl font-medium'>☻ INCREASE VISIBILITY AND ATTRACT NEW CUSTOMERS BOTH ON AND OFF THE APP.</div>
                        <div className='mt-2 text-lg desktop:text-xl font-medium'>☻ REDUCE YOUR WASTE AND HELP THE ENVIRONMENT.</div>
                        <Link href={`/store/register`} passHref>
                            <div className="bg-primary hover:bg-info text-sm desktop:text-base text-white font-semibold mt-6 px-6 py-4 w-fit rounded-3xl flex justify-center items-center">
                                Register your store
                            </div>
                        </Link>
                    </div>
                    <div className='w-[40vw] h-[24vw] max-w-[600px] max-h-[360px] min-w-[400px] min-h-[240px] overflow-hidden relative'>
                        <Image src={'/images/home-store.svg'} alt='home-store' layout="fill" objectFit="cover" />
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Home