import { useEffect, useReducer, useState } from 'react';
import './App.css';
import { NavigationMode, QuranData, Translation } from './QuranData';
import NavBar, { NavigationModel } from './components/NavBar';
import QuranViewer from './components/QuranViewer';
import SettingsPanel, { ReadingMode, SettingsModel } from './components/SettingsPanel';
import translationList from './assets/translation-list.json'
import recitationList from './assets/recitation-list.json'

function App() {
    const [quranData] = useState<QuranData>(new QuranData());

    let getNavData = (): NavigationModel => {
        const storedNavModelString = localStorage.getItem('NavigationModel');
        const storedNavModel: NavigationModel = storedNavModelString ? JSON.parse(storedNavModelString)
            : {
                navMode: NavigationMode.Ruku,
                serial: 1,
                ayat: 1
            }

        let searchParams = new URLSearchParams(location.search);
        const navModeStr = searchParams.get('navMode');
        if (navModeStr) {
            const navMode = NavigationMode[navModeStr as keyof typeof NavigationMode];

            const serialNumber = +(searchParams.get('serial') || storedNavModel.serial);
            let ayatNumber = +(searchParams.get('ayat') || storedNavModel.ayat);

            const { start, end } = quranData.getAyatRangeByNavSerial(navMode, serialNumber);
            if (ayatNumber < start || ayatNumber > end)
                ayatNumber = start + 1;

            return {
                navMode: navMode,
                serial: serialNumber,
                ayat: ayatNumber,
            }
        }

        return storedNavModel;
    };

    const getDefaultTranslation = (): Translation => {
        let navLang = navigator.languages[navigator.languages.length - 1] ?? 'en';

        return translationList.filter(f => f.language == navLang)[0];
    }

    const storedSettingsDataString = localStorage.getItem('SettingsData');
    const storedSettingsData: SettingsModel = storedSettingsDataString ? JSON.parse(storedSettingsDataString)
        : {
            readingMode: ReadingMode.Ruku_By_Ruku,
            quranFont: 'hafs',
            translations: [getDefaultTranslation()],
            tafsirs: [],
            recitaions: recitationList.filter(f => f.id == 'Alafasy_128kbps')
        }

    const [navigationModel, setNavigationModel] = useState<NavigationModel>(getNavData());
    const [settingsData, setSettingsData] = useState<SettingsModel>(storedSettingsData);

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        onSettingsChanged(settingsData);
    }, []);

    function setNavDataToSearchParams(model: NavigationModel) {
        const url = new URL(window.location.href);

        for (let prop in model) {
            url.searchParams.delete(prop);
        }

        let navModeString = NavigationMode[model.navMode];
        url.searchParams.set('navMode', navModeString);

        url.searchParams.set('serial', model.serial.toString());

        if (model.ayat)
            url.searchParams.set('ayat', String(model.ayat));

        window.history.pushState({}, '', url.toString());
    }

    const onNavigate = (model: NavigationModel) => {
        const { start, end } = quranData.getAyatRangeByNavSerial(model?.navMode, model?.serial);
        model.ayat ??= start + 1;

        if ((model.ayat ?? 0) < start || (model.ayat ?? 0) > end)
            model.ayat = start + 1;

        setNavigationModel(model);
        localStorage.setItem('NavigationModel', JSON.stringify(model));
        setNavDataToSearchParams(model);
        forceUpdate();
        window.scrollTo(0, 0);
    }

    const onAyatSelection = (selectedAyat: number) => {
        navigationModel.ayat = selectedAyat;
        setNavigationModel(navigationModel);
        localStorage.setItem('NavigationModel', JSON.stringify(navigationModel));
        setNavDataToSearchParams(navigationModel);
        forceUpdate();
    }

    const onSettingsChanged = (model: SettingsModel) => {
        setSettingsData(model);
        localStorage.setItem('SettingsData', JSON.stringify(model));

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
                settingsData={settingsData}
                onNavigate={onNavigate}
                onAyatSelection={onAyatSelection} />

            <SettingsPanel settingsData={settingsData}
                onChange={onSettingsChanged} />
        </>
    )
}

export default App
