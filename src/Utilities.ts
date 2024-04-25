import { ReadingMode, SettingsModel } from "./components/SettingsPanel"; import translationList from './assets/translation-list.json'
import recitationList from './assets/recitation-list.json'

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

