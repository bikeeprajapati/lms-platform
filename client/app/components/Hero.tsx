"use client";

import Image from "next/image";
import Link from 'next/link';
import React, { FC } from "react";
import { BiSearch } from "react-icons/bi";

type Props = {};

const Hero: FC<Props> = () => {
    return (
        <section className="relative overflow-hidden bg-slate-50 dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-900/95 dark:to-black px-4 py-20">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-8 1000px:grid-cols-2 items-center">
                    {/* Left: Illustration */}
                    <div className="flex justify-center 1000px:justify-start">
                        <div className="relative w-[420px] h-[420px] 1100px:w-[560px] 1100px:h-[560px] rounded-full flex items-center justify-center">
                            <div className="absolute -inset-12 rounded-full bg-gradient-to-br from-cyan-100 via-white to-white dark:from-[#1f2937] dark:via-[#0b1220] dark:to-[#0b1220] opacity-90 blur-3xl" />
                            <div className="relative z-10 w-full">
                                <Image
                                    src="/assets/banner.png"
                                    alt="Learning illustration"
                                    width={700}
                                    height={700}
                                    className="w-full h-auto object-contain rounded-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="flex flex-col items-start text-left pt-8 1000px:pt-0">
                        <h1 className="font-josefin font-bold text-slate-900 dark:text-white text-4xl 1000px:text-6xl 1100px:text-[72px] leading-tight">
                            Improve Your Online Learning Experience
                            <br /> Better Instantly
                        </h1>

                        <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
                            We have 40k+ Online courses & 500K+ Online registered student. Find your desired Courses from them.
                        </p>

                        <div className="mt-8 w-full max-w-2xl">
                            <div className="relative">
                                <input
                                    type="search"
                                    placeholder="Search Courses..."
                                    className="w-full rounded-md bg-white dark:bg-slate-700/60 placeholder:text-slate-400 dark:placeholder:text-slate-300 py-3 px-4 pr-14 text-slate-900 dark:text-slate-100 outline-none border border-slate-200 dark:border-transparent"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-md bg-cyan-400 flex items-center justify-center">
                                    <BiSearch size={18} className="text-white" />
                                </button>
                            </div>

                            <div className="mt-6 flex items-center gap-3">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full ring-2 ring-white dark:ring-slate-900 overflow-hidden">
                                        <Image src="/assets/client1.jpg" alt="client1" width={40} height={40} className="object-cover" />
                                    </div>
                                    <div className="h-10 w-10 rounded-full ring-2 ring-white dark:ring-slate-900 overflow-hidden -ml-5">
                                        <Image src="/assets/client2.jpg" alt="client2" width={40} height={40} className="object-cover" />
                                    </div>
                                    <div className="h-10 w-10 rounded-full ring-2 ring-white dark:ring-slate-900 overflow-hidden -ml-5">
                                        <Image src="/assets/client3.jpg" alt="client3" width={40} height={40} className="object-cover" />
                                    </div>
                                </div>

                                <p className="font-josefin dark:text-[#edfff4] text-[#374151] 1000px:pl-3 text-[16px] font-[600]">
                                    <span className="font-semibold text-slate-900 dark:text-white">500K+</span> People already trusted us.
                                    <Link href="/courses" className="ml-2 text-cyan-500 dark:text-cyan-400">View Courses</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;