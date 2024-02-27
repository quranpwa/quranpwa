import { Sura, QuranData, AyatRange, Ayat } from '../QuranData';

function NavBar({ quranData, navigationModel, onNavigate }: NavBarProps) {

    const triggerOnNavigate = () => {
        onNavigate(navigationModel);
    };

    const handleNavigationModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let selectedItem = event.target.value;
        const selectedNavigationMode: NavigationMode = NavigationMode[selectedItem as keyof typeof NavigationMode];
        navigationModel.navMode = selectedNavigationMode;
        triggerOnNavigate();
    };

    const handleSuraChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let selectedItem = quranData.suras[+event.target.value - 1];
        navigationModel.sura = selectedItem;
        triggerOnNavigate();
    };

    const handleJuzChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let selectedItem = quranData.juzs[+event.target.value - 1];
        navigationModel.juz = selectedItem;
        triggerOnNavigate();
    };

    const handleHizbChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let selectedItem = quranData.hizb_quarters[+event.target.value - 1];
        navigationModel.hizb = selectedItem;
        triggerOnNavigate();
    };

    const handleRukuChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let selectedItem = quranData.rukus[+event.target.value - 1];
        navigationModel.ruku = selectedItem;
        triggerOnNavigate();
    };

    const handlePageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let selectedItem = quranData.pages[+event.target.value - 1];
        navigationModel.page = selectedItem;
        triggerOnNavigate();
    };

    return <nav className='navbar fixed-top px-2'>
        <h1>Quran Majid</h1>

        <div>
            <select className='select' value={NavigationMode[navigationModel.navMode]} onChange={handleNavigationModeChange} title="Navigation Mode">
                {Object.keys(NavigationMode).filter(f => isNaN(f as any)).map(item => <option key={item} value={item}>{item}</option>)}
            </select>
            {navigationModel.navMode == NavigationMode.Sura &&
                <select className='select' value={navigationModel.sura?.serial} onChange={handleSuraChange} title="Sura">
                    {quranData.suras.map(item => <option key={item.serial} value={item.serial}>{item.serial}. {item.tname}</option>)}
                </select>
            }
            {navigationModel.navMode == NavigationMode.Juz &&
                <select className='select' value={navigationModel.juz?.serial} onChange={handleJuzChange} title="Juz">
                    {quranData.juzs.map(item => <option key={item.serial} value={item.serial}>{item.serial}</option>)}
                </select>
            }
            {navigationModel.navMode == NavigationMode.Hizb &&
                <select className='select' value={navigationModel.hizb?.serial} onChange={handleHizbChange} title="Hizb">
                    {quranData.hizb_quarters.map(item => <option key={item.serial} value={item.serial}>{item.serial}</option>)}
                </select>
            }
            {navigationModel.navMode == NavigationMode.Ruku &&
                <select className='select' value={navigationModel.ruku?.serial} onChange={handleRukuChange} title="Ruku">
                    {quranData.rukus.map(item => <option key={item.serial} value={item.serial}>{item.serial}. {item.displayText}</option>)}
                </select>
            }
            {navigationModel.navMode == NavigationMode.Page &&
                <select className='select' value={navigationModel.page?.serial} onChange={handlePageChange} title="Ruku">
                    {quranData.pages.map(item => <option key={item.serial} value={item.serial}>{item.serial}</option>)}
                </select>
            }
        </div>

        <button className="btn btn-secondary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">⚙️ Settings</button>
    </nav>;
}

export default NavBar

export enum NavigationMode {
    Sura,
    Juz,
    Hizb,
    Ruku,
    Page,
}

interface NavBarProps {
    quranData: QuranData,
    navigationModel: NavigationModel,
    onNavigate: (model: NavigationModel) => void
}

export interface NavigationModel {
    navMode: NavigationMode,
    sura: Sura,
    juz: AyatRange,
    hizb: AyatRange,
    page: AyatRange,
    ruku: AyatRange,
    ayat: Ayat
}