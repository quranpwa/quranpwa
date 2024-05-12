import { Ayat, NavigationMode, NavigationShortcutItem } from "./QuranData";
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

export function sum(arr: number[]): number {
    return arr.reduce((prev, curr) => prev + curr, 0);
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
            navMode: NavigationMode.Sura,
            serial: 1,
            ayat: 1
        };

    return storedNavData;
}

const recentlyReadsStorageKey = 'RecentlyReads';

export function getStoredRecentlyReads(): NavigationShortcutItem[] {
    const storedRecentlyReadsString = localStorage.getItem(recentlyReadsStorageKey);
    const storedRecentlyReads: NavigationShortcutItem[] = storedRecentlyReadsString ? JSON.parse(storedRecentlyReadsString) : [];

    return storedRecentlyReads;
}

export function storeRecentlyRead(item: NavigationShortcutItem) {
    let storedRecentlyReads: NavigationShortcutItem[] = getStoredRecentlyReads();

    storedRecentlyReads = storedRecentlyReads.filter(s => s.navData?.navMode != item.navData?.navMode
        && s.navData?.serial != item.navData?.serial);

    storedRecentlyReads.unshift(item);

    if (storedRecentlyReads.length > 10)
        storedRecentlyReads.pop();

    localStorage.setItem(recentlyReadsStorageKey, JSON.stringify(storedRecentlyReads));
}

const bookmarkStorageKey = 'Bookmarks';

export function getStoredBookmarks(): NavigationShortcutItem[] {
    const storedBookmarksString = localStorage.getItem(bookmarkStorageKey);
    const storedBookmarks: NavigationShortcutItem[] = storedBookmarksString ? JSON.parse(storedBookmarksString) : [];

    return storedBookmarks;
}

export function storeBookmark(item: NavigationShortcutItem) {
    let storedRecentlyReads: NavigationShortcutItem[] = getStoredBookmarks();

    storedRecentlyReads.unshift(item);

    localStorage.setItem(bookmarkStorageKey, JSON.stringify(storedRecentlyReads));
}