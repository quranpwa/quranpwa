import { Link } from 'react-router-dom';
import { NavigationMode, QuranData } from '../QuranData';
import './NavBar.css'

function NavBar({ quranData, navData, onNavigate }: NavBarProps) {

    const triggerOnNavigate = () => {
        onNavigate(navData);
    };

    const handleNavigationModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let selectedItem = event.target.value;
        const selectedNavigationMode: NavigationMode = NavigationMode[selectedItem as keyof typeof NavigationMode];
        navData.navMode = selectedNavigationMode;
        triggerOnNavigate();
    };

    const handleSuraChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        navData.serial = +event.target.value;
        triggerOnNavigate();
    };

    const handleJuzChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        navData.serial = +event.target.value;
        triggerOnNavigate();
    };

    const handleHizbChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        navData.serial = +event.target.value;
        triggerOnNavigate();
    };

    const handleRukuChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        navData.serial = +event.target.value;
        triggerOnNavigate();
    };

    const handlePageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        navData.serial = +event.target.value;
        triggerOnNavigate();
    };

    const handleGoToSelection = () => {
        let selectedAyatElement = document.getElementById(location.hash.substring(1));
        if (selectedAyatElement) {
            selectedAyatElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const showMenuNavButton = false;

    return <nav className='navbar fixed-top px-2'>
        {showMenuNavButton &&
            <>
                <button className="btn theme-colored border nav-btn" type="button" title="Menu"
                    data-bs-toggle="offcanvas" data-bs-target="#offcanvasLeft" aria-controls="offcanvasLeft">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                    </svg>
                </button>

                <div className="offcanvas offcanvas-start bg-dark text-white" id="offcanvasLeft" data-bs-scroll="true" aria-labelledby="offcanvasLeftLabel">
                    <div className="offcanvas-header">
                        <h4 id="offcanvasLeftLabel">
                            Menu
                        </h4>
                        <button type="button" className="btn-close bg-secondary text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <h5>Navigation Mode</h5>
                        <select className='select w-100 m-0' value={NavigationMode[navData.navMode]} onChange={handleNavigationModeChange} title="Navigation Mode">
                            {Object.keys(NavigationMode).filter(f => isNaN(f as any)).map(item => <option key={item} value={item}>{item}</option>)}
                        </select>
                        <hr />
                        {navData.navMode == NavigationMode.Sura &&
                            <select className='select w-100 m-0' value={navData?.serial} onChange={handleSuraChange} title="Sura">
                                {quranData.suras.map(item => <option key={item.serial} value={item.serial}>{item.serial}. {item.tname}</option>)}
                            </select>
                        }
                        {navData.navMode == NavigationMode.Juz &&
                            <select className='select w-100 m-0' value={navData?.serial} onChange={handleJuzChange} title="Juz">
                                {quranData.juzs.map(item => <option key={item.serial} value={item.serial}>{item.serial}</option>)}
                            </select>
                        }
                        {navData.navMode == NavigationMode.Hizb &&
                            <select className='select w-100 m-0' value={navData?.serial} onChange={handleHizbChange} title="Hizb">
                                {quranData.hizb.map(item => <option key={item.serial} value={item.serial}>{item.serial}</option>)}
                            </select>
                        }
                        {navData.navMode == NavigationMode.Rub &&
                            <select className='select w-100 m-0' value={navData?.serial} onChange={handleHizbChange} title="Rub">
                                {quranData.hizb_quarters.map(item => <option key={item.serial} value={item.serial}>{item.serial}</option>)}
                            </select>
                        }
                        {navData.navMode == NavigationMode.Ruku &&
                            <select className='select w-100 m-0' value={navData?.serial} onChange={handleRukuChange} title="Ruku">
                                {quranData.rukus.map(item => <option key={item.serial} value={item.serial}>{item.serial}. {item.displayText}</option>)}
                            </select>
                        }
                        {navData.navMode == NavigationMode.Page &&
                            <select className='select w-100 m-0' value={navData?.serial} onChange={handlePageChange} title="Ruku">
                                {quranData.pages.map(item => <option key={item.serial} value={item.serial}>{item.serial}</option>)}
                            </select>
                        }
                    </div>
                </div>
            </>
        }
        <h1 className="nav-title">
            <Link to="/">
                <img className="rounded" src="/images/quran-rehal.svg" alt="Quran Rehal" height="30" />
            </Link>
            <span className="d-none d-sm-inline ms-2"><b>Quran</b> PWA</span>
        </h1>

        <select className="nav-select me-1 me-md-2" value={NavigationMode[navData.navMode]} onChange={handleNavigationModeChange} title="Navigation Mode">
            {Object.keys(NavigationMode).filter(f => isNaN(f as any)).map(item => <option key={item} value={item}>{item}</option>)}
        </select>
        {navData.navMode == NavigationMode.Sura &&
            <select className="nav-select" value={navData?.serial} onChange={handleSuraChange} title="Sura">
                {quranData.suras.map(item => <option key={item.serial} value={item.serial}>{item.serial}. {item.tname}</option>)}
            </select>
        }
        {navData.navMode == NavigationMode.Juz &&
            <select className="nav-select" value={navData?.serial} onChange={handleJuzChange} title="Juz">
                {quranData.juzs.map(item => <option key={item.serial} value={item.serial}>{item.serial}</option>)}
            </select>
        }
        {navData.navMode == NavigationMode.Hizb &&
            <select className="nav-select" value={navData?.serial} onChange={handleHizbChange} title="Hizb">
                {quranData.hizb.map(item => <option key={item.serial} value={item.serial}>{item.serial}</option>)}
            </select>
        }
        {navData.navMode == NavigationMode.Rub &&
            <select className="nav-select" value={navData?.serial} onChange={handleHizbChange} title="Rub">
                {quranData.hizb_quarters.map(item => <option key={item.serial} value={item.serial}>{item.serial}</option>)}
            </select>
        }
        {navData.navMode == NavigationMode.Ruku &&
            <select className="nav-select" value={navData?.serial} onChange={handleRukuChange} title="Ruku">
                {quranData.rukus.map(item => <option key={item.serial} value={item.serial}>{item.serial}. {item.displayText}</option>)}
            </select>
        }
        {navData.navMode == NavigationMode.Page &&
            <select className="nav-select" value={navData?.serial} onChange={handlePageChange} title="Ruku">
                {quranData.pages.map(item => <option key={item.serial} value={item.serial}>{item.serial}</option>)}
            </select>
        }

        <button className="btn theme-colored border nav-btn ms-2" type="button"
            title='Go To Selection'
            onClick={handleGoToSelection}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-crosshair" viewBox="0 0 16 16">
                <path d="M8.5.5a.5.5 0 0 0-1 0v.518A7 7 0 0 0 1.018 7.5H.5a.5.5 0 0 0 0 1h.518A7 7 0 0 0 7.5 14.982v.518a.5.5 0 0 0 1 0v-.518A7 7 0 0 0 14.982 8.5h.518a.5.5 0 0 0 0-1h-.518A7 7 0 0 0 8.5 1.018zm-6.48 7A6 6 0 0 1 7.5 2.02v.48a.5.5 0 0 0 1 0v-.48a6 6 0 0 1 5.48 5.48h-.48a.5.5 0 0 0 0 1h.48a6 6 0 0 1-5.48 5.48v-.48a.5.5 0 0 0-1 0v.48A6 6 0 0 1 2.02 8.5h.48a.5.5 0 0 0 0-1zM8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
            </svg>
        </button>

        <button className="btn theme-colored border nav-btn ms-auto" type="button" style={{ alignSelf: 'flex-end' }}
            data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sliders2" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M10.5 1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4H1.5a.5.5 0 0 1 0-1H10V1.5a.5.5 0 0 1 .5-.5M12 3.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m-6.5 2A.5.5 0 0 1 6 6v1.5h8.5a.5.5 0 0 1 0 1H6V10a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5M1 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 8m9.5 2a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V13H1.5a.5.5 0 0 1 0-1H10v-1.5a.5.5 0 0 1 .5-.5m1.5 2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
            </svg>
            <span className="d-none d-md-inline ms-2">Settings</span>
        </button>

    </nav>;
}

export default NavBar

interface NavBarProps {
    quranData: QuranData,
    navData: NavigationModel,
    onNavigate: (model: NavigationModel) => void
}

export interface NavigationModel {
    navMode: NavigationMode,
    serial: number,
    ayat: number
}