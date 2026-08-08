'use client';
import React, { FC, useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Heading from './utils/Heading';

interface PageProps {}

const Page: FC<PageProps> = () => {
  const [open, setOpen] = useState(false);
  const [activeItem] = useState(0);
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
    <div className="min-h-screen bg-background text-foreground">
      <Heading
        title="ELearning"
        description="The best elearning platform"
        keywords="react, nextjs, programming, MERN"
      />
      <Header open={open} setOpen={setOpen} activeItem={activeItem} isMobile={isMobile} />
      <Hero />
    </div>
  );
};

export default Page;