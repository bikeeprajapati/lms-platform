import React, { FC } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    component: any;
    setRoute?: (route: string) => void;
};

const CustomModal: FC<Props> = ({ open, setOpen, component: Component, setRoute }) => {
    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <Box className="absolute left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-xl dark:bg-slate-900">
                <Component setOpen={setOpen} setRoute={setRoute} />
            </Box>
        </Modal>
    );
};

export default CustomModal;
