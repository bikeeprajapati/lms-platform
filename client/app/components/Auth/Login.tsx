'use client';

import React, { FC, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { AiFillGithub } from 'react-icons/ai';
import { useLoginMutation } from '@/redux/features/auth/authApi';

type Props = {
    setRoute: (route: string) => void;
    setOpen: (open: boolean) => void;
};

const schema = Yup.object().shape({
    email: Yup.string().email('Enter a valid email').required('Please enter your email'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Please enter your password'),
});

const Login: FC<Props> = ({ setRoute, setOpen }) => {
    const [show, setShow] = useState(false);
    const [login, { isLoading }] = useLoginMutation();

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: schema,
        onSubmit: async ({ email, password }) => {
            try {
                await login({ email, password }).unwrap();
                toast.success('Login successful');
                setOpen(false);
            } catch (err: any) {
                toast.error(err?.data?.message || 'Invalid email or password');
            }
        },
    });

    const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
        <div className="w-full rounded-2xl bg-slate-900 px-8 py-8">
            <h1 className="text-center font-josefin text-2xl font-bold text-white">
                Login with ELearning
            </h1>

            <form onSubmit={handleSubmit} className="mt-8">
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                    Enter your Email
                </label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="loginmail@gmail.com"
                    className="mt-2 w-full rounded-full border border-slate-700 bg-slate-800/60 px-5 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
                />
                {errors.email && touched.email && (
                    <p className="mt-1 pl-2 text-xs text-red-400">{errors.email}</p>
                )}

                <label htmlFor="password" className="mt-5 block text-sm font-medium text-slate-300">
                    Enter your password
                </label>
                <div className="relative mt-2">
                    <input
                        id="password"
                        type={show ? 'text' : 'password'}
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        placeholder="password!@%"
                        className="w-full rounded-full border border-slate-700 bg-slate-800/60 px-5 py-3 pr-12 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
                    />
                    {show ? (
                        <AiOutlineEye
                            className="absolute right-4 top-3.5 cursor-pointer text-slate-400"
                            size={20}
                            onClick={() => setShow(false)}
                        />
                    ) : (
                        <AiOutlineEyeInvisible
                            className="absolute right-4 top-3.5 cursor-pointer text-slate-400"
                            size={20}
                            onClick={() => setShow(true)}
                        />
                    )}
                </div>
                {errors.password && touched.password && (
                    <p className="mt-1 pl-2 text-xs text-red-400">{errors.password}</p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-7 w-full rounded-full bg-cyan-500 py-3.5 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:opacity-60"
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>

                <div className="mt-7 flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-700" />
                    <span className="text-sm text-slate-400">Or join with</span>
                    <div className="h-px flex-1 bg-slate-700" />
                </div>

                <div className="mt-5 flex items-center justify-center gap-6">
                    <button
                        type="button"
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 transition hover:bg-slate-700"
                        aria-label="Continue with Google"
                    >
                        <FcGoogle size={22} />
                    </button>
                    <button
                        type="button"
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-white transition hover:bg-slate-700"
                        aria-label="Continue with GitHub"
                    >
                        <AiFillGithub size={22} />
                    </button>
                </div>

                <p className="mt-7 text-center text-sm text-slate-300">
                    Not have any account?{' '}
                    <span
                        className="cursor-pointer font-medium text-cyan-400 underline"
                        onClick={() => setRoute('Sign-Up')}
                    >
                        Sign up
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Login;