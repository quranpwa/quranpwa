import { Link } from "react-router-dom"
import { getStoredNavData } from "../Utilities";
import { AyatRange, NavigationMode, QuranData } from "../QuranData";
import { useReducer, useState } from "react";
import { NavigationModel } from "../components/NavBar";
import { quran_karim_114_font_chars } from "../components/SuraHeader";

function Root() {
    const storedNavData = getStoredNavData();

    const [navData, setNavData] = useState<NavigationModel>(storedNavData);
    const [quranData] = useState<QuranData>(new QuranData());
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
                        <div className="card-body">
                            <h5 className="card-title">
                                <span className="badge bg-secondary text-dark rounded-pill me-2" style={{ fontSize: '1.5rem' }}> {item.serial}</span>
                                {item.displayText}
                            </h5>
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
                <a className={"nav-link border " + (navMode == NavigationMode.Sura ? 'active' : 'text-color-theme')} href="#"
                    onClick={() => setNavMode(NavigationMode.Sura)}>Sura</a>
            </li>
            <li className="nav-item">
                <a className={"nav-link border " + (navMode == NavigationMode.Juz ? 'active' : 'text-color-theme')} href="#"
                    onClick={() => setNavMode(NavigationMode.Juz)}>Juz/Para</a>
            </li>
            <li className="nav-item">
                <a className={"nav-link border " + (navMode == NavigationMode.Hizb ? 'active' : 'text-color-theme')} href="#"
                    onClick={() => setNavMode(NavigationMode.Hizb)}>Hizb Quarter</a>
            </li>
            <li className="nav-item">
                <a className={"nav-link border " + (navMode == NavigationMode.Page ? 'active' : 'text-color-theme')} href="#"
                    onClick={() => setNavMode(NavigationMode.Page)}>Page</a>
            </li>
            <li className="nav-item">
                <a className={"nav-link border " + (navMode == NavigationMode.Ruku ? 'active' : 'text-color-theme')} href="#"
                    onClick={() => setNavMode(NavigationMode.Ruku)}>Ruku</a>
            </li>
        </ul>

        {navMode == NavigationMode.Sura &&
            <div className="row">
                {quranData.suras.map(sura => {
                    return <div className="col-md-6 col-xl-4">
                        <Link className="card theme-colored mb-3 border text-decoration-none hover-selection"
                            to={`quran?navMode=Sura&serial=${sura.serial}`} key={sura.serial}>
                            <div className="row g-0">
                                <div className="col-5 ps-3">
                                    <div style={{
                                        fontFamily: 'quran_karim_114',
                                        fontSize: '5rem',
                                        marginTop: '-1.75rem',
                                        maxHeight: '5rem'
                                    }}>
                                        {quran_karim_114_font_chars[sura.serial - 1]}
                                    </div>
                                    <p className="card-text mb-0 mt-1">
                                        <span className="me-1" style={{ filter: 'invert(0) sepia(1) saturate(0)', textShadow: 'text-shadow: 0 0 0 white;' }}>{sura.type == 'Meccan' ? '🕋' : '🕌'}</span>
                                        <small>{sura.ayas} Ayats</small>
                                    </p>
                                </div>
                                <div className="col-7">
                                    <div className="card-body">
                                        <h5 className="card-title">{sura.serial}. {sura.tname}</h5>
                                        <p className="card-text m-0 text-nowrap">{sura.ename}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                })}
            </div>
        }

        {navMode != NavigationMode.Sura && getCardsForAyatRanges(navMode)}
    </div>)
}

export default Root
