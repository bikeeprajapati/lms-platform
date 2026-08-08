'use client';

import React, { FC, useRef, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useActivationMutation } from '@/redux/features/auth/authApi';

type Props = {
    setRoute: (route: string) => void;
};

type VerifyNumber = {
    '0': string;
    '1': string;
    '2': string;
    '3': string;
    '4': string;
    '5': string;
};

const Verification: FC<Props> = ({ setRoute }) => {
    const { token } = useSelector((state: any) => state.auth);
    const [activation, { isSuccess, error }] = useActivationMutation();
    const [invalidError, setInvalidError] = useState(false);

    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
        0: '', 1: '', 2: '', 3: '', 4: '', 5: '',
    });

    useEffect(() => {
        if (isSuccess) {
            toast.success('Account activated successfully');
            setRoute('Login');
        }
        if (error && 'data' in error) {
            setInvalidError(true);
            toast.error((error as any).data?.message || 'Invalid activation code');
        }
    }, [isSuccess, error, setRoute]);

    const verificationHandler = async () => {
        const activationCode = Object.values(verifyNumber).join('');
        if (activationCode.length !== 6) {
            setInvalidError(true);
            return;
        }
        await activation({ activation_token: token, activation_code: activationCode });
    };

    const handleInputChange = (index: number, value: string) => {
        setInvalidError(false);
        const newVerifyNumber = { ...verifyNumber, [index]: value };
        setVerifyNumber(newVerifyNumber);

        if (value === '' && index > 0) {
            inputRefs[index - 1].current?.focus();
        } else if (value.length === 1 && index < 5) {
            inputRefs[index + 1].current?.focus();
        }
    };

    return (
        <div className="w-full rounded-2xl bg-slate-900 px-8 py-8">
            <h1 className="text-center font-josefin text-2xl font-bold text-white">
                Verify Your Account
            </h1>
            <p className="mt-2 text-center text-sm text-slate-400">
                Enter the 6-digit code sent to your email
            </p>

            <div className="mt-8 flex items-center justify-center gap-2 sm:gap-3">
                {Object.keys(verifyNumber).map((key, index) => (
                    <input
                        key={key}
                        ref={inputRefs[index]}
                        type="text"
                        maxLength={1}
                        value={verifyNumber[key as keyof VerifyNumber]}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        className={`h-12 w-12 rounded-lg border bg-slate-800/60 text-center text-lg font-semibold text-white outline-none sm:h-14 sm:w-14 ${
                            invalidError
                                ? 'border-red-500'
                                : 'border-slate-700 focus:border-cyan-500'
                        }`}
                    />
                ))}
            </div>

            {invalidError && (
                <p className="mt-3 text-center text-xs text-red-400">
                    Please enter a valid 6-digit activation code
                </p>
            )}

            <button
                onClick={verificationHandler}
                className="mt-8 w-full rounded-full bg-cyan-500 py-3.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
            >
                Verify
            </button>

            <p className="mt-6 text-center text-sm text-slate-300">
                Go back to sign in?{' '}
                <span
                    className="cursor-pointer font-medium text-cyan-400 underline"
                    onClick={() => setRoute('Login')}
                >
                    Sign In
                </span>
            </p>
        </div>
    );
};

export default Verification;