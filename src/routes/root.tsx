import { useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { AyatRange, NavigationMode, NavigationShortcutType, QuranData } from "../QuranData";
import { getStoredBookmarks, getStoredNavData, getStoredRecentlyReads, getStoredSettingsData, storeNavData, storeSettingsData } from "../StoredData";
import { quran_karim_114_font_chars } from "../components/SuraHeader";
import ThemeSwitch from "../components/ThemeSwitch";
import SettingsPanel, { SettingsModel } from "../components/SettingsPanel";
import InstallPWA from "../components/InstallPWA";
import { FaSlidersH } from "react-icons/fa";

function Root() {
    const navData = getStoredNavData();

    const quranData = QuranData.instance;

    const [navShortcutType, setNavShortcutType] = useState<NavigationShortcutType>(NavigationShortcutType.Recents);
    const [showMoreRecentlyReads, setShowMoreRecentlyReads] = useState<boolean>(false);
    const [showMoreBookmarks, setShowMoreBookmarks] = useState<boolean>(false);

    const recentlyReads = getStoredRecentlyReads();
    const bookmarks = getStoredBookmarks();

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const setNavMode = (navMode: NavigationMode) => {
        navData.navMode = navMode;
        storeNavData(navData);
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
                                <span className="badge text-theme ps-3" style={{ transform: 'rotate(270deg)', fontSize: '0.75rem' }}>{NavigationMode[navMode]}</span>
                                <span className="badge text-theme ps-0" style={{ fontSize: '1.5rem' }}> {item.serial}</span>
                            </div>
                            <div>
                                <div className="h5">{item.displayText}</div>
                                <div className="text-nowrap text-secondary">
                                    <span style={{ fontFamily: 'arial' }}>۝</span> {item.end - item.start} Ayats
                                    <span className="emoji-icon ms-3">⏱️</span> {quranData.getReadingTime(item)}
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            })}
        </div>;
    }

    const settingsData = getStoredSettingsData();

    const onSettingsChanged = (settingsData: SettingsModel) => {
        storeSettingsData(settingsData);

        quranData.setTranslations(settingsData.translations, forceUpdate);
        quranData.setWbwTranslations(settingsData.wbwTranslations, forceUpdate);
        quranData.setTafsirs(settingsData.tafsirs, forceUpdate);
        quranData.setRecitations(settingsData.recitaions, forceUpdate);
    }

    const navMode = navData.navMode;

    return (<div className="container">

        <h1 className="text-center my-3">
            <img className="rounded me-2" src="/images/quran-rehal.svg" alt="Quran Rehal" height="40" />
            <b>Quran</b> PWA
            <InstallPWA />
        </h1>

        <ul className="nav nav-tabs mb-3" style={{ zIndex: 9999 }}>
            <li className="nav-item">
                <button className={"nav-link " + (navShortcutType == NavigationShortcutType.Recents ? 'active' : 'text-theme')}
                    onClick={() => setNavShortcutType(NavigationShortcutType.Recents)}>Recently Read</button>
            </li>
            <li className="nav-item">
                <button className={"nav-link " + (navShortcutType == NavigationShortcutType.Bookmarks ? 'active' : 'text-theme')}
                    onClick={() => setNavShortcutType(NavigationShortcutType.Bookmarks)}>Bookmarks</button>
            </li>
            <li className="nav-item ms-auto">
                <button className="btn btn btn-outline-secondary my-1 w-100" type="button" style={{ alignSelf: 'flex-end' }}
                    data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                    <FaSlidersH />
                    <span className="d-none d-sm-inline ms-2">Settings</span>
                </button>
            </li>
        </ul>

        {navShortcutType == NavigationShortcutType.Recents &&
            <nav className="nav mb-3">
                {recentlyReads.slice(0, showMoreRecentlyReads ? undefined : 3).map(item =>
                    <a key={item.link} className="nav-link" href={item.link}>{item.displayText}</a>)
                }

                {recentlyReads.length > 3 &&
                    <button className="nav-link" onClick={() => setShowMoreRecentlyReads(!showMoreRecentlyReads)}>
                        {showMoreRecentlyReads ? 'Show less' : 'Show more'}
                    </button>
                }
            </nav>
        }

        {navShortcutType == NavigationShortcutType.Bookmarks &&
            <nav className="nav mb-3">
                {bookmarks.slice(0, showMoreBookmarks ? undefined : 3).map(item =>
                    <a key={item.link} className="nav-link" href={item.link}>{item.displayText}</a>)
                }

                {bookmarks.length > 3 &&
                    <button className="nav-link" onClick={() => setShowMoreBookmarks(!showMoreBookmarks)}>
                        {showMoreBookmarks ? 'Show less' : 'Show more'}
                    </button>
                }
            </nav>
        }

        <hr />
        <ul className="nav nav-tabs mb-3" style={{ zIndex: 9999 }}>
            <li className="nav-item">
                <button className={"nav-link " + (navMode == NavigationMode.Sura ? 'active' : 'text-theme')}
                    onClick={() => setNavMode(NavigationMode.Sura)}>Sura</button>
            </li>
            <li className="nav-item">
                <button className={"nav-link " + (navMode == NavigationMode.Juz ? 'active' : 'text-theme')}
                    onClick={() => setNavMode(NavigationMode.Juz)}>Juz/Para</button>
            </li>
            <li className="nav-item">
                <button className={"nav-link " + (navMode == NavigationMode.Hizb ? 'active' : 'text-theme')}
                    onClick={() => setNavMode(NavigationMode.Hizb)}>Hizb</button>
            </li>
            <li className="nav-item">
                <button className={"nav-link " + (navMode == NavigationMode.Rub ? 'active' : 'text-theme')}
                    onClick={() => setNavMode(NavigationMode.Rub)}>Rub</button>
            </li>
            <li className="nav-item">
                <button className={"nav-link " + (navMode == NavigationMode.Page ? 'active' : 'text-theme')}
                    onClick={() => setNavMode(NavigationMode.Page)}>Page</button>
            </li>
            <li className="nav-item">
                <button className={"nav-link " + (navMode == NavigationMode.Ruku ? 'active' : 'text-theme')}
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
                                <div className="card-body pb-0">
                                    <h5 className="card-title">{sura.serial}. {sura.tname}</h5>
                                    <p className="card-text m-0 text-nowrap">{sura.ename}</p>
                                </div>
                                <div className="pe-3" style={{
                                    fontFamily: 'quran_karim_114',
                                    fontSize: '5rem',
                                    marginTop: '-1.75rem',
                                    maxHeight: '5rem'
                                }}>
                                    {quran_karim_114_font_chars[sura.serial - 1]}
                                </div>
                            </div>
                            <div className="d-flex justify-content-between px-3 py-2">
                                <div className="small text-secondary">
                                    <span className="emoji-icon me-1">{sura.type == 'Meccan' ? '🕋' : '🕌'}</span>
                                    {sura.ayas} Ayats
                                </div>
                                <div className="small text-secondary">
                                    <span className="emoji-icon me-1">⏱️</span>
                                    {quranData.getReadingTime(sura)}
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

        <div className="row mt-2 mb-5">
            <div className="col-12 col-md-6 col-lg-3">
                <button className="btn btn btn-outline-secondary my-1 w-100" type="button" style={{ alignSelf: 'flex-end' }}
                    data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                    <FaSlidersH className="me-2" /> Settings
                </button>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
                <Link to="/about" className="btn btn-outline-info my-1 w-100">About Quran PWA</Link>
            </div>
        </div>

        <SettingsPanel settingsData={settingsData}
            onChange={onSettingsChanged} />
    </div>)
}

export default Root;