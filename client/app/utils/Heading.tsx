'use client';

import React, { FC, useEffect } from 'react';

type Props = {
    title: string;
    description: string;
    keywords?: string;
};

const Heading: FC<Props> = ({ title, description, keywords }) => {
    useEffect(() => {
        document.title = title;

        const setMeta = (name: string, content: string) => {
            let tag = document.querySelector(`meta[name="${name}"]`);
            if (tag) {
                tag.setAttribute('content', content);
            } else {
                tag = document.createElement('meta');
                tag.setAttribute('name', name);
                tag.setAttribute('content', content);
                document.head.appendChild(tag);
            }
        };

        setMeta('description', description);
        if (keywords) {
            setMeta('keywords', keywords);
        }
    }, [title, description, keywords]);

    return null;
};

export default Heading;
