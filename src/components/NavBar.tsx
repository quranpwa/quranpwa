import { Link } from 'react-router-dom';
import { NavigationMode, QuranData } from '../QuranData';
import './NavBar.css'
import { FaAnchor, FaBars, FaSlidersH } from 'react-icons/fa';

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
                    <FaBars />
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
            <FaAnchor />
        </button>

        <button className="btn theme-colored border nav-btn ms-auto" type="button" style={{ alignSelf: 'flex-end' }}
            data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
            <FaSlidersH />
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