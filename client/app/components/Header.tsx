'use client';

import Link from 'next/link';
import React, { FC, useEffect, useState } from 'react';
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from 'react-icons/hi';
import NavItems from '../utils/NavItems';
import ThemeSwitcher from '../utils/ThemeSwitcher';

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    activeItem: number;
    isMobile?: boolean;
};

const Header: FC<Props> = ({ open, setOpen, activeItem, isMobile = false }) => {
    const [active, setActive] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setActive(window.scrollY > 85);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setOpenSidebar(false);
        }
    };

    return (
        <div className="relative w-full">
            <header
                className={`fixed left-0 top-0 z-[80] w-full border-b border-slate-200 bg-white/90 shadow-lg backdrop-blur transition-all duration-300 dark:border-slate-800 dark:bg-slate-900/90 ${
                    active ? 'h-[72px]' : 'h-[80px]'
                }`}
            >
                <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="font-josefin text-2xl font-semibold text-slate-900 dark:text-white">
                        ELearning
                    </Link>

                    <div className="flex items-center gap-3 sm:gap-6">
                        {/* NavItems handles its own responsive visibility via CSS */}
                        <NavItems isMobile={false} activeItem={activeItem} />

                        <ThemeSwitcher />

                        <button
                            type="button"
                            className="flex items-center justify-center rounded-full p-2 text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                            onClick={() => setOpen(true)}
                            aria-label="Open profile"
                        >
                            <HiOutlineUserCircle size={24} />
                        </button>

                        {/* Hamburger: visible on small screens only */}
                        <button
                            type="button"
                            onClick={() => setOpenSidebar(true)}
                            className="flex items-center justify-center rounded-full p-2 text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
                            aria-label="Open menu"
                        >
                            <HiOutlineMenuAlt3 size={24} />
                        </button>
                    </div>
                </div>
            </header>

            <div className="h-[80px]" />

            {openSidebar && (
                <div
                    className="fixed left-0 top-0 z-[99999] h-screen w-full bg-black/30"
                    onClick={handleClose}
                    id="screen"
                >
                    <div className="fixed right-0 top-0 z-[999999999] h-screen w-[75%] max-w-[320px] bg-white p-5 shadow-xl dark:bg-slate-900">
                        <div className="mb-6 flex items-center justify-between">
                            <span className="font-josefin text-xl font-semibold text-slate-900 dark:text-white">Menu</span>
                            <button
                                type="button"
                                onClick={() => setOpenSidebar(false)}
                                className="rounded-full p-2 text-slate-700 dark:text-slate-200"
                                aria-label="Close menu"
                            >
                                ✕
                            </button>
                        </div>

                        <NavItems isMobile={true} activeItem={activeItem} />

                        <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => setOpen(true)}
                                className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200"
                            >
                                <HiOutlineUserCircle size={20} />
                                Login / Profile
                            </button>
                        </div>

                        <div className="absolute bottom-5 left-5 right-5 text-sm text-slate-500 dark:text-slate-400">
                            Copyright © 2023 ELearning
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;