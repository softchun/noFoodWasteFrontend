import React from 'react'
import Layout from '../components/layout/layout'
import Image from 'next/image'
import { handleAuthSSR } from '../utils/auth'

function Home() {
    return (
        <Layout>
            <div className='flex gap-6 justify-between items-center p-20'>
                <div className='text-primary'>
                    <div className='text-[48px] font-bold'>STOP<br />FOOD WASTE</div>
                    <div className='mt-4 text-2xl font-medium'>For the people.<br />For the planet.</div>
                    {/* <div className='mt-4 text-lg font-medium'>Love your food<br/>waste less. save more.</div> */}
                </div>
                <div className='flex justify-end h-[320px]'>
                    <div className='w-[40vw] h-full relative'>
                        <Image src={'/images/zero-waste.svg'} alt='zero-waste' fill />
                    </div>
                </div>
            </div>
            <div className='flex gap-6 justify-between items-center p-20'>
                <div className='h-[320px]'>
                    <div className='w-[40vw] h-full relative'>
                        <Image src={'/images/food-box.svg'} alt='zero-waste' fill />
                    </div>
                </div>
                <div className='text-right text-primary'>
                    <div className='text-[42px] font-bold'>Reduce food waste<br />for your business</div>
                    <div className='mt-4 text-2xl font-medium'>For the people.<br />For the planet.</div>
                </div>
            </div>
            {/* <div className='text-[50px] font-bold text-primary p-20 text-right'>
                <div className='mt-10'>Reduce food waste<br />for your business</div>
                <div className='mt-4 text-2xl font-medium'>For the people.<br />For the planet.</div>
                <div className='mt-4 text-lg font-medium'>Love your food<br />waste less. save more.</div>
            </div> */}
        </Layout>
    )
}

// Home.getInitialProps = async (ctx) => {
//     // await handleAuthSSR(ctx)
//     return {}
// }

export default Home