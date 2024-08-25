import { useState } from "react";

function ThemeSwitch() {
    const getStoredTheme = () => localStorage.getItem('theme') ?? 'auto';
    const setStoredTheme = (theme: string) => localStorage.setItem('theme', theme);

    const [theme, setTheme] = useState(getStoredTheme());

    const applyTheme = (selectedTheme: string) => {
        if (selectedTheme === 'auto') {
            let prefersColorScheme = (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            document.documentElement.setAttribute('data-bs-theme', prefersColorScheme);
            document.documentElement.setAttribute('data-theme', prefersColorScheme);
        } else {
            document.documentElement.setAttribute('data-bs-theme', selectedTheme);
            document.documentElement.setAttribute('data-theme', selectedTheme);
        }
    }

    applyTheme(theme);

    const handleSwitchTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
        let selectedTheme = event.target.value ?? 'auto';
        setStoredTheme(selectedTheme);
        applyTheme(selectedTheme);
        setTheme(selectedTheme);
    };

    return <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
        <input type="radio" className="btn-check" name="btn-theme-selection" id="btn-theme-auto" autoComplete="off" value="auto" checked={theme === 'auto'} onChange={handleSwitchTheme} />
        <label className={theme === 'auto' ? "btn btn-primary" : "btn btn-outline-primary"} htmlFor="btn-theme-auto">🌗 Auto</label>

        <input type="radio" className="btn-check" name="btn-theme-selection" id="btn-theme-dark" autoComplete="off" value="dark" checked={theme === 'dark'} onChange={handleSwitchTheme} />
        <label className={theme === 'dark' ? "btn btn-primary" : "btn btn-outline-primary"} htmlFor="btn-theme-dark">🌙 Dark</label>

        <input type="radio" className="btn-check" name="btn-theme-selection" id="btn-theme-light" autoComplete="off" value="light" checked={theme === 'light'} onChange={handleSwitchTheme} />
        <label className={theme === 'light' ? "btn btn-primary" : "btn btn-outline-primary"} htmlFor="btn-theme-light">☀️ Light</label>
    </div>
}

export default ThemeSwitch
