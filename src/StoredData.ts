import { NavigationMode, NavigationShortcutItem } from "./QuranData";
import { NavigationModel } from "./components/NavBar";

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