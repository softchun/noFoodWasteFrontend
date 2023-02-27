import { AppProps } from 'next/app'
import '../styles/globals.css'
import '../styles/map.css'
import Head from 'next/head'

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>NoFoodWaste</title>
            </Head>
            <Component {...pageProps} />
        </>
    )
}