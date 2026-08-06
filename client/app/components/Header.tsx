'use client';

import React, { FC, useEffect, useState } from 'react';
import NavItems from '../utils/NavItems';

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    activeItem: number;
    isMobile?: boolean;
};

const Header: FC<Props> = ({ open, setOpen, activeItem, isMobile = false }) => {
    const [active] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowMobileMenu(window.scrollY > 0);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative w-full">
            <div className="fixed left-0 top-0 z-[80] h-[80px] w-full bg-slate-900 shadow-lg">
                <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="font-josefin text-2xl font-semibold text-white">ELearning</div>

                    <div className="flex items-center gap-6">
                        {!isMobile && <NavItems isMobile={false} activeItem={activeItem} />}

                        {isMobile && (
                            <button
                                type="button"
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="rounded-full border border-white px-3 py-2 text-sm text-white transition hover:bg-white hover:text-slate-900"
                            >
                                Menu
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="h-[80px]" />

            {isMobile && showMobileMenu && (
                <div className="border-b border-slate-800 bg-slate-900 px-4 py-4">
                    <NavItems isMobile={true} activeItem={activeItem} />
                </div>
            )}
        </div>
    );
};

export default Header;