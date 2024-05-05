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

    const handleNavModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let navMode = +event.target.value;
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
                return <div className="col-md-6 col-lg-4">
                    <Link className="card theme-colored mb-3 border text-decoration-none"
                        to={`quran?navMode=${NavigationMode[navMode]}&serial=${item.serial}`} key={item.serial}>
                        <div className="row g-0">
                            <div className="col-2 ps-2 mt-1" style={{
                                fontSize: '2rem',
                                textAlign: 'center',
                                verticalAlign: 'middle'
                            }}>
                                <span className="badge bg-secondary text-dark rounded-pill">{item.serial}</span>
                            </div>
                            <div className="col-10">
                                <div className="card-body">
                                    <h5 className="card-title">{item.displayText}</h5>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            })}
        </div>;
    }

    const navMode = navData.navMode;

    return (<div className="container">
        <div className="btn-group theme-colored" style={{ zIndex: 9999 }} role="group" aria-label="Basic radio toggle button group">
            <input type="radio" className="btn-check" name="btn-nav-mode" id="btn-nav-sura" autoComplete="off"
                value={NavigationMode.Sura} checked={navMode === NavigationMode.Sura} onChange={handleNavModeChange} />
            <label className="btn btn-outline-primary" htmlFor="btn-nav-sura">Sura</label>

            <input type="radio" className="btn-check" name="btn-nav-mode" id="btn-nav-juz" autoComplete="off"
                value={NavigationMode.Juz} checked={navMode === NavigationMode.Juz} onChange={handleNavModeChange} />
            <label className="btn btn-outline-primary" htmlFor="btn-nav-juz">Juz/Para</label>

            <input type="radio" className="btn-check" name="btn-nav-mode" id="btn-nav-hizb" autoComplete="off"
                value={NavigationMode.Hizb} checked={navMode === NavigationMode.Hizb} onChange={handleNavModeChange} />
            <label className="btn btn-outline-primary" htmlFor="btn-nav-hizb">Hizb Quarter</label>

            <input type="radio" className="btn-check" name="btn-nav-mode" id="btn-nav-page" autoComplete="off"
                value={NavigationMode.Page} checked={navMode === NavigationMode.Page} onChange={handleNavModeChange} />
            <label className="btn btn-outline-primary" htmlFor="btn-nav-page">Page</label>

            <input type="radio" className="btn-check" name="btn-nav-mode" id="btn-nav-ruku" autoComplete="off"
                value={NavigationMode.Ruku} checked={navMode === NavigationMode.Ruku} onChange={handleNavModeChange} />
            <label className="btn btn-outline-primary" htmlFor="btn-nav-ruku">Ruku</label>
        </div>

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
