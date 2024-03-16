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
        <button className="btn btn-secondary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasLeft" aria-controls="offcanvasLeft">
            <svg height="16" viewBox="0 0 16 16" version="1.1" width="16">
                <path d="M1 2.75A.75.75 0 0 1 1.75 2h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75ZM1.75 12h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Z"></path>
            </svg>
        </button>

        <h1>Quran Majid</h1>

        <div className="d-none d-md-block">
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

        <div className="offcanvas offcanvas-start bg-dark text-white" id="offcanvasLeft" data-bs-scroll="true" aria-labelledby="offcanvasLeftLabel">
            <div className="offcanvas-header">
                <h4 id="offcanvasLeftLabel">Menu</h4>
                <button type="button" className="btn-close bg-secondary text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <h5>Navigation Mode</h5>
                <select className='select w-100 m-0' value={NavigationMode[navigationModel.navMode]} onChange={handleNavigationModeChange} title="Navigation Mode">
                    {Object.keys(NavigationMode).filter(f => isNaN(f as any)).map(item => <option key={item} value={item}>{item}</option>)}
                </select>
                <hr />
                {navigationModel.navMode == NavigationMode.Sura &&
                    <select className='select w-100 m-0' value={navigationModel.sura?.serial} onChange={handleSuraChange} title="Sura">
                        {quranData.suras.map(item => <option key={item.serial} value={item.serial}>{item.serial}. {item.tname}</option>)}
                    </select>
                }
                {navigationModel.navMode == NavigationMode.Juz &&
                    <select className='select w-100 m-0' value={navigationModel.juz?.serial} onChange={handleJuzChange} title="Juz">
                        {quranData.juzs.map(item => <option key={item.serial} value={item.serial}>{item.serial}</option>)}
                    </select>
                }
                {navigationModel.navMode == NavigationMode.Hizb &&
                    <select className='select w-100 m-0' value={navigationModel.hizb?.serial} onChange={handleHizbChange} title="Hizb">
                        {quranData.hizb_quarters.map(item => <option key={item.serial} value={item.serial}>{item.serial}</option>)}
                    </select>
                }
                {navigationModel.navMode == NavigationMode.Ruku &&
                    <select className='select w-100 m-0' value={navigationModel.ruku?.serial} onChange={handleRukuChange} title="Ruku">
                        {quranData.rukus.map(item => <option key={item.serial} value={item.serial}>{item.serial}. {item.displayText}</option>)}
                    </select>
                }
                {navigationModel.navMode == NavigationMode.Page &&
                    <select className='select w-100 m-0' value={navigationModel.page?.serial} onChange={handlePageChange} title="Ruku">
                        {quranData.pages.map(item => <option key={item.serial} value={item.serial}>{item.serial}</option>)}
                    </select>
                }
            </div>
        </div>
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