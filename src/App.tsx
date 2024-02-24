import { useEffect, useReducer, useState } from 'react';
import './App.css'
import { Ayat, QuranData } from './QuranData';
import NavBar, { NavigationModel, NavigationMode } from './components/NavBar';
import QuranViewer from './components/QuranViewer';
import SettingsPanel, { ReadingMode, SettingsModel } from './components/SettingsPanel';

function App() {
    const [quranData, setQuranData] = useState<QuranData>(new QuranData());

    let getNavData = (): NavigationModel => {
        const storedNavModelString = localStorage.getItem('NavigationModel');
        const storedNavModel: NavigationModel = storedNavModelString ? JSON.parse(storedNavModelString)
            : {
                navMode: NavigationMode.Ruku,
                sura: quranData.suras[0],
                juz: quranData.juzs[0],
                hizb: quranData.hizb_quarters[0],
                page: quranData.pages[0],
                ruku: quranData.rukus[0],
                ayat: quranData.ayats[0]
            }

        let searchParams = new URLSearchParams(location.search);
        const navMode = searchParams.get('navMode');
        if (navMode) {
            const suraNumber = +(searchParams.get('sura') || -1);
            const juzNumber = +(searchParams.get('juz') || -1);
            const hizbNumber = +(searchParams.get('hizb') || -1);
            const pageNumber = +(searchParams.get('page') || -1);
            const rukuNumber = +(searchParams.get('ruku') || -1);
            const ayatNumber = +(searchParams.get('ayat') || -1);

            return {
                navMode: NavigationMode[navMode as keyof typeof NavigationMode],
                sura: quranData.suras[suraNumber - 1] ?? storedNavModel.sura,
                juz: quranData.juzs[juzNumber - 1] ?? storedNavModel.juz,
                hizb: quranData.hizb_quarters[hizbNumber - 1] ?? storedNavModel.hizb,
                page: quranData.pages[pageNumber - 1] ?? storedNavModel.page,
                ruku: quranData.rukus[rukuNumber - 1] ?? storedNavModel.ruku,
                ayat: quranData.ayats[ayatNumber - 1] ?? storedNavModel.ayat,
            }
        }

        return storedNavModel;
    };

    const storedSettingsModelString = localStorage.getItem('SettingsModel');
    const storedSettingsModel: SettingsModel = storedSettingsModelString ? JSON.parse(storedSettingsModelString)
        : {
            readingMode: ReadingMode.Ruku_By_Ruku,
            quranFont: 'hafs',
            translations: [],
            tafsirs:[]
        }

    const [navigationModel, setNavigationModel] = useState<NavigationModel>(getNavData());
    const [settingsModel, setSettingsModel] = useState<SettingsModel>(storedSettingsModel);

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        onSettingsChanged(settingsModel);
    }, []);

    function setNavDataToSearchParams(model: NavigationModel) {
        const url = new URL(window.location.href);

        for (let prop in model) {
            url.searchParams.delete(prop);
        }

        let navModeString = NavigationMode[model.navMode];
        url.searchParams.set('navMode', navModeString);

        let navItem = (model as any)[navModeString.toLowerCase()];
        url.searchParams.set(navModeString.toLowerCase(), navItem?.serial.toString());

        if (model.ayat)
            url.searchParams.set('ayat', String(model.ayat?.serial));

        window.history.pushState({}, '', url.toString());
    }

    const onNavigate = (model: NavigationModel) => {
        setNavigationModel(model);
        localStorage.setItem('NavigationModel', JSON.stringify(model));
        setNavDataToSearchParams(model);
        forceUpdate();
    }

    const onAyatSelection = (selectedAyat: Ayat) => {
        navigationModel.ayat = selectedAyat;
        setNavigationModel(navigationModel);
        localStorage.setItem('NavigationModel', JSON.stringify(navigationModel));
        setNavDataToSearchParams(navigationModel);
    }

    const onSettingsChanged = (model: SettingsModel) => {
        setSettingsModel(model);
        localStorage.setItem('SettingsModel', JSON.stringify(model));

        quranData.setTranslations(model.translations, forceUpdate);
        quranData.setTafsirs(model.tafsirs, forceUpdate);
    }


    return (
        <>
            <NavBar quranData={quranData}
                navigationModel={navigationModel}
                onNavigate={onNavigate} />

            <QuranViewer quranData={quranData}
                navigationModel={navigationModel}
                settingsModel={settingsModel}
                onAyatSelection={onAyatSelection} />

            <SettingsPanel settingsModel={settingsModel}
                onChange={onSettingsChanged} />
        </>
    )
}

export default App
