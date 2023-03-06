import axios from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { useState } from 'react';
import AccountTypeBar from '../components/accountTypeBar'
import WebIcon from '../components/webIcon';

function Register() {
    const router = useRouter()

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');

    async function handleRegister(e: any) {
        e.preventDefault()
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/user/register`
            const response = await axios.post(url, {
                name,
                email,
                password,
            })
            console.log(response)
            if (!response.data.status) {
                if (response.data.errorCode === 'EMAIL_EXIST') {
                    setEmailErrorMessage('This email has already registered.')
                }else if (response.data.errorCode === 'INVALID_EMAIL') {
                    setEmailErrorMessage('Invalid email.')
                } else if (response.data.errorCode === 'PASSWORD_NOT_MEET_REQUIREMENT') {
                    setPasswordErrorMessage('Password need 8 or more characters with a mix of letters and numbers')
                }
                return;
            }
            router.push('/login')
        } catch (error) {
            // console.log(error)
            // throw new ServerError(error.response.status, error.response.data.message, error.response.data.errorCode);
            console.error(error)
            // console.error(
            //     error.response.data.message,
            //     error,
            // )
        }
    }

    return (
        <div className='bg-brandprimary px-4 py-20 h-full overflow-auto scrollbar'>
            <div className='text-base font-medium text-primary flex flex-col max-w-2xl mx-auto'>
                <AccountTypeBar type='customer' page='register' />
                <div className='p-10 bg-white flex flex-col gap-8 rounded-b-lg'>
                    <div className='text-3xl font-semibold flex items-center gap-4'>
                        <WebIcon width={54} height={54} style={'text-xs'} />
                        Create an account as customer
                    </div>
                    <div className='flex flex-col gap-4'>
                        <div>Name</div>
                        <input
                            type={'text'}
                            value={name}
                            onChange={(e) => { setName(e.target.value); }}
                            placeholder={'Your full name'}
                            className='p-3 border border-brandprimary'
                        />
                        <div>Email</div>
                        <input
                            type={'email'}
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setEmailErrorMessage(''); setPasswordErrorMessage(''); }}
                            placeholder={'Your email'}
                            className='p-3 border border-brandprimary'
                        />
                        {emailErrorMessage && emailErrorMessage !== '' &&
                            <div className='text-error'>{emailErrorMessage}</div>
                        }
                        <div>Password</div>
                        <input
                            type={'password'}
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setPasswordErrorMessage(''); }}
                            placeholder={'Password (at least 8 characters) with a mix of letters and numbers'}
                            className='p-3 border border-brandprimary'
                        />
                        {passwordErrorMessage && passwordErrorMessage !== '' &&
                            <div className='text-error'>{passwordErrorMessage}</div>
                        }
                    </div>
                    <button
                        onClick={(e) => handleRegister(e)}
                        className='w-full h-10 bg-primary text-white rounded-lg'
                    >
                        Register
                    </button>
                    <div className='text-center mt-4'>Already have an account? <Link href={`/login`} className='text-info font-bold'>Log in</Link></div>
                </div>
            </div>
        </div>
    )
}

export default Register