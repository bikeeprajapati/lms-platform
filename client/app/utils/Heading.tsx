import React ,{FC} from 'react';

interface HeadingProps {
    title: string;
    description: string;
    keywords: string;
}

const Heading: FC<HeadingProps> = ({ title, description, keywords }) => {
    return (
        <head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
        </head>
    );
};

export default Heading;
