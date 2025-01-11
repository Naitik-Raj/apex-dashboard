import AcmeLogo from '@/app/ui/acme-logo';
import Link from 'next/link';
// import SignupForm from '../ui/signup-form';

export default function signupPage() {
    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
                    <div className="w-32 text-white md:w-36">
                        <AcmeLogo />
                    </div>
                </div>
                {/* <SignupForm /> */}
                <Link href={'/login'} className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-500">
                    Already have an account?{' login'}
                </Link>
            </div>
        </main>
    );
}