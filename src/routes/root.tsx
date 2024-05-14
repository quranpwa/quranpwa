import { useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { AyatRange, NavigationMode, NavigationShortcutType, QuranData } from "../QuranData";
import { getStoredBookmarks, getStoredNavData, getStoredRecentlyReads } from "../Utilities";
import { NavigationModel } from "../components/NavBar";
import { quran_karim_114_font_chars } from "../components/SuraHeader";
import ThemeSwitch from "../components/ThemeSwitch";

function Root() {
    const storedNavData = getStoredNavData();

    const [navData, setNavData] = useState<NavigationModel>(storedNavData);
    const [quranData] = useState<QuranData>(QuranData.instance);

    const [navShortcutType, setNavShortcutType] = useState<NavigationShortcutType>(NavigationShortcutType.Recents);

    const recentlyReads = getStoredRecentlyReads();
    const bookmarks = getStoredBookmarks();

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const setNavMode = (navMode: NavigationMode) => {
        navData.navMode = navMode;
        setNavData(navData);
        localStorage.setItem('NavigationData', JSON.stringify(navData));
        forceUpdate();
    };

    const getCardsForAyatRanges = (navMode: NavigationMode) => {
        let items: AyatRange[] = [];

        if (navMode == NavigationMode.Juz) {
            items = quranData.juzs;
        } else if (navMode == NavigationMode.Hizb) {
            items = quranData.hizb;
        } else if (navMode == NavigationMode.Rub) {
            items = quranData.hizb_quarters;
        } else if (navMode == NavigationMode.Page) {
            items = quranData.pages;
        } else if (navMode == NavigationMode.Ruku) {
            items = quranData.rukus;
        }

        return <div className="row">
            {items.map(item => {
                return <div key={item.serial} className="col-md-6 col-lg-4">
                    <Link className="card theme-colored mb-3 border text-decoration-none hover-selection"
                        to={`quran?navMode=${NavigationMode[navMode]}&serial=${item.serial}`}>
                        <div className="card-body d-flex align-items-center">
                            <div className="badge border rounded-pill me-2 px-0">
                                <span className="badge text-color-theme ps-3" style={{ transform: 'rotate(270deg)', fontSize: '0.75rem' }}>{NavigationMode[navMode]}</span>
                                <span className="badge text-color-theme ps-0" style={{ fontSize: '1.5rem' }}> {item.serial}</span>
                            </div>
                            <div>
                                <div className="h5">{item.displayText}</div>
                                <div className="text-nowrap text-secondary">{item.end - item.start} Ayats | {quranData.getLengthInMinutes(item)} minutes</div>
                            </div>
                        </div>
                    </Link>
                </div>
            })}
        </div>;
    }

    const navMode = navData.navMode;

    return (<div className="container">

        <h1 className="text-center my-3">
            <img className="me-2" src="/images/quran-rehal.svg" alt="Quran Rehal" height="40" />
            <b>Quran</b> PWA
        </h1>

        <ul className="nav nav-tabs mb-3" style={{ zIndex: 9999 }}>
            <li className="nav-item">
                <button className={"nav-link " + (navShortcutType == NavigationShortcutType.Recents ? 'active' : 'text-color-theme')}
                    onClick={() => setNavShortcutType(NavigationShortcutType.Recents)}>Recently Read</button>
            </li>
            <li className="nav-item">
                <button className={"nav-link " + (navShortcutType == NavigationShortcutType.Bookmarks ? 'active' : 'text-color-theme')}
                    onClick={() => setNavShortcutType(NavigationShortcutType.Bookmarks)}>Bookmarks</button>
            </li>
        </ul>

        {navShortcutType == NavigationShortcutType.Recents &&
            <nav className="nav mb-3">
                {recentlyReads.map(item =>
                    <a key={item.link} className="nav-link" href={item.link}>{item.displayText}</a>)}
            </nav>
        }

        {navShortcutType == NavigationShortcutType.Bookmarks &&
            <nav className="nav mb-3">
                {bookmarks.map(item =>
                    <a key={item.link} className="nav-link" href={item.link}>{item.displayText}</a>)}
            </nav>
        }

        <hr />
        <ul className="nav nav-tabs mb-3" style={{ zIndex: 9999 }}>
            <li className="nav-item">
                <button className={"nav-link " + (navMode == NavigationMode.Sura ? 'active' : 'text-color-theme')}
                    onClick={() => setNavMode(NavigationMode.Sura)}>Sura</button>
            </li>
            <li className="nav-item">
                <button className={"nav-link " + (navMode == NavigationMode.Juz ? 'active' : 'text-color-theme')}
                    onClick={() => setNavMode(NavigationMode.Juz)}>Juz/Para</button>
            </li>
            <li className="nav-item">
                <button className={"nav-link " + (navMode == NavigationMode.Hizb ? 'active' : 'text-color-theme')}
                    onClick={() => setNavMode(NavigationMode.Hizb)}>Hizb</button>
            </li>
            <li className="nav-item">
                <button className={"nav-link " + (navMode == NavigationMode.Rub ? 'active' : 'text-color-theme')}
                    onClick={() => setNavMode(NavigationMode.Rub)}>Rub</button>
            </li>
            <li className="nav-item">
                <button className={"nav-link " + (navMode == NavigationMode.Page ? 'active' : 'text-color-theme')}
                    onClick={() => setNavMode(NavigationMode.Page)}>Page</button>
            </li>
            <li className="nav-item">
                <button className={"nav-link " + (navMode == NavigationMode.Ruku ? 'active' : 'text-color-theme')}
                    onClick={() => setNavMode(NavigationMode.Ruku)}>Ruku</button>
            </li>
        </ul>

        {navMode == NavigationMode.Sura &&
            <div className="row">
                {quranData.suras.map(sura => {
                    return <div key={sura.serial} className="col-md-6 col-xl-4">
                        <Link className="card theme-colored mb-3 border text-decoration-none hover-selection"
                            to={`quran?navMode=Sura&serial=${sura.serial}`}>
                            <div className="d-flex align-items-center">
                                <div className="ps-3">
                                    <div style={{
                                        fontFamily: 'quran_karim_114',
                                        fontSize: '5rem',
                                        marginTop: '-1.75rem',
                                        maxHeight: '5rem'
                                    }}>
                                        {quran_karim_114_font_chars[sura.serial - 1]}
                                    </div>
                                </div>
                                <div className="card-body pb-0">
                                    <h5 className="card-title">{sura.serial}. {sura.tname}</h5>
                                    <p className="card-text m-0 text-nowrap">{sura.ename}</p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between px-2 pb-2">
                                <div className="small text-secondary">
                                    <span className="me-1" style={{ filter: 'invert(0) sepia(1) saturate(0)', textShadow: 'text-shadow: 0 0 0 white' }}>{sura.type == 'Meccan' ? '🕋' : '🕌'}</span>
                                    {sura.ayas} Ayats
                                </div>
                                <div className="small text-secondary">
                                    <span className="me-1" style={{ filter: 'invert(0) sepia(1) saturate(0)', textShadow: 'text-shadow: 0 0 0 white' }}>⏲️</span>
                                    {quranData.getLengthInMinutes(sura)} minutes
                                </div>
                            </div>
                        </Link>
                    </div>
                })}
            </div>
        }

        {navMode != NavigationMode.Sura && getCardsForAyatRanges(navMode)}

        <hr />
        <ThemeSwitch />
        <br />
        <br />
        <p>Quran PWA is a open source project. <a href="https://github.com/quranpwa/quranpwa" target="_blank">link</a></p>
        <br />
    </div>)
}

export default Root;