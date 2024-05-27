import { useReducer } from "react";

function ThemeSwitch() {
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const getStoredTheme = () => localStorage.getItem('theme') ?? 'auto';
    const setStoredTheme = (theme: string) => localStorage.setItem('theme', theme);

    const setTheme = (theme: string) => {
        if (theme === 'auto') {
            let prefersColorScheme = (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            document.documentElement.setAttribute('data-bs-theme', prefersColorScheme);
            document.documentElement.setAttribute('data-theme', prefersColorScheme);
        } else {
            document.documentElement.setAttribute('data-bs-theme', theme);
            document.documentElement.setAttribute('data-theme', theme);
        }
    }

    const currentTheme = getStoredTheme();
    setTheme(currentTheme);

    const handleSwitchTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
        let theme = event.target.value ?? 'auto';
        setStoredTheme(theme);
        setTheme(theme);
        forceUpdate();
    };

    return <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
        <input type="radio" className="btn-check" name="btn-theme-selection" id="btn-theme-auto" autoComplete="off" value="auto" checked={currentTheme === 'auto'} onChange={handleSwitchTheme} />
        <label className="btn btn-outline-primary" htmlFor="btn-theme-auto">🌗 Auto</label>

        <input type="radio" className="btn-check" name="btn-theme-selection" id="btn-theme-dark" autoComplete="off" value="dark" checked={currentTheme === 'dark'} onChange={handleSwitchTheme} />
        <label className="btn btn-outline-primary" htmlFor="btn-theme-dark">🌙 Dark</label>

        <input type="radio" className="btn-check" name="btn-theme-selection" id="btn-theme-light" autoComplete="off" value="light" checked={currentTheme === 'light'} onChange={handleSwitchTheme} />
        <label className="btn btn-outline-primary" htmlFor="btn-theme-light">☀️ Light</label>
    </div>
}

export default ThemeSwitch
