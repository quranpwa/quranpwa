import { Ayat, NavigationMode, QuranData } from '../QuranData';
import { groupBy } from '../Utilities';
import { NavigationModel } from './NavBar';
import { ReadingMode, SettingsModel } from './SettingsPanel';
import AudioPlayer from './AudioPlayer';

function QuranViewer({ quranData, navData, settingsData, onNavigate, onAyatSelection }: QuranViewerProps) {

    const { start, end } = quranData.getAyatRangeByNavSerial(navData?.navMode, navData?.serial);
    let ayats: Ayat[] = quranData.ayats.slice(start, end);;
    let maxSerial = quranData.getMaxNavSerial(navData?.navMode);

    const selectedAyatSerial = navData.ayat;

    const handleAyatSelection = (selectedAyat: number) => {
        onAyatSelection(selectedAyat);
    };

    const handleNext = () => {
        if (navData.serial < maxSerial) {
            navData.serial++;
            onNavigate(navData)
        }
    };

    const handlePrevious = () => {
        if (navData.serial > 1) {
            navData.serial--;
            onNavigate(navData)
        }
    };

    const handlePlayingAyatChanged = (ayat: Ayat) => {
        onAyatSelection(ayat?.serial);
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

    if (settingsData?.readingMode == ReadingMode.Ayat_By_Ayat) {
        let keyA = 0;
        contents.push(<div key={keyA++}> {
            ayats.map(ayat => <div key={ayat.serial}>
                {ayat.serialInSura == 1 && suraHeader(ayat.suraIdx)}

                <div className={selectedAyatSerial == ayat.serial ? 'selected-ayat p-2' : 'p-2'}
                    onClick={() => handleAyatSelection(ayat.serial)}>
                    {!settingsData.hideQuranText &&
                        <div className="quran-text rtl" style={{ fontFamily: settingsData.quranFont || 'hafs' }}>
                            <span>{ayat.arabicText}</span>
                            <span> {ayat.serialInSura.toLocaleString('ar-SA')} </span>
                        </div>
                    }
                    {quranData.translations.map(translation => {
                        if (translation.texts) {
                            const ayatTranslationText = translation.texts[ayat.serial - 1];
                            const translationMeta = translation.translationMeta;
                            return <div className="quran-translation ltr" key={translationMeta.fileName + ayat.serial}>
                                <div className="text-secondary small mt-3">{translationMeta.languageName + ' - ' + translationMeta.translator}</div>
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
                            <div className="text-secondary small mt-3">{translationMeta.languageName + ' - ' + translationMeta.translator}</div>
                            <span className="translation-ayat-number">{ayat.serialInSura.toLocaleString(translationMeta.locale ?? undefined)}</span>
                            <pre style={{ textWrap: 'wrap' }} dangerouslySetInnerHTML={{ __html: ayatTafsirText }}></pre>
                        </div>
                    }
                })}

            </div>)
        } </div>);
    } else if (settingsData?.readingMode == ReadingMode.Ruku_By_Ruku) {

        let ayatsGroupByRuku = groupBy(ayats, x => x.rukuIdx);
        let firstTranslation = quranData.translations[0];
        let colClass = !settingsData.hideQuranText && firstTranslation ? "col-md-6 " : "col-md-12 ";

        for (let rukuIdx in ayatsGroupByRuku) {
            let ruku = quranData.rukus[+rukuIdx];
            let rukuAyats = ayatsGroupByRuku[rukuIdx] as Ayat[];

            contents.push(<div className="row rtl" key={contents.length}>
                {rukuAyats[0].serialInSura == 1 &&
                    suraHeader(rukuAyats[0].suraIdx)
                }
                <h3 className="ruku-header text-secondary mt-2">Ruku-{ruku.serial}: {ruku.displayText}</h3>
                {!settingsData.hideQuranText &&
                    <div className={colClass + "ps-md-4 pt-md-4 quran-text mt-2"} style={{ fontFamily: settingsData.quranFont || 'hafs' }}>
                        {rukuAyats.map(ayat =>
                            <span key={ayat.serial}
                                onClick={() => handleAyatSelection(ayat.serial)}
                                className={selectedAyatSerial == ayat.serial ? 'selected-ayat' : ''}>
                                <span>{ayat.arabicText}</span>
                                <span> {(ayat.serialInSura.toLocaleString('ar-SA'))} </span>
                            </span>)}
                    </div>
                }
                {firstTranslation &&
                    <div className={colClass + "pe-md-4 quran-translation ltr"}>
                        <div className="text-secondary small">{firstTranslation.translationMeta.languageName + ' - ' + firstTranslation.translationMeta.translator}</div>
                        {
                            rukuAyats.map(ayat =>
                                <span key={ayat.serial}
                                    onClick={() => handleAyatSelection(ayat.serial)}
                                    className={selectedAyatSerial == ayat.serial ? 'selected-ayat quran-translation' : 'quran-translation'}>
                                    <span className="translation-ayat-number">{ayat.serialInSura.toLocaleString(firstTranslation.translationMeta.locale ?? undefined)}</span>
                                    {firstTranslation.texts[ayat.serial - 1]}
                                </span>)
                        }
                    </div>
                }

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

    const navModeName = NavigationMode[navData.navMode];
    let prevButtonClasses = 'btn theme-colored border mx-2 ' + (navData.serial > 1 ? '' : 'disabled');
    let nextButtonClasses = 'btn theme-colored border mx-2 ' + (navData.serial < maxSerial ? '' : 'disabled');

    return <article className="container">
        {contents}

        <div className="d-flex mt-3" style={{ justifyContent: 'center', marginBottom: '4rem' }}>
            <button className={prevButtonClasses} type="button" onClick={handlePrevious}>&lt; Previous {navModeName}</button>
            <button className={nextButtonClasses} type="button" onClick={handleNext}>Next {navModeName} &gt;</button>
        </div>

        <AudioPlayer quranData={quranData} ayats={ayats} selectedAyat={selectedAyatSerial}
            onPlayingAyatChanged={handlePlayingAyatChanged}
        />
    </article >;
}

export default QuranViewer

interface QuranViewerProps {
    quranData: QuranData,
    navData: NavigationModel,
    settingsData: SettingsModel,
    onNavigate: (model: NavigationModel) => void,
    onAyatSelection: (ayat: number) => void
}
