import axios from 'axios'
import Router from 'next/router'
import { Cookies } from 'react-cookie'
import nextCookie from 'next-cookies'

// set up cookies
// const cookies = new Cookies()

function storeTokenInLocalStorage(token: string) {
    const now = new Date()
    const maxAge = 1000 * 60 * 60 * 24 * 7     // 7 days
    const item = {
        value: token,
        expiry: now.getTime() + maxAge,
    }
    localStorage.setItem('token', JSON.stringify(item));
}

export function getTokenFromLocalStorage() {
    if (typeof window !== 'undefined') {
        // let token = localStorage.getItem('token')
        // return token;

        const itemStr = localStorage.getItem('token')
        // if the item doesn't exist, return null
        if (!itemStr) {
            return null
        }
        const item = JSON.parse(itemStr)
        const now = new Date()
        // compare the expiry time of the item with the current time
        if (now.getTime() > item.expiry) {
            // If the item is expired, delete the item from storage
            // and return null
            localStorage.removeItem('token')
            return null
        }
        return item.value
    }
    return null
}

function removeTokenFromLocalStorage() {
    return localStorage.removeItem('token');
}

export const handleAuthSSR = async (role='store') => {
    // const { token } = nextCookie(ctx)
    const token = getTokenFromLocalStorage();
    // console.log(token)
    const redirectOnError = () => {
        /* eslint-disable no-console */
        console.log('Redirecting back to main page')
        if (typeof window !== 'undefined') {
            if (role === 'store') {
                Router.push('/store/login')
            } else {
                Router.push('/login')
            }
        }

        // if (typeof window !== 'undefined') {
        //     Router.push('/')
        // } else {
        //     ctx.res.writeHead(302, { Location: '/' })
        //     ctx.res.end()
        // }
    }

    try {
        if (!token) {
            return redirectOnError()
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL}/user/check-verified`
        const response = await axios.get(url, {
            headers: { authorization: token },
        })
        // console.log('user', response.data)
        if (!response.status) {
            return redirectOnError()
        }
        if (role !== response.data.user.role) {
            return redirectOnError()
        }
    } catch (error) {
        /* eslint-disable no-console */
        console.log('Error: ', error)
        // Implementation or Network error
        return redirectOnError()
    }
    return {}
}

export const login = async ({ token }) => {
    // Cookie will expire after 24h
    // cookies.set('token', token, { maxAge: 60 * 60 * 24 })

    storeTokenInLocalStorage(token)
}

export const logout = () => {
    // cookies.remove('token')

    removeTokenFromLocalStorage()
}

export const getUser = async () => {
    const token = getTokenFromLocalStorage();
    // console.log(token)
    if (!token) {
        return null
    }
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/user/check-verified`
        const response = await axios.get(url, {
            headers: { authorization: token },
        })
        if (!response.status) {
            return null
        }
        if (response.data.user.role === 'customer') {
            const urlUser = `${process.env.NEXT_PUBLIC_API_URL}/user`
            const responseUser = await axios.get(urlUser, {
                headers: { authorization: token },
            })
            return responseUser.data.user
        } else if (response.data.user.role === 'store') {
            const urlUser = `${process.env.NEXT_PUBLIC_API_URL}/store`
            const responseUser = await axios.get(urlUser, {
                headers: { authorization: token },
            })
            return responseUser.data.user
        } else {
            return null
        }
    } catch (error) {
        return null
    }
}