import { useState } from 'react';

function ThemeSwitch() {

    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('theme') ?? 'auto');

    document.documentElement.setAttribute('data-theme', currentTheme);

    const handleSwitchTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
        let theme = event.target.value ?? 'auto';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        setCurrentTheme(theme);
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
