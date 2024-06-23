import { NavigationMode, NavigationShortcutItem } from "./QuranData";
import { NavigationModel } from "./components/NavBar";
import recitationList from './assets/recitation-list.json';
import translationList from './assets/translation-list.json';
import wbwTranslationList from './assets/wbw-translation-list.json';
import { ReadingMode, SettingsModel } from "./components/SettingsPanel";

const navDataStorageKey = 'NavigationData';

export function getStoredNavData(): NavigationModel {
    const storedNavDataString = localStorage.getItem(navDataStorageKey);
    const storedNavData: NavigationModel = storedNavDataString ? JSON.parse(storedNavDataString)
        : {
            navMode: NavigationMode.Sura,
            serial: 1,
            ayat: 1
        };

    return storedNavData;
}

export function storeNavData(navData: NavigationModel) {
    localStorage.setItem(navDataStorageKey, JSON.stringify(navData));
}

export function getDefaultSettings(): SettingsModel {
    let navLang = navigator.languages[navigator.languages.length - 1] ?? 'en';
    navLang = navLang.substring(0, 2);
    
    let translation = translationList.filter(f => f.language == navLang)[0];
    let wbwTranslation = wbwTranslationList.filter(f => f.language == navLang)[0];

    return {
        readingMode: ReadingMode.Ayat_By_Ayat,
        quranFont: 'hafs',
        showQuranText: true,
        showWbw: false,
        showWbwTranslation: false,
        showTranslation: true,
        showTafsir: false,
        translations: translation ? [translation] : [],
        wbwTranslations: wbwTranslation ? [wbwTranslation] : [],
        tafsirs: [],
        recitaions: recitationList.filter(f => f.id == 'mishari_alafasy')
    }
}

const settingsDataStorageKey = 'SettingsData';

export function getStoredSettingsData(): SettingsModel {
    const storedSettingsDataString = localStorage.getItem(settingsDataStorageKey);
    const settingsData: SettingsModel = storedSettingsDataString ? JSON.parse(storedSettingsDataString)
        : getDefaultSettings()

    return settingsData;
}

export function storeSettingsData(settingsData: SettingsModel) {
    localStorage.setItem(settingsDataStorageKey, JSON.stringify(settingsData));
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