'use client';
import React, { FC, useEffect, useState } from 'react';
import Heading from './utils/Heading';
import Header from './components/Header';

interface PageProps {}

const Page: FC<PageProps> = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  return (
    <div className="bg-white">
      <Heading title="Elearning" description="The best elearning platform" keywords="react, nextjs,Programming,MERN" />
      <Header open={open} setOpen={setOpen} activeItem={activeItem} isMobile={isMobile} />
    </div>
  );
};

export default Page;
