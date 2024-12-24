"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from 'next-auth/react';

const Navbar = () => {
    const pathname = usePathname();
    const showNavbar = ['/', '/generate', '/myhandle', '/myhandle/edit'].includes(pathname); // To Only Show Navbar In Home And Generate Route

    const { data: session, status } = useSession();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        showNavbar && (
            <nav className="w-11/12 h-5 p-8 md:p-10 md:h-20 absolute top-10 left-1/2 transform -translate-x-1/2 bg-white text-black flex items-center justify-between gap-5 rounded-full">
                <Link href={'/'} className='font-bold text-xl md:text-2xl tracking-widest'>OneLink</Link>

                <ul className='hidden lg:flex gap-10 text-lg font-medium text-gray-500 font-mono'>
                    <Link href={'/myhandle'}>My LinkTree</Link>
                    <li>Marketplace</li>
                    <li>Discover</li>
                    <li>Pricing</li>
                    <li>Learn</li>
                </ul>

                <div className='flex gap-2 font-mono'>
                    {session ? (
                        <div className='relative flex items-center gap-3'>
                            {session?.user?.image && (
                                <div className='relative h-12 w-12'>
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || 'User'}
                                        layout='fill'
                                        className='rounded-full cursor-pointer'
                                        onClick={handleDropdownToggle}
                                    />
                                </div>
                            )}
                            <button onClick={() => signOut()} className='max-sm:hidden bg-black text-white max-sm:py-2 max-sm:px-5 py-3 px-10 rounded-xl'>Logout</button>
                            {/* Dropdown for smaller devices */}
                            {isDropdownOpen && (
                                <div className="sm:hidden absolute right-0 top-10 mt-2 bg-white shadow-lg rounded-lg w-40 z-10">
                                    <button onClick={() => signOut()} className="w-full text-left py-2 px-4 text-black hover:bg-gray-100 rounded-t-lg">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button onClick={() => signIn()} className='bg-black text-white max-sm:py-2 max-sm:px-5 py-3 px-10 rounded-xl'>Login</button>
                    )}
                </div>
            </nav>
        )
    );
};

export default Navbar;