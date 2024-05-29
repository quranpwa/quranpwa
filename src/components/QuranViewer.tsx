import { Ayat, NavigationMode, QuranData } from '../QuranData';
import { groupBy } from '../Utilities';
import { storeBookmark } from '../StoredData';
import AudioPlayer from './AudioPlayer';
import { NavigationModel } from './NavBar';
import './QuranViewer.css';
import { ReadingMode, SettingsModel } from './SettingsPanel';
import SuraHeader from './SuraHeader';

function QuranViewer({ quranData, navData, settingsData, onNavigate, onAyatSelection }: QuranViewerProps) {

    const { start, end } = quranData.getAyatRangeByNavSerial(navData?.navMode, navData?.serial);
    let ayats: Ayat[] = quranData.ayats.slice(start, end);;
    let maxSerial = quranData.getMaxNavSerial(navData?.navMode);

    const selectedAyatSerial = navData.ayat;
    const dialog = document.getElementById("ayatDetailDialog") as HTMLDialogElement;

    const handleAyatSelection = (selectedAyat: number, isTranslation = false) => {
        onAyatSelection(selectedAyat, isTranslation);
    };

    const handleAyatNumberClick = (selectedAyatSerial: number) => {
        let ayatDetailDialogTitleElement = dialog.querySelector('#ayatDetailDialogTitle');
        if (ayatDetailDialogTitleElement) {
            let selectedAyat = ayats.filter(f => f.serial == selectedAyatSerial)[0];

            if (selectedAyat) {
                let sura = quranData.suras[selectedAyat.suraIdx];

                ayatDetailDialogTitleElement.textContent = `${sura.tname} [${sura.serial}:${selectedAyat.serialInSura}]`;
            }
        }

        dialog.showModal();
    };

    const handleAyatDetailDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
        if (event.target === dialog) { // to support closing by backdrop click
            dialog.close();
        }
    };

    const handleAyatDetailDialogClose = (/*event: React.MouseEvent<HTMLDialogElement>*/) => {
        if (dialog.returnValue == 'bookmark') {
            let selectedAyat = ayats.filter(f => f.serial == selectedAyatSerial)[0];

            if (selectedAyat) {
                let sura = quranData.suras[selectedAyat.suraIdx];
                storeBookmark({
                    displayText: `${sura.tname} [${sura.serial}:${selectedAyat.serialInSura}]`,
                    navData: navData,
                    date: new Date(),
                    link: location.pathname + location.search + location.hash
                });
            }
        }
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

    let contents: JSX.Element[] = [];

    if (settingsData?.readingMode == ReadingMode.Ayat_By_Ayat) {
        let keyA = 0;
        contents.push(<div key={keyA++}> {
            ayats.map(ayat => <div key={ayat.serial} id={ayat.serial.toString()}>
                {ayat.serialInSura == 1 && <SuraHeader quranData={quranData} suraIdx={ayat.suraIdx} />}
                <hr />
                <div className={selectedAyatSerial == ayat.serial ? 'selected-ayat' : ''}
                    onClick={() => handleAyatSelection(ayat.serial)}>
                    {!settingsData.hideQuranText &&
                        <div className="quran-text rtl">
                            <span style={{ fontFamily: settingsData.quranFont || 'hafs' }}>{ayat.arabicText}</span>
                            <span className="ayat-number" style={{ fontFamily: 'hafs' }}
                                onClick={() => handleAyatNumberClick(ayat.serial)}> {ayat.serialInSura.toLocaleString('ar-SA')} </span>
                        </div>
                    }
                    {quranData.translations.map(translation => {
                        if (translation.texts) {
                            const ayatTranslationText = translation.texts[ayat.serial - 1];
                            const translationMeta = translation.translationMeta;
                            return <div className="quran-translation ltr" key={translationMeta.fileName + ayat.serial}>
                                <div className="text-secondary small mt-3">{translationMeta.languageName + ' - ' + translationMeta.translator}</div>
                                <span className="translation-ayat-number"
                                    onClick={() => handleAyatNumberClick(ayat.serial)}>{ayat.serialInSura.toLocaleString(translationMeta.locale ?? undefined)}</span>
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
                    <SuraHeader quranData={quranData} suraIdx={rukuAyats[0].suraIdx} />}

                <h3 className="ruku-header text-secondary mt-2 ltr">Ruku-{ruku.serial}: {ruku.displayText}
                    <small className="text-nowrap">
                        <span className="emoji-icon ms-3" style={{ fontFamily: 'arial' }}>۝</span> {ruku.end - ruku.start} Ayats
                        <span className="emoji-icon ms-2">⏱️</span> {quranData.getReadingTime(ruku)}
                    </small>
                </h3>

                {!settingsData.hideQuranText &&
                    <div className={colClass + "ps-md-4 pt-md-4 quran-text mt-2"}>
                        {rukuAyats.map(ayat =>
                            <span id={ayat.serial.toString()} key={ayat.serial}
                                onClick={() => handleAyatSelection(ayat.serial)}
                                className={selectedAyatSerial == ayat.serial ? 'selected-ayat' : ''}>
                                <span style={{ fontFamily: settingsData.quranFont || 'hafs' }}
                                    onClick={() => handleAyatNumberClick(ayat.serial)}>{ayat.arabicText}</span>
                                <span className="ayat-number" style={{ fontFamily: 'hafs' }}> {(ayat.serialInSura.toLocaleString('ar-SA'))} </span>
                            </span>)}
                    </div>
                }
                {firstTranslation &&
                    <div className={colClass + "pe-md-4 quran-translation ltr"}>
                        <div className="text-secondary small">{firstTranslation.translationMeta.languageName + ' - ' + firstTranslation.translationMeta.translator}</div>
                        {
                            rukuAyats.map(ayat =>
                                <span id={'t' + ayat.serial} key={ayat.serial}
                                    onClick={() => handleAyatSelection(ayat.serial, true)}
                                    className={selectedAyatSerial == ayat.serial ? 'selected-ayat quran-translation' : 'quran-translation'}>
                                    <span className="translation-ayat-number"
                                        onClick={() => handleAyatNumberClick(ayat.serial)}>{ayat.serialInSura.toLocaleString(firstTranslation.translationMeta.locale ?? undefined)}</span>
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

    const navModeName = NavigationMode[navData.navMode];

    return <article className="container quran-viewer">
        {contents}

        <dialog id="ayatDetailDialog" onClick={handleAyatDetailDialogClick} onClose={handleAyatDetailDialogClose}>
            <form method="dialog">
                <div className="d-flex justify-content-between">
                    <span id="ayatDetailDialogTitle" className="h5"></span>
                    <button type="submit" className="btn-close bg-theme-text" value="close"></button>
                </div>
                <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                    <div className="btn-group me-2" role="group" aria-label="First group">
                        <button type="submit" className="btn btn-primary" value="bookmark">Bookmark this ayat</button>
                    </div>
                    <div className="btn-group" role="group" aria-label="Second group">

                    </div>
                </div>
            </form>
        </dialog>

        <div className="d-flex mt-3" style={{ justifyContent: 'center', marginBottom: '4rem' }}>
            <button className={'btn theme-colored border mx-2 ' + (navData.serial > 1 ? '' : 'disabled')} type="button"
                onClick={handlePrevious}>&lt; Previous {navModeName}</button>
            <button className={'btn theme-colored border mx-2 ' + (navData.serial < maxSerial ? '' : 'disabled')} type="button"
                onClick={handleNext}>Next {navModeName} &gt;</button>
        </div>

        <AudioPlayer quranData={quranData} settingsData={settingsData} ayats={ayats} selectedAyat={selectedAyatSerial}
            onPlayingAyatChanged={handlePlayingAyatChanged} />
    </article>;
}

export default QuranViewer

interface QuranViewerProps {
    quranData: QuranData,
    navData: NavigationModel,
    settingsData: SettingsModel,
    onNavigate: (model: NavigationModel) => void,
    onAyatSelection: (ayat: number, isTranslation?: boolean) => void
}
