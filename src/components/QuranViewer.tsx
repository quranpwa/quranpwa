import { useState } from 'react';
import { Ayat, Corpus, NavigationMode, QuranData } from '../QuranData';
import { storeBookmark } from '../StoredData';
import { groupBy } from '../Utilities';
import AudioPlayer from './AudioPlayer';
import { NavigationModel } from './NavBar';
import './QuranViewer.css';
import { ReadingMode, SettingsModel } from './SettingsPanel';
import SuraHeader from './SuraHeader';
import { FaBookmark, FaTimes } from 'react-icons/fa';

function QuranViewer({ quranData, navData, settingsData, onNavigate, onAyatSelection }: QuranViewerProps) {

    const [selectedAyatCorpus, setSelectedAyatCorpus] = useState<Corpus[]>([]);

    const { start, end } = quranData.getAyatRangeByNavSerial(navData?.navMode, navData?.serial);
    let ayats: Ayat[] = quranData.ayats.slice(start, end);;
    let maxSerial = quranData.getMaxNavSerial(navData?.navMode);

    const selectedAyatSerial = navData.ayat;
    const dialog = document.getElementById("ayatDetailDialog") as HTMLDialogElement;

    const handleAyatSelection = (_selectedAyatSerial: number, isTranslation = false) => {
        onAyatSelection(_selectedAyatSerial, isTranslation);
    };

    const handleAyatNumberClick = (_selectedAyatSerial: number) => {
        let ayatDetailDialogTitleElement = dialog.querySelector('#ayatDetailDialogTitle');
        if (ayatDetailDialogTitleElement) {
            let selectedAyat = ayats.filter(f => f.serial == _selectedAyatSerial)[0];

            if (selectedAyat) {
                let sura = quranData.suras[selectedAyat.suraIdx];

                ayatDetailDialogTitleElement.textContent = `${sura.tname} [${sura.serial}:${selectedAyat.serialInSura}]`;

                setSelectedAyatCorpus(quranData.corpus.filter(f => f.surah == sura.serial
                    && f.ayah == selectedAyat.serialInSura));
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
            onNavigate(navData);
        }
    };

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePlayingAyatChanged = (ayat: Ayat, isTranslation?: boolean) => {
        onAyatSelection(ayat?.serial, isTranslation);
    };

    const getWbwAyatText = (ayatCorpus: Corpus[], showWbwTranslation: boolean) => {
        return ayatCorpus.map(c => <span className="text-center my-3"
            key={c.surah + '_' + c.ayah + '_' + c.word}
            id={'word_' + c.surah + '_' + c.ayah + '_' + c.word}>
            <span className="quran-text">{c.ar1 + c.ar2 + c.ar3 + c.ar4 + c.ar5 + ' '}</span>
            {showWbwTranslation && quranData.wbwTranslations.length > 0 &&
                <span className="d-block px-1" style={{ borderRight: 'solid 1px gray' }}>
                    {quranData.wbwTranslations.map(translation =>
                        <span key={c.surah + '_' + c.ayah + '_' + c.word + translation.translationMeta.language} className="d-block">
                            {translation.texts[c.idx]}
                        </span>
                    )}
                </span>
            }
        </span>);
    }

    let contents: JSX.Element[] = [];

    if (settingsData?.readingMode == ReadingMode.Ayat_By_Ayat) {
        let keyA = 0;
        contents.push(<div key={keyA++}> {
            ayats.map(ayat => <div key={ayat.serial}>
                {ayat.serialInSura == 1 && <SuraHeader quranData={quranData} suraIdx={ayat.suraIdx} />}
                <hr />
                <div id={ayat.serial.toString()}
                    className={selectedAyatSerial == ayat.serial ? 'selected-ayat' : 'ayat'}
                    onClick={() => handleAyatSelection(ayat.serial)}>
                    {settingsData.showQuranText && !settingsData.showWbw &&
                        <div className="quran-text rtl">
                            <span style={{ fontFamily: settingsData.quranFont || 'hafs' }}>{ayat.arabicText}</span>
                            <span className="ayat-number"
                                onClick={() => handleAyatNumberClick(ayat.serial)}>{ayat.serialInSura.toLocaleString('ar-SA')}</span>
                        </div>

                    }
                    {settingsData.showQuranText && settingsData.showWbw &&
                        <div className="d-flex flex-wrap rtl">
                            {getWbwAyatText(quranData.corpus.filter(f => f.surah == ayat.suraIdx + 1
                                && f.ayah == ayat.serialInSura), settingsData.showWbwTranslation)}
                            <span className="ayat-number quran-text my-3 px-1"
                                onClick={() => handleAyatNumberClick(ayat.serial)}>{ayat.serialInSura.toLocaleString('ar-SA')}</span>
                        </div>
                    }
                    {settingsData.showTranslation && quranData.translations.map(translation => {
                        if (translation.texts) {
                            const ayatTranslationText = translation.texts[ayat.serial - 1];
                            const translationMeta = translation.translationMeta;
                            return <div className="quran-translation ltr" key={translationMeta.id + ayat.serial}>
                                <div className="text-secondary small mt-3">{translationMeta.name}</div>
                                <span className="translation-ayat-number"
                                    onClick={() => handleAyatNumberClick(ayat.serial)}>{ayat.serialInSura.toLocaleString(translationMeta.language ?? undefined)}</span>
                                {ayatTranslationText}
                            </div>
                        }
                    })}
                </div>

                {settingsData.showTafsir && quranData.tafsirs.map(tafsirs => {
                    if (tafsirs.texts) {
                        const ayatTafsirText = tafsirs.texts[ayat.serial - 1];
                        const translationMeta = tafsirs.translationMeta;
                        return <div className="quran-translation ltr" key={translationMeta.id + ayat.serial}>
                            <div className="text-secondary small mt-3">{translationMeta.name}</div>
                            <span className="translation-ayat-number">{ayat.serialInSura.toLocaleString(translationMeta.language ?? undefined)}</span>
                            <pre style={{ textWrap: 'wrap' }} dangerouslySetInnerHTML={{ __html: ayatTafsirText }}></pre>
                        </div>
                    }
                })}

            </div>)
        } </div>);
    } else if (settingsData?.readingMode == ReadingMode.Ruku_By_Ruku) {

        let ayatsGroupByRuku = groupBy(ayats, x => x.rukuIdx);
        let firstTranslation = quranData.translations[0];
        let colClass = settingsData.showQuranText && firstTranslation ? "col-md-6 " : "col-md-12 ";

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

                {settingsData.showQuranText &&
                    <div className={colClass + "ps-md-4 pt-md-4 mt-2"} style={{ textAlign: 'justify' }}>
                        {rukuAyats.map(ayat =>
                            <span id={ayat.serial.toString()} key={ayat.serial}
                                onClick={() => handleAyatSelection(ayat.serial)}
                                className={(selectedAyatSerial == ayat.serial ? 'selected-ayat' : 'ayat') + (settingsData.showWbwTranslation ? ' d-flex flex-wrap' : '')}>
                                {!settingsData.showWbw &&
                                    <span className='quran-text' style={{ fontFamily: settingsData.quranFont || 'hafs' }}>{ayat.arabicText} </span>
                                }
                                {settingsData.showWbw &&
                                    getWbwAyatText(quranData.corpus.filter(f => f.surah == ayat.suraIdx + 1
                                        && f.ayah == ayat.serialInSura), settingsData.showWbwTranslation)
                                }
                                <span className="ayat-number"
                                    onClick={() => handleAyatNumberClick(ayat.serial)}>{(ayat.serialInSura.toLocaleString('ar-SA'))}</span>
                            </span>)}
                    </div>
                }
                {settingsData.showTranslation && firstTranslation &&
                    <div className={colClass + "pe-md-4 quran-translation ltr"}>
                        <div className="text-secondary small">{firstTranslation.translationMeta.name}</div>
                        {
                            rukuAyats.map(ayat =>
                                <span id={'t' + ayat.serial} key={ayat.serial}
                                    onClick={() => handleAyatSelection(ayat.serial, true)}
                                    className={selectedAyatSerial == ayat.serial ? 'selected-ayat quran-translation' : 'ayat quran-translation'}>
                                    <span className="translation-ayat-number"
                                        onClick={() => handleAyatNumberClick(ayat.serial)}>{ayat.serialInSura.toLocaleString(firstTranslation.translationMeta.language ?? undefined)}</span>
                                    {firstTranslation.texts[ayat.serial - 1]}
                                </span>)
                        }
                    </div>
                }
                {settingsData.showTafsir &&
                    <div className="col-md-12 quran-translation ltr"> {rukuAyats.map(ayat =>
                        <div key={ayat.serial}>
                            {quranData.tafsirs.map(tafsir => {
                                if (tafsir.texts) {
                                    const ayatTafsirText = tafsir.texts[ayat.serial - 1];
                                    const translationMeta = tafsir.translationMeta;

                                    return <div className="quran-translation" key={translationMeta.id + ayat.serial}>
                                        <span className="translation-ayat-number">{ayat.serialInSura.toLocaleString(translationMeta.language ?? undefined)}</span>
                                        <pre style={{ textWrap: 'wrap' }} dangerouslySetInnerHTML={{ __html: ayatTafsirText }}></pre>
                                    </div>
                                }
                            })}
                        </div>)}
                    </div>
                }
            </div>);
        }
    }

    const navModeName = NavigationMode[navData.navMode];

    return <article className="container quran-viewer">
        {contents}

        <dialog id="ayatDetailDialog" onClick={handleAyatDetailDialogClick} onClose={handleAyatDetailDialogClose}>
            <form method="dialog">
                <div className="dialog-header d-flex justify-content-between">
                    <span id="ayatDetailDialogTitle" className="fs-5"></span>
                    <button type="submit" className="btn-close bg-theme-text" value="close"></button>
                </div>
                {selectedAyatCorpus.length > 0 &&
                    <div className="dialog-content d-flex flex-wrap rtl pb-3">
                        {getWbwAyatText(selectedAyatCorpus, true)}
                    </div>
                }
                <div className="dialog-footer btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                    <div className="btn-group me-2" role="group" aria-label="First group">
                        <button type="submit" className="btn btn-primary" value="bookmark"><FaBookmark /> Bookmark</button>
                    </div>
                    <div className="btn-group" role="group" aria-label="Second group">
                        <button type="submit" className="btn btn-secondary" value="close"><FaTimes /> Close</button>
                    </div>
                </div>
            </form>
        </dialog>

        <div className="d-flex mt-3" style={{ justifyContent: 'center', marginBottom: '4rem' }}>
            <button className={'btn theme-colored border mx-2 ' + (navData.serial > 1 ? '' : 'disabled')} type="button"
                onClick={handlePrevious}>← Previous {navModeName}</button>
            <button className='btn theme-colored border' type="button"
                onClick={handleScrollToTop}>↑</button>
            <button className={'btn theme-colored border mx-2 ' + (navData.serial < maxSerial ? '' : 'disabled')} type="button"
                onClick={handleNext}>Next {navModeName} →</button>
        </div>

        <AudioPlayer quranData={quranData} settingsData={settingsData} ayats={ayats} selectedAyatSerial={selectedAyatSerial}
            onPlayingAyatChanged={handlePlayingAyatChanged} />
    </article>;
}

export default QuranViewer

interface QuranViewerProps {
    quranData: QuranData,
    navData: NavigationModel,
    settingsData: SettingsModel,
    onNavigate: (navData: NavigationModel) => void,
    onAyatSelection: (ayat: number, isTranslation?: boolean) => void
}