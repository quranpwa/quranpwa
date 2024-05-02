import { Ayat, NavigationMode } from "./QuranData";
import recitationList from './assets/recitation-list.json';
import translationList from './assets/translation-list.json';
import { NavigationModel } from "./components/NavBar";
import { ReadingMode, SettingsModel } from "./components/SettingsPanel";

export function groupBy<T>(arr: T[], fn: (item: T) => any) {
    return arr.reduce<Record<string, T[]>>((prev, curr) => {
        const groupKey = fn(curr);
        const group = prev[groupKey] || [];
        group.push(curr);
        return { ...prev, [groupKey]: group };
    }, {});
}

export function padLeft(str: string, numChars = 3, char = '0') {
    return (Array.from({ length: numChars }).fill(char).join('') + str).slice(-1 * numChars)
}

export function getAyatId(ayat: Ayat) {
    let suraSerial = padLeft((ayat.suraIdx + 1).toString(), 3);
    let ayatSerialInSura = padLeft(ayat.serialInSura.toString(), 3);

    return suraSerial + ayatSerialInSura;
}

export function getDefaultSettings(): SettingsModel {
    let navLang = navigator.languages[navigator.languages.length - 1] ?? 'en';

    return {
        readingMode: ReadingMode.Ruku_By_Ruku,
        quranFont: 'hafs',
        hideQuranText: false,
        translations: [translationList.filter(f => f.language == navLang)[0]],
        tafsirs: [],
        recitaions: recitationList.filter(f => f.id == 'Alafasy_128kbps')
    }
}

export function getStoredNavData(): NavigationModel {
    const storedNavDataString = localStorage.getItem('NavigationData');
    const storedNavData: NavigationModel = storedNavDataString ? JSON.parse(storedNavDataString)
        : {
            navMode: NavigationMode.Ruku,
            serial: 1,
            ayat: 1
        };

    return storedNavData;
}

