'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeSwitcher() {
    const { theme, resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [dbg, setDbg] = useState('');
    const [locked, setLocked] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = theme === 'dark' || resolvedTheme === 'dark';

    const toggle = () => {
        if (locked) return;
        setLocked(true);
        setTimeout(() => setLocked(false), 350);

        console.log('ThemeSwitcher: click ->', { theme, resolvedTheme, isDark });

        if (typeof setTheme === 'function') {
            const target = isDark ? 'light' : 'dark';
            console.log('ThemeSwitcher: calling setTheme(', target, ')');
            setTheme(target);

            // update debug state after a tick
            setTimeout(() => {
                try {
                    const el = document.documentElement;
                    const has = el.classList.contains('dark');
                    console.log('ThemeSwitcher: post-setTheme html.dark=', has);
                    setDbg(has ? 'dark' : 'light');
                } catch (e) {
                    console.log('ThemeSwitcher: post-setTheme (no document)');
                }
            }, 100);
            return;
        }

        // Fallback: toggle class on html if next-themes not available
        try {
            const el = document.documentElement;
            if (el.classList.contains('dark')) {
                el.classList.remove('dark');
                setDbg('light');
            } else {
                el.classList.add('dark');
                setDbg('dark');
            }
        } catch (e) {
            // ignore
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={toggle}
                aria-label="Toggle color theme"
                title={mounted ? (isDark ? 'Switch to light' : 'Switch to dark') : 'Toggle theme'}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:scale-105 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
                {mounted ? (isDark ? '☀️' : '🌙') : '🌙'}
            </button>

            <span
                className="hidden select-none rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200 md:inline-block"
                aria-live="polite"
            >
                {dbg || (mounted ? (isDark ? 'dark' : 'light') : '')}
            </span>
        </div>
    );
}
