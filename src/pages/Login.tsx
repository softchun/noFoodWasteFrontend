import AccountTypeBar from '../components/accountTypeBar'
import axios from 'axios'
import { login } from '../utils/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import WebIcon from '../components/webIcon'

function Login() {
    const router = useRouter()

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');
    const [disableSubmit, setDisableSubmit] = useState<boolean>(true);

    const handleSubmit = async(e: any) => {
        e.preventDefault()
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/user/login`
            const response = await axios.post(url, {
                email,
                password,
            })
            if (response.data.status && response.data.data.token) {
                const token = response.data.data.token
                await login({ token })
                router.push('/home')
            }
        } catch (error) {
            console.error(error)

            const errorData = error.response.data
            if (errorData.errorCode === 'USER_NOT_FOUND') {
                setEmailErrorMessage("This email address is not registered as customer.")
            } else if (errorData.errorCode === 'WRONG_PASSWORD') {
                setPasswordErrorMessage('Password is incorrect.')
            }
        }
    }

    function handleChangeEmail(e: any) {
        setEmail(e.target.value);
        setEmailErrorMessage('');
        setPasswordErrorMessage('');
    }
    
    function handleChangePassword(e: any) {
        setPassword(e.target.value);
        setPasswordErrorMessage('');
    }

    useEffect(() => {
        if (!email || !password) {
            setDisableSubmit(true)
        } else if (email.length === 0 || password.length === 0) {
            setDisableSubmit(true)
        } else if (emailErrorMessage.length > 0 || passwordErrorMessage.length > 0) {
            setDisableSubmit(true)
        } else {
            setDisableSubmit(false)
        }
    }, [email, password, emailErrorMessage, passwordErrorMessage])

    return (
        <div className='bg-brandprimary px-4 py-20 h-[100vh]'>
            <div className='text-base font-medium text-primary flex flex-col max-w-2xl mx-auto'>
                <AccountTypeBar type='customer' page='login' />
                <div className='p-10 bg-white flex flex-col gap-8 rounded-b-lg'>
                    <div className='text-3xl font-semibold flex items-center gap-4'>
                        <WebIcon width={54} height={54} style={'text-xs'} />
                        Log in as Customer
                    </div>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                        <label htmlFor='email'>Email</label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            value={email}
                            onChange={(e) => handleChangeEmail(e)}
                            placeholder={'Your email'}
                            className='p-3 border border-brandprimary'
                        />
                        {emailErrorMessage && emailErrorMessage !== '' &&
                            <div className='text-error'>{emailErrorMessage}</div>
                        }
                        <label htmlFor='password'>Password</label>
                        <input
                            type='password'
                            id='password'
                            name='password'
                            value={password}
                            onChange={(e) => handleChangePassword(e)}
                            placeholder={'Password (at least 8 characters)'}
                            className='p-3 border border-brandprimary'
                        />
                        {passwordErrorMessage && passwordErrorMessage !== '' &&
                            <div className='text-error'>{passwordErrorMessage}</div>
                        }
                        <button
                            type='submit'
                            disabled={disableSubmit}
                            className='w-full h-10 mt-4 bg-primary disabled:bg-disabledgray text-white rounded-lg'
                        >
                            Login
                        </button>
                    </form>
                    <div className='text-center mt-4'>Don't have an account? <Link href={'/register'} className='text-info font-bold'>Register</Link></div>
                </div>
            </div>
        </div>
    )
}

export default Login