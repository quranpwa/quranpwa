import { useState } from 'react';
import { QuranData, Ayat } from '../QuranData';
import { groupBy } from '../Utilities';
import { NavigationMode, NavigationModel } from './NavBar';
import { ReadingMode, SettingsModel } from './SettingsPanel';

function QuranViewer({ quranData, navigationModel, settingsModel, onAyatSelection }: QuranViewerProps) {
    const [selectedAyat, setSelectedAyat] = useState<number>(navigationModel.ayat?.serial);

    let ayats: Ayat[] = [];

    if (navigationModel?.navMode == NavigationMode.Sura) {
        ayats = quranData.ayats.slice(navigationModel?.sura.start, navigationModel?.sura.start + navigationModel?.sura.ayas);
    } else if (navigationModel?.navMode == NavigationMode.Juz) {
        ayats = quranData.ayats.slice(navigationModel?.juz.start, navigationModel?.juz.end);
    } else if (navigationModel?.navMode == NavigationMode.Hizb) {
        ayats = quranData.ayats.slice(navigationModel?.hizb.start, navigationModel?.hizb.end);
    } else if (navigationModel?.navMode == NavigationMode.Ruku) {
        ayats = quranData.ayats.slice(navigationModel?.ruku.start, navigationModel?.ruku.end);
    } else if (navigationModel?.navMode == NavigationMode.Page) {
        ayats = quranData.ayats.slice(navigationModel?.page.start, navigationModel?.page.end);
    }

    const handleAyatSelection = (selectedAyat: Ayat) => {
        setSelectedAyat(selectedAyat.serial);
        onAyatSelection(selectedAyat);
    };

    let quran_karim_114_font_chars = '!"#$%&\'()*+,-./0123456789:;<=>?@aAbBcCdDEeFfgGHhIiJjKklLMmnNOopPQqRrsStTuUvVWwxXyYZz[\\]^_`{|}~¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ';

    let contents: JSX.Element[] = [];

    const suraHeader = (suraIdx: number) => {
        let sura = quranData.suras[suraIdx];
        return <>
            <h2 className="sura-name-calligraphy">{quran_karim_114_font_chars[suraIdx]}</h2>
            <h2 className="sura-name-en ltr">{suraIdx + 1}. Sura {sura.tname}</h2>
            <div className="sura-info text-center text-secondary ltr">{sura.type} | Ayats: {sura.ayas}</div>

            {suraIdx != 0 && suraIdx != 8 &&
                <p className="bismillah-arabic">{quranData.ayats[0].arabicText}</p>}
        </>
    }

    if (settingsModel?.readingMode == ReadingMode.Ayat_By_Ayat) {
        let keyA = 0;
        contents.push(<div key={keyA++}> {
            ayats.map(ayat => <div key={ayat.serial}>
                {ayat.serialInSura == 1 && suraHeader(ayat.suraIdx)}

                <div className={selectedAyat == ayat.serial ? 'selected-ayat p-2' : 'p-2'}
                    onClick={() => handleAyatSelection(ayat)}>
                    <div className="quran-text rtl" style={{ fontFamily: settingsModel.quranFont || 'hafs' }}>
                        <span>{ayat.arabicText}</span>
                        <span>{ayat.serialInSura.toLocaleString('ar-SA')}</span>
                    </div>

                    {quranData.translations.map(translation => {
                        if (translation.texts) {
                            const ayatTranslationText = translation.texts[ayat.serial - 1];
                            const translationMeta = translation.translationMeta;
                            return <div className="quran-translation ltr" key={translationMeta.fileName + ayat.serial}>
                                <div className="text-secondary small mt-3">{translationMeta.translator}</div>
                                <span className="translation-ayat-number">{ayat.serialInSura.toLocaleString(translationMeta.locale ?? undefined)}</span>
                                {ayatTranslationText}
                            </div>
                        }
                    })}
                </div>

                {quranData.tafsirs.map(tafsirs => {
                    if (tafsirs.texts) {
                        const ayatTafsirText = tafsirs.texts[ayat.serial - 1];
                        const translationMeta = tafsirs.translationMeta;
                        return <div className="quran-translation ltr" key={translationMeta.fileName + ayat.serial}>
                            <div className="text-secondary small mt-3">{translationMeta.translator}</div>
                            <span className="translation-ayat-number">{ayat.serialInSura.toLocaleString(translationMeta.locale ?? undefined)}</span>
                            <pre style={{ textWrap: 'wrap' }} dangerouslySetInnerHTML={{ __html: ayatTafsirText }}></pre>
                        </div>
                    }
                })}

            </div>)
        } </div>);
    } else if (settingsModel?.readingMode == ReadingMode.Ruku_By_Ruku) {

        let ayatsGroupByRuku = groupBy(ayats, x => x.rukuIdx);

        for (let rukuIdx in ayatsGroupByRuku) {
            let ruku = quranData.rukus[+rukuIdx];
            let rukuAyats = ayatsGroupByRuku[rukuIdx] as Ayat[];

            contents.push(<div className="row rtl" key={contents.length}>
                {rukuAyats[0].serialInSura == 1 &&
                    suraHeader(rukuAyats[0].suraIdx)
                }
                <h3 className="ruku-header text-secondary mb-3">Ruku-{ruku.serial}: {ruku.displayText}</h3>
                <div className="col-md-6 ps-md-4 quran-text" style={{ fontFamily: settingsModel.quranFont || 'hafs' }}>
                    {rukuAyats.map(ayat =>
                        <span key={ayat.serial}
                            onClick={() => handleAyatSelection(ayat)}
                            className={selectedAyat == ayat.serial ? 'selected-ayat' : ''}>
                            <span>{ayat.arabicText}</span>
                            <span> {(ayat.serialInSura.toLocaleString('ar-SA'))} </span>
                        </span>)}
                </div>

                <div className="col-md-6 pe-md-4 quran-translation ltr"> {rukuAyats.map(ayat =>
                    <span key={ayat.serial}
                        onClick={() => handleAyatSelection(ayat)}
                        className={selectedAyat == ayat.serial ? 'selected-ayat' : ''}>
                        {quranData.translations.map(translation => {
                            if (translation.texts) {
                                const ayatTranslationText = translation.texts[ayat.serial - 1];
                                const translationMeta = translation.translationMeta;

                                return <span className="quran-translation" key={translationMeta.fileName + ayat.serial}>
                                    <span className="translation-ayat-number">{ayat.serialInSura.toLocaleString(translationMeta.locale ?? undefined)}</span>
                                    {ayatTranslationText}
                                </span>
                            }
                        })}
                    </span>)}
                </div>

                <div className="col-md-12 quran-translation ltr"> {rukuAyats.map(ayat =>
                    <div key={ayat.serial}>
                        {quranData.tafsirs.map(tafsir => {
                            if (tafsir.texts) {
                                const ayatTafsirText = tafsir.texts[ayat.serial - 1];
                                const translationMeta = tafsir.translationMeta;

                                return <div className="quran-translation" key={translationMeta.fileName + ayat.serial}>
                                    <span className="translation-ayat-number">{ayat.serialInSura.toLocaleString(translationMeta.locale ?? undefined)}</span>
                                    <pre style={{ textWrap: 'wrap' }} dangerouslySetInnerHTML={{ __html: ayatTafsirText }}></pre>
                                </div>
                            }
                        })}
                    </div>)}
                </div>
            </div>);
        }
    }

    console.info('QuranViewer has been rendered.');

    return <article className="container">
        {contents}
    </article>;
}

export default QuranViewer

interface QuranViewerProps {
    quranData: QuranData,
    navigationModel: NavigationModel,
    settingsModel: SettingsModel,
    onAyatSelection: (ayat: Ayat) => void
}
