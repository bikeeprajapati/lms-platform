'use client';

import Image from 'next/image';
import React, { FC } from 'react';
import { BiSearch } from 'react-icons/bi';

type Props = {};

const Hero: FC<Props> = () => {
    return (
        <div className="relative overflow-hidden bg-slate-50 px-4 py-20 dark:bg-slate-950 sm:px-6 lg:px-8">
            <div className="absolute left-[-8%] top-[100px] h-[50vh] w-[50vh] rounded-full bg-cyan-400/20 blur-3xl 1100px:h-[600px] 1100px:w-[600px] 1500px:h-[700px] 1500px:w-[700px]" />

            <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 1000px:flex-row 1000px:items-center 1000px:justify-between">
                <div className="z-10 flex w-full flex-col items-center text-center 1000px:w-[45%] 1000px:items-start 1000px:text-left">
                    <h2 className="w-full px-3 py-2 font-josefin text-3xl font-semibold leading-tight text-slate-900 dark:text-white 1000px:text-5xl 1100px:text-6xl 1500px:text-7xl">
                        Improve Your Online Learning Experience Better Instantly
                    </h2>

                    <p className="mt-4 max-w-2xl font-poppins text-base font-medium text-slate-700 dark:text-slate-300 1100px:text-lg">
                        We have 40k+ online courses and 500k+ registered students. Find your desired courses from them.
                    </p>

                    <div className="mt-8 flex w-full max-w-xl items-center rounded-lg border border-slate-300 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <input
                            type="search"
                            placeholder="Search Courses..."
                            className="h-12 w-full border-0 bg-transparent px-4 text-sm outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400"
                        />
                        <button
                            type="button"
                            className="flex h-12 w-12 items-center justify-center rounded-r-lg bg-cyan-500 text-white transition hover:bg-cyan-600"
                            aria-label="Search courses"
                        >
                            <BiSearch size={24} />
                        </button>
                    </div>
                </div>

                <div className="z-10 flex w-full items-center justify-center 1000px:w-[45%]">
                    <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                        <Image
                            src="../../../public/assets/Webinar-rafiki.png"
                            alt="Learning illustration"
                            width={600}
                            height={600}
                            className="h-auto w-full rounded-2xl object-contain"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
