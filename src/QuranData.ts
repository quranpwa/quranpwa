import quranData from './assets/quran-data.json'
import { NavigationModel } from './components/NavBar';
import { sum } from './Utilities';

export class QuranData {

    suras: Sura[];
    manzils: AyatRange[];
    juzs: AyatRange[];
    hizb: AyatRange[];
    hizb_quarters: AyatRange[];
    rukus: AyatRange[];
    pages: AyatRange[];

    sajdas: Sajdah[];

    ayats: Ayat[] = [];
    corpus: Corpus[] = [];
    wbwTranslations: WbwTranslationWithData[] = [];
    translations: TranslationWithData[] = [];
    tafsirs: TranslationWithData[] = [];
    recitations: RecitaionWithData[] = [];

    constructor() {
        this.suras = this.getSuras();

        this.manzils = [];// this.getAyatRange(quranData.manzils);
        this.juzs = this.getAyatRange(quranData.juzs);
        this.hizb = this.getAyatRange(this.transformHizbQuarterToHizb(quranData.hizb_quarters));
        this.hizb_quarters = this.getAyatRange(quranData.hizb_quarters);
        this.rukus = this.getAyatRange(quranData.rukus);
        this.pages = this.getAyatRange(quranData.pages);

        this.sajdas = this.getSajdas();
    }

    private getSuras(): Sura[] {
        const r: Sura[] = [];
        let serial = 1;
        for (const sura of quranData.suras) {
            r.push({
                serial: serial++,
                start: +sura[0],
                ayas: +sura[1],
                order: +sura[2],
                rukus: +sura[3],
                name: sura[4].toString(),
                tname: sura[5].toString(),
                ename: sura[6].toString(),
                type: sura[7].toString(),
                end: +sura[0] + +sura[1]
            });
        }
        return r;
    }

    private getSajdas(): Sajdah[] {
        const r: Sajdah[] = [];
        for (const sajda of quranData.sajdas) {
            r.push({
                surah: +sajda[0],
                ayah: +sajda[1],
                recommended: sajda[2] === 'recommended' ? true : false,
                obligatory: sajda[2] === 'obligatory' ? true : false
            });
        }
        return r;
    }

    private getAyatRange(segments: number[][]): AyatRange[] {
        const r: AyatRange[] = [];
        for (let i = 0; i < segments.length; i++) {
            const [startingSuraNumber, segmentStartAyat] = segments[i];

            let startingSura = this.suras[startingSuraNumber - 1];

            let thisSegmentStart = startingSura.start + segmentStartAyat - 1;
            let thisSegmentEnd = 6236;

            if (i < segments.length - 1) {
                let [nextSegmentSuraNumber, nextSegmentStartAyat] = segments[i + 1];
                let nextSegmentSura = this.suras[nextSegmentSuraNumber - 1];
                let nextSegmentSuraStart = nextSegmentSura.start;

                thisSegmentEnd = nextSegmentSuraStart + nextSegmentStartAyat - 1;
            }

            r.push({
                serial: i + 1,
                start: thisSegmentStart,
                end: thisSegmentEnd,
                displayText: `${startingSura.tname} [${startingSura.serial}:${segmentStartAyat}]`
            });
        }
        return r;
    }

    private transformHizbQuarterToHizb(hizbQuarters: number[][]): number[][] {
        let hizb: number[][] = []

        for (let i = 0; i < hizbQuarters.length; i += 4) {
            hizb.push(hizbQuarters[i])
        }

        return hizb;
    }

    getMaxNavSerial(navMode: NavigationMode) {
        let maxSerial = 0;

        if (navMode == NavigationMode.Sura) {
            maxSerial = this.suras.length;

        } else if (navMode == NavigationMode.Juz) {
            maxSerial = this.juzs.length;

        } else if (navMode == NavigationMode.Hizb) {
            maxSerial = this.hizb.length;

        } else if (navMode == NavigationMode.Rub) {
            maxSerial = this.hizb_quarters.length;

        } else if (navMode == NavigationMode.Ruku) {
            maxSerial = this.rukus.length;

        } else if (navMode == NavigationMode.Page) {
            maxSerial = this.pages.length;
        }

        return maxSerial;
    }

    getAyatRangeByNavSerial(navMode: NavigationMode, serial: number): { start: number, end: number, displayText: string } {
        let start = 0;
        let end = 7;
        let displayText = '';

        if (navMode == NavigationMode.Sura) {
            const sura = serial > this.suras.length ? this.suras[0] : this.suras[serial - 1];
            start = sura?.start;
            end = sura?.start + sura?.ayas;
            displayText = sura?.tname;

        } else if (navMode == NavigationMode.Juz) {
            const jus = serial > this.juzs.length ? this.juzs[0] : this.juzs[serial - 1];
            start = jus?.start;
            end = jus?.end;
            displayText = jus?.displayText;

        } else if (navMode == NavigationMode.Hizb) {
            const hizb = serial > this.hizb.length ? this.hizb[0] : this.hizb[serial - 1];
            start = hizb?.start;
            end = hizb?.end;
            displayText = hizb?.displayText;

        } else if (navMode == NavigationMode.Rub) {
            const hizb = serial > this.hizb_quarters.length ? this.hizb_quarters[0] : this.hizb_quarters[serial - 1];
            start = hizb?.start;
            end = hizb?.end;
            displayText = hizb?.displayText;

        } else if (navMode == NavigationMode.Ruku) {
            const ruku = serial > this.rukus.length ? this.rukus[0] : this.rukus[serial - 1];
            start = ruku?.start;
            end = ruku?.end;
            displayText = ruku?.displayText;

        } else if (navMode == NavigationMode.Page) {
            const page = serial > this.pages.length ? this.pages[0] : this.pages[serial - 1];
            start = page?.start;
            end = page?.end;
            displayText = page?.displayText;
        }

        return { start: start, end: end, displayText: displayText };
    }

    async setAyats() {

        if (this.ayats.length >= 6236)
            return;

        let response = await fetch(`./quran-texts/quran.json`);
        let quranTexts = await response.json();

        let serial = 1;
        let serialInSura = 1;

        for (let quranText of quranTexts) {
            let sura = this.suras.filter(f => serial >= f.start && serial <= f.end)[0];
            let juz = this.juzs.filter(f => serial >= f.start && serial <= f.end)[0];
            let hizb = this.hizb_quarters.filter(f => serial >= f.start && serial <= f.end)[0];
            let page = this.pages.filter(f => serial >= f.start && serial <= f.end)[0];
            let ruku = this.rukus.filter(f => serial >= f.start && serial <= f.end)[0];

            if (this.ayats.length > 0
                && this.ayats[this.ayats.length - 1]?.suraIdx != sura.serial - 1) {
                serialInSura = 1;
            }

            this.ayats.push({
                serial: serial++,
                arabicText: quranText,
                suraIdx: sura.serial - 1,
                serialInSura: serialInSura++,
                juzIdx: juz.serial - 1,
                hizbIdx: hizb.serial - 1,
                pageIdx: page.serial - 1,
                rukuIdx: ruku.serial - 1,
                charLength: quranText.length
            });
        }
    }

    async setCorpus() {

        if (this.corpus.length >= 77439)
            return;

        let response = await fetch(`./corpus/corpus.csv`);
        let corpusCsv = await response.text();

        const corpusTextLines = corpusCsv.split(/\r\n|\n/);
        const [, ...lines] = corpusTextLines;
        let idx = 0;

        lines.map((line: string) => {
            const values = line.split(',')
            this.corpus.push({
                idx: idx++,
                surah: +values[0],
                ayah: +values[1],
                word: +values[2],
                ar1: values[3],
                ar2: values[4],
                ar3: values[5],
                ar4: values[6],
                ar5: values[7],
                pos1: values[8],
                pos2: values[9],
                pos3: values[10],
                pos4: values[11],
                pos5: values[12],
                count: +values[13],
                root_ar: values[14],
                lemma: values[15],
                verb_type: values[16],
                verb_form: values[17]
            });
        })
    }

    setWbwTranslations(wbwTranslations: WbwTranslation[], updateUI: () => void) {
        if (!wbwTranslations) {
            this.wbwTranslations = [];
            return;
        }

        this.wbwTranslations = this.wbwTranslations.filter(f =>
            wbwTranslations.some(s => s.fileName === f.translationMeta.fileName));

        let notFetchedTranslations = wbwTranslations.filter(f =>
            !this.wbwTranslations.some(s => s.translationMeta.fileName === f.fileName));

        notFetchedTranslations.forEach(translation => {
            fetch(`./corpus/${translation.fileName}.txt`)
                .then<string>(response => response.text())
                .then(text => {
                    if (!this.wbwTranslations.some(s => s.translationMeta.fileName === translation.fileName)) {

                        const texts = text.split(/\r\n|\n/);

                        this.wbwTranslations.push({ translationMeta: translation, texts: texts });

                        const isLastTranslationToFetch = notFetchedTranslations.indexOf(translation) == notFetchedTranslations.length - 1;
                        if (isLastTranslationToFetch)
                            updateUI();
                    }
                })
                .catch(error => console.error(error));
        });

        if (notFetchedTranslations.length == 0)
            updateUI();

    }

    setTranslations(translations: Translation[], updateUI: () => void) {
        if (!translations) {
            this.translations = [];
            return;
        }

        this.translations = this.translations.filter(f =>
            translations.some(s => s.fileName === f.translationMeta.fileName));

        let notFetchedTranslations = translations.filter(f =>
            !this.translations.some(s => s.translationMeta.fileName === f.fileName));

        notFetchedTranslations.forEach(translation => {
            fetch(`./translations/${translation.fileName}.json`)
                .then<string[]>(response => response.json())
                .then(texts => {
                    if (!this.translations.some(s => s.translationMeta.fileName === translation.fileName)) {

                        this.translations.push({ translationMeta: translation, texts: texts });

                        const isLastTranslationToFetch = notFetchedTranslations.indexOf(translation) == notFetchedTranslations.length - 1;
                        if (isLastTranslationToFetch)
                            updateUI();
                    }
                })
                .catch(error => console.error(error));
        });

        if (notFetchedTranslations.length == 0)
            updateUI();

    }

    setTafsirs(tafsirs: Translation[], updateUI: () => void) {
        if (!tafsirs) {
            this.tafsirs = [];
            return;
        }

        this.tafsirs = this.tafsirs.filter(f =>
            tafsirs.some(s => s.fileName === f.translationMeta.fileName));

        let notFetchedTafsirs = tafsirs.filter(f =>
            !this.tafsirs.some(s => s.translationMeta.fileName === f.fileName));

        notFetchedTafsirs.forEach(translation => {
            fetch(`./tafsirs/${translation.fileName}.json`)
                .then<string[]>(response => response.json())
                .then(texts => {
                    if (!this.tafsirs.some(s => s.translationMeta.fileName === translation.fileName)) {

                        this.tafsirs.push({ translationMeta: translation, texts: texts });

                        const isLastTranslationToFetch = notFetchedTafsirs.indexOf(translation) == notFetchedTafsirs.length - 1;
                        if (isLastTranslationToFetch)
                            updateUI();
                    }
                })
                .catch(error => console.error(error));
        });

        if (notFetchedTafsirs.length == 0)
            updateUI();
    }

    setRecitations(recitations: Recitaion[]) {
        if (!recitations) {
            this.recitations = [];
            return;
        }

        this.recitations = this.recitations.filter(f =>
            recitations.some(s => s.id === f.recitaionMeta.id));

        let notFetchedRecitationTimings = recitations.filter(f =>
            !this.recitations.some(s => s.recitaionMeta.id === f.id));

        notFetchedRecitationTimings.forEach(recitation => {
            if (recitation.isFilePerSura) {
                fetch(`./recitaion-timings/${recitation.id}.json`)
                    .then(response => response.json())
                    .then(fullTimingArray => {
                        if (!this.recitations.some(s => s.recitaionMeta.id === recitation.id)) {
                            let timings: RecitaionTiming[] = [];

                            for (var i = 0; i < fullTimingArray.length; i++) {
                                let [sura, ayat, time, wordTimings] = fullTimingArray[i];

                                timings.push({ sura: sura, ayat: ayat, time: time, wordTimings: wordTimings });
                            }

                            this.recitations.push({ recitaionMeta: recitation, timings: timings });
                        }
                    })
                    .catch(error => console.error(error));
            } else {
                this.recitations.push({ recitaionMeta: recitation, timings: [] });
            }
        });
    }

    getReadingTimeInSecond(ayatRange: Sura | AyatRange) {
        if (!ayatRange.readingTimeInSecond) {
            let ayats: Ayat[] = this.ayats.slice(ayatRange.start, ayatRange.end);

            ayatRange.charLength = sum(ayats.map(m => m.charLength));

            const charPerSecond = 6.4;
            ayatRange.readingTimeInSecond = ayatRange.charLength / charPerSecond;
        }

        return ayatRange.readingTimeInSecond;
    }

    getReadingTime(ayatRange: Sura | AyatRange) {
        let readingTimeInSecond = this.getReadingTimeInSecond(ayatRange);

        if (readingTimeInSecond < 60) {
            let timeunit = readingTimeInSecond > 1 ? ' seconds' : ' second';
            return Math.ceil(readingTimeInSecond) + timeunit;
        }
        else {
            let readingTimeInMinute = readingTimeInSecond / 60
            let timeunit = readingTimeInMinute > 1 ? ' minutes' : ' minute';
            return Math.ceil(readingTimeInMinute) + timeunit;
        }
    }

    static get instance(): QuranData {
        const globalQuranData = "globalQuranData";

        if (!(window as any)[globalQuranData])
            (window as any)[globalQuranData] = new QuranData();

        return (window as any)[globalQuranData]
    }
}

export interface Sura {
    serial: number,
    start: number,
    end: number,
    ayas: number,
    order: number,
    rukus: number,
    name: string,
    tname: string,
    ename: string,
    type: string,
    charLength?: number,
    readingTimeInSecond?: number
}

export interface AyatRange {
    serial: number,
    start: number,
    end: number,
    displayText: string,
    charLength?: number
    readingTimeInSecond?: number
}

interface Sajdah {
    surah: number,
    ayah: number,
    recommended: boolean,
    obligatory: boolean
}

export interface Translation {
    Name: string,
    languageName: string,
    translator: string,
    fileName: string,
    language: string,
    locale: string | null,
}

export interface TranslationWithData {
    translationMeta: Translation,
    texts: string[]
}

export interface WbwTranslation {
    name: string,
    fileName: string,
    language: string,
}

export interface WbwTranslationWithData {
    translationMeta: WbwTranslation,
    texts: string[]
}

export interface Ayat {
    serial: number,
    serialInSura: number,
    arabicText: string,
    suraIdx: number,
    juzIdx: number,
    hizbIdx: number,
    pageIdx: number,
    rukuIdx: number,
    charLength: number,
}

export interface Corpus {
    idx: number
    surah: number,
    ayah: number,
    word: number,
    ar1: string,
    ar2: string,
    ar3: string,
    ar4: string,
    ar5: string,
    pos1: string,
    pos2: string,
    pos3: string,
    pos4: string,
    pos5: string,
    count: number,
    root_ar: string,
    lemma: string,
    verb_type: string,
    verb_form: string
}

export interface Recitaion {
    id: string,
    name: string,
    language: string,
    url: string,
    byWBW: boolean,
    isFilePerVerse: boolean,
    isFilePerSura: boolean,
    style: string,
    hasFileNameLeadingZeros?: boolean
}

export interface RecitaionTiming {
    sura: number,
    ayat: number,
    time: number,
    wordTimings: [number[]]
}

export interface RecitaionWithData {
    recitaionMeta: Recitaion,
    timings: RecitaionTiming[]
}

export enum NavigationMode {
    Sura,
    Juz,
    Hizb,
    Rub,
    Ruku,
    Page,
}

export enum NavigationShortcutType {
    Recents,
    Bookmarks,
    QuickLinks,
}

export interface NavigationShortcutItem {
    displayText: string,
    navData: NavigationModel,
    link: string,
    date: Date
}
