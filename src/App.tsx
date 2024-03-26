import { useEffect, useReducer, useState } from 'react';
import './App.css';
import { NavigationMode, QuranData } from './QuranData';
import { getDefaultSettings } from './Utilities';
import NavBar, { NavigationModel } from './components/NavBar';
import QuranViewer from './components/QuranViewer';
import SettingsPanel, { SettingsModel } from './components/SettingsPanel';

function App() {
    const [quranData] = useState<QuranData>(new QuranData());

    let getNavData = (): NavigationModel => {
        const storedNavDataString = localStorage.getItem('NavigationData');
        const storedNavData: NavigationModel = storedNavDataString ? JSON.parse(storedNavDataString)
            : {
                navMode: NavigationMode.Ruku,
                serial: 1,
                ayat: 1
            }

        let searchParams = new URLSearchParams(location.search);
        const navModeStr = searchParams.get('navMode');
        if (navModeStr) {
            const navMode = NavigationMode[navModeStr as keyof typeof NavigationMode];

            const serialNumber = +(searchParams.get('serial') || storedNavData.serial);
            let ayatNumber = +(searchParams.get('ayat') || storedNavData.ayat);

            const { start, end } = quranData.getAyatRangeByNavSerial(navMode, serialNumber);
            if (ayatNumber < start || ayatNumber > end)
                ayatNumber = start + 1;

            return {
                navMode: navMode,
                serial: serialNumber,
                ayat: ayatNumber,
            }
        }

        return storedNavData;
    };

    const storedSettingsDataString = localStorage.getItem('SettingsData');
    const storedSettingsData: SettingsModel = storedSettingsDataString ? JSON.parse(storedSettingsDataString)
        : getDefaultSettings()

    const [navData, setNavData] = useState<NavigationModel>(getNavData());
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

        setNavData(model);
        localStorage.setItem('NavigationData', JSON.stringify(model));
        setNavDataToSearchParams(model);
        forceUpdate();
        window.scrollTo(0, 0);
    }

    const onAyatSelection = (selectedAyat: number) => {
        navData.ayat = selectedAyat;
        setNavData(navData);
        localStorage.setItem('NavigationData', JSON.stringify(navData));
        setNavDataToSearchParams(navData);
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
                navData={navData}
                onNavigate={onNavigate} />

            <QuranViewer quranData={quranData}
                navData={navData}
                settingsData={settingsData}
                onNavigate={onNavigate}
                onAyatSelection={onAyatSelection} />

            <SettingsPanel settingsData={settingsData}
                onChange={onSettingsChanged} />
        </>
    )
}

export default App
