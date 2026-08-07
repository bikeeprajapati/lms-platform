'use client';
import React, { FC, useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';

interface PageProps {}

const Page: FC<PageProps> = () => {
  const [open, setOpen] = useState(false);
  const [activeItem] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    document.title = 'Elearning';

    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      descriptionTag.setAttribute('content', 'The best elearning platform');
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      meta.setAttribute('content', 'The best elearning platform');
      document.head.appendChild(meta);
    }

    const keywordsTag = document.querySelector('meta[name="keywords"]');
    if (keywordsTag) {
      keywordsTag.setAttribute('content', 'react, nextjs, programming, MERN');
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'keywords');
      meta.setAttribute('content', 'react, nextjs, programming, MERN');
      document.head.appendChild(meta);
    }

    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header open={open} setOpen={setOpen} activeItem={activeItem} isMobile={isMobile} />
      <Hero />
    </div>
  );
};

export default Page;
