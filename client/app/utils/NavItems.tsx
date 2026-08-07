import React from 'react';
import Link from 'next/link';

export const navItemData = [
    {
        name: 'Home',
        href: '/',
    },
    {
        name: 'Courses',
        href: '/courses',
    },
    {
        name: 'About',
        href: '/about',
    },
    {
        name: 'Policy',
        href: '/policy',
    },
    {
        name: 'FAQ',
        href: '/faq',
    },
];

type Props = {
    isMobile: boolean;
    activeItem: number;
};

const NavItems: React.FC<Props> = ({ isMobile, activeItem }) => {
    return (
        <div className={isMobile ? 'flex flex-col gap-4' : 'hidden items-center gap-8 md:flex'}>
            {navItemData.map((item, index) => (
                <Link
                    key={index}
                    href={item.href}
                    className={`font-poppins text-sm font-medium transition ${
                        activeItem === index
                            ? 'text-cyan-400'
                            : 'text-slate-700 hover:text-cyan-400 dark:text-slate-200 dark:hover:text-cyan-400'
                    }`}
                >
                    {item.name}
                </Link>
            ))}
        </div>
    );
};

export default NavItems;
