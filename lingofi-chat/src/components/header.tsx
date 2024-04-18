import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import Davatar from '@davatar/react'

export function Header() {
    const token = localStorage.getItem('token');
    const address = localStorage.getItem('address');
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("publicKey");
        window.location.assign("/auth/sign-in");
    };
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
            <div className="flex items-center">
                <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
                    {/* <p className='text-black'>{address}</p> */}
                    {address && (
                        <Davatar address={address} size={28} />
                    )}
                </React.Suspense>
            </div>
            <div className="flex items-center justify-end space-x-2">
                {token ? (
                    <Button onClick={handleLogout}>
                        Logout
                    </Button>
                ) : (
                    <Link href="/auth/sign-in">
                        <Button variant="default">Login</Button>
                    </Link>
                )}
            </div>
        </header>
    )
}
