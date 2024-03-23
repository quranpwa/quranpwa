import { useEffect, useReducer, useState } from 'react';
import './App.css';
import { NavigationMode, QuranData, Translation } from './QuranData';
import NavBar, { NavigationModel } from './components/NavBar';
import QuranViewer from './components/QuranViewer';
import SettingsPanel, { ReadingMode, SettingsModel } from './components/SettingsPanel';
import translationList from './assets/translation-list.json'

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

            const serialNumber = +(searchParams.get('serial') || -1) ?? storedNavModel.serial;
            let ayatNumber = +(searchParams.get('ayat') || -1) ?? storedNavModel.ayat;

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

    const storedSettingsModelString = localStorage.getItem('SettingsModel');
    const storedSettingsModel: SettingsModel = storedSettingsModelString ? JSON.parse(storedSettingsModelString)
        : {
            readingMode: ReadingMode.Ruku_By_Ruku,
            quranFont: 'hafs',
            translations: [getDefaultTranslation()],
            tafsirs: []
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
                onNavigate={onNavigate}
                onAyatSelection={onAyatSelection} />

            <SettingsPanel settingsModel={settingsModel}
                onChange={onSettingsChanged} />
        </>
    )
}

export default App
