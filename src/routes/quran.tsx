import { useEffect, useReducer } from 'react';
import { NavigationMode, QuranData } from '../QuranData';
import { getStoredNavData, getStoredSettingsData, storeRecentlyRead, storeNavData, storeSettingsData } from '../StoredData';
import NavBar, { NavigationModel } from '../components/NavBar';
import QuranViewer from '../components/QuranViewer';
import SettingsPanel, { SettingsModel } from '../components/SettingsPanel';

function Quran() {
    const quranData = QuranData.instance;

    let getNavData = (): NavigationModel => {
        const storedNavData: NavigationModel = getStoredNavData()

        let searchParams = new URLSearchParams(location.search);
        const navModeStr = searchParams.get('navMode');
        if (navModeStr) {
            const navMode = NavigationMode[navModeStr as keyof typeof NavigationMode];

            const serialNumber = +(searchParams.get('serial') || storedNavData.serial);
            let ayatNumber = +(location.hash.match(/\d+/g)?.pop() || storedNavData.ayat);

            const { start, end, startingSuraNumber } = quranData.getAyatRangeByNavSerial(navMode, serialNumber);
            if (ayatNumber < start || ayatNumber > end)
                ayatNumber = start + 1;

            let navData: NavigationModel = {
                navMode: navMode,
                serial: serialNumber,
                ayat: ayatNumber,
            }

            let displayText = navModeStr + ' ' + serialNumber;

            let ayat = quranData.ayats.find(f => f.serial == ayatNumber);
            if (ayat) {
                let sura = quranData.suras[ayat.suraIdx];
                displayText += ` (${sura.tname} [${sura.serial}:${ayat.serialInSura}])`;
            } else {
                let sura = quranData.suras[startingSuraNumber - 1];
                displayText += ` (${sura.tname})`;
            }

            storeRecentlyRead({
                displayText: displayText,
                navData: navData,
                date: new Date(),
                link: location.pathname + location.search + location.hash
            });

            return navData;
        }

        return storedNavData;
    };

    const storedSettingsData = getStoredSettingsData();

    const navData = getNavData();

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        onSettingsChanged(storedSettingsData);

        let selectedAyatElement = document.getElementById(location.hash.substring(1));
        if (selectedAyatElement) {
            selectedAyatElement.scrollIntoView();
        }
    }, []);

    function setNavDataToSearchParams(navData: NavigationModel) {
        const url = new URL(window.location.href);

        for (let prop in navData) {
            url.searchParams.delete(prop);
        }

        let navModeString = NavigationMode[navData.navMode];
        url.searchParams.set('navMode', navModeString);

        url.searchParams.set('serial', navData.serial.toString());

        if (navData.ayat)
            url.hash = String(navData.ayat);

        window.history.pushState({}, '', url.toString());
    }

    const onNavigate = (navData: NavigationModel) => {
        const { start, end } = quranData.getAyatRangeByNavSerial(navData?.navMode, navData?.serial);
        navData.ayat ??= start + 1;

        if ((navData.ayat ?? 0) < start || (navData.ayat ?? 0) > end)
            navData.ayat = start + 1;

        storeNavData(navData);
        setNavDataToSearchParams(navData);
        forceUpdate();
    }

    const onAyatSelection = (selectedAyat: number, isTranslation?: boolean) => {
        navData.ayat = selectedAyat;

        storeNavData(navData);
        forceUpdate();
        location.hash = isTranslation ? 't' + selectedAyat : String(selectedAyat);
    }

    const onSettingsChanged = async (settingsData: SettingsModel) => {
        storeSettingsData(settingsData);

        await quranData.setTranslations(settingsData.translations);
        await quranData.setWbwTranslations(settingsData.wbwTranslations);
        await quranData.setTafsirs(settingsData.tafsirs);
        await quranData.setRecitations(settingsData.recitaions);

        forceUpdate();
    }

    return (
        <>
            <NavBar quranData={quranData}
                navData={navData}
                onNavigate={onNavigate} />

            <QuranViewer quranData={quranData}
                navData={navData}
                settingsData={storedSettingsData}
                onNavigate={onNavigate}
                onAyatSelection={onAyatSelection} />

            <SettingsPanel settingsData={storedSettingsData}
                onChange={onSettingsChanged} />
        </>
    )
}

export default Quran
