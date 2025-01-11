'use client'
import { useReducer, useState } from 'react'
import { useRouter } from 'next/navigation'

const initialState = {
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
}

function userReducer(state: any, action: any) {
    switch (action.type) {
        case 'SET_EMAIL':
            return { ...state, email: action.payload }
        case 'SET_PHONE':
            return { ...state, phone: action.payload }
        case 'SET_PASSWORD':
            return { ...state, password: action.payload }
        case 'SET_CONFIRM_PASSWORD':
            return { ...state, confirmPassword: action.payload }
        default:
            return state
    }
}

export default function SignupForm() {
    const [user, dispatch] = useReducer(userReducer, initialState)
    const [emailOtp, setEmailOtp] = useState('')
    const [phoneOtp, setPhoneOtp] = useState('')
    const [step, setStep] = useState('signup')
    const router = useRouter()

    const handleNormalSignup = async (e: any) => {
        e.preventDefault()
        if (user.password !== user.confirmPassword) {
            alert('Passwords do not match')
            return
        }
        try {
            const response = await fetch('http://127.0.0.1:8000/api/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email,
                    phone_number: user.phone,
                    password: user.password,
                    confirm_password: user.confirmPassword
                }),
            })

            if (response.ok) {
                setStep('verify')
            } else {
                const errorData = await response.json()
                alert(`Signup failed: ${JSON.stringify(errorData)}`)
            }
        } catch (error) {
            console.error('Signup error:', error)
            alert('Error during signup. Please try again.')
        }
    }

    const handleOtpVerification = async (e: any) => {
        e.preventDefault()
        try {
            const response = await fetch('http://127.0.0.1:8000/api/verify-otp/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email,
                    phone_number: user.phone,
                    email_otp: emailOtp,
                    phone_otp: phoneOtp
                }),
            })

            if (response.ok) {
                router.push('/dashboard')
            } else {
                const errorData = await response.json()
                alert(`OTP verification failed: ${JSON.stringify(errorData)}`)
            }
        } catch (error) {
            console.error('OTP verification error:', error)
            alert('Error during OTP verification. Please try again.')
        }
    }

    const handleGoogleAuth = async () => {
        try {
            // Initialize Google Sign-In
            const auth2 = await (window as any).gapi.auth2.getAuthInstance()
            const googleUser = await auth2.signIn()

            // Get user details
            const profile = googleUser.getBasicProfile()
            const userData = {
                googleId: profile.getId(),
                name: profile.getName(),
                email: profile.getEmail(),
                profilePicture: profile.getImageUrl(),
                locale: profile.getLocale()
            }

            // Send user data to your backend
            const response = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            })

            if (response.ok) {
                // Redirect to dashboard or handle successful authentication
                router.push('/dashboard')
            } else {
                throw new Error('Failed to authenticate with Google')
            }
        } catch (error) {
            console.error('Google authentication error:', error)
            alert('Failed to authenticate with Google. Please try again.')
        }
    }
    const handleFacebookAuth = () => {
        // Implement Facebook authentication
    }

    return (
        <div className="flex items-center justify-center bg-gray-50 py-2 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {step === 'signup' ? (
                    <form className="mt-8 space-y-6" onSubmit={handleNormalSignup}>
                        <input type="hidden" name="remember" defaultValue="true" />
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                    value={user.email}
                                    onChange={(e) => dispatch({ type: 'SET_EMAIL', payload: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                    value={user.password}
                                    onChange={(e) => dispatch({ type: 'SET_PASSWORD', payload: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="reenter-password" className="sr-only">
                                    Re-enter Password
                                </label>
                                <input
                                    id="reenter-password"
                                    name="reenter-password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Re-enter Password"
                                    value={user.confirmPassword}
                                    onChange={(e) => dispatch({ type: 'SET_CONFIRM_PASSWORD', payload: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="phone-number" className="sr-only">
                                    Phone Number
                                </label>
                                <input
                                    id="phone-number"
                                    name="phone-number"
                                    type="tel"
                                    autoComplete="tel"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Phone Number"
                                    value={user.phone}
                                    onChange={(e) => dispatch({ type: 'SET_PHONE', payload: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleOtpVerification}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-otp" className="sr-only">
                                    Email OTP
                                </label>
                                <input
                                    id="email-otp"
                                    name="email-otp"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Email OTP"
                                    value={emailOtp}
                                    onChange={(e) => setEmailOtp(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="phone-otp" className="sr-only">
                                    Phone OTP
                                </label>
                                <input
                                    id="phone-otp"
                                    name="phone-otp"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Phone OTP"
                                    value={phoneOtp}
                                    onChange={(e) => setPhoneOtp(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Verify OTP
                            </button>
                        </div>
                    </form>
                )}

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <div>
                            <button
                                onClick={handleGoogleAuth}
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                <span className="sr-only">Sign up with Google</span>
                                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" />
                                </svg>
                            </button>
                        </div>

                        <div>
                            <button
                                onClick={handleFacebookAuth}
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                <span className="sr-only">Sign up with Facebook</span>
                                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}