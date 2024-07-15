import { Recitation, Translation } from '../QuranData';
import { groupBy } from '../Utilities';
import recitationList from '../assets/recitation-list.json';
import tafsirList from '../assets/tafsir-list.json';
import translationList from '../assets/translation-list.json';
import wbwTranslationList from '../assets/wbw-translation-list.json';
import ThemeSwitch from './ThemeSwitch';
import { Link } from 'react-router-dom';
import { getDefaultSettings } from '../StoredData';
import TranslationList from './TranslationList';
import RecitationList from './RecitationList';
import { FaSlidersH } from 'react-icons/fa';

function SettingsPanel({ settingsData, onChange }: SettingsPanelProps) {

    const handleReadingModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let selectedItem = event.target.value;
        const selectedReadingMode: ReadingMode = ReadingMode[selectedItem as keyof typeof ReadingMode];
        settingsData.readingMode = selectedReadingMode;
        onChange(settingsData);
    };

    const handleQuranFontChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let selectedItem = event.target.value;
        settingsData.quranFont = selectedItem;
        onChange(settingsData);
    };

    const handleShowQuranTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        settingsData.showQuranText = event.target.checked;
        onChange(settingsData);
    };

    const handleShowWbwChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        settingsData.showWbw = event.target.checked;
        onChange(settingsData);
    };

    const handleShowWbwTranslationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        settingsData.showWbwTranslation = event.target.checked;
        onChange(settingsData);
    };

    const handleShowTranslationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        settingsData.showTranslation = event.target.checked;
        onChange(settingsData);
    };

    const handleShowTafsirChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        settingsData.showTafsir = event.target.checked;
        onChange(settingsData);
    };

    const hasSettingsChanged = () => {
        return JSON.stringify(settingsData) != JSON.stringify(getDefaultSettings())
    };

    const handleResetSettings = () => {
        if (confirm('Your settings will be lost. Are you sure?')) {
            settingsData = getDefaultSettings();
            onChange(settingsData);
        }
    };

    const handleClearCache = () => {
        if (confirm('Cached data will be deleted. Are you sure?')) {
            caches.keys().then(keyList =>
                Promise.all(keyList.map(key => caches.delete(key)))
            ).finally(() => {
                location.reload();
            });
        }
    };

    const translationsGroupByLang = groupBy(translationList, x => x.language);
    const tafsirsGroupByLang = groupBy(tafsirList, x => x.language);

    return <div className="offcanvas offcanvas-end" id="offcanvasRight" data-bs-scroll="true" aria-labelledby="offcanvasRightLabel">
        <div className="offcanvas-header">
            <h4 id="offcanvasRightLabel">
                <FaSlidersH className="me-2" /> Settings
            </h4>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
            <h5>Translations
                <small className="badge bg-secondary mx-1" style={{ fontSize: '0.8rem' }}>Total: {translationList.length}</small>
                <small className="badge bg-secondary" style={{ fontSize: '0.8rem' }}>Languages: {Object.keys(translationsGroupByLang).length}</small>
            </h5>
            <TranslationList title='Translations'
                translationList={translationList}
                selectedTranslations={settingsData.translations}
                onChange={checkedTranslations => {
                    settingsData.translations = checkedTranslations;
                    onChange(settingsData)
                }} />
            <h5 className="mt-3">Word-by-Word
                <small className="badge bg-secondary mx-1" style={{ fontSize: '0.8rem' }}>Total: {wbwTranslationList.length}</small>
            </h5>
            <TranslationList title='Word-by-Word Translations'
                translationList={wbwTranslationList}
                selectedTranslations={settingsData.wbwTranslations}
                onChange={checkedWbwTranslations => {
                    settingsData.wbwTranslations = checkedWbwTranslations;
                    onChange(settingsData)
                }} />

            <h5 className="mt-3">Tafsirs
                <small className="badge bg-secondary mx-1" style={{ fontSize: '0.8rem' }}>Total: {tafsirList.length}</small>
                <small className="badge bg-secondary" style={{ fontSize: '0.8rem' }}>Languages: {Object.keys(tafsirsGroupByLang).length}</small>
            </h5>
            <TranslationList title='Tafsirs'
                translationList={tafsirList}
                selectedTranslations={settingsData.tafsirs}
                onChange={checkedTafsirs => {
                    settingsData.tafsirs = checkedTafsirs;
                    onChange(settingsData)
                }} />
            <hr />

            <h5 className="mt-3">Recitaions</h5>
            <RecitationList recitationList={recitationList}
                selectedRecitations={settingsData.recitaions}
                onChange={checkedRecitations => {
                    settingsData.recitaions = checkedRecitations;
                    onChange(settingsData)
                }} />
            <hr />

            <h5>Layout</h5>
            <div className="row">
                <label className="col-sm-5 col-form-label" htmlFor="ReadingModeSelect">Reading Mode</label>
                <div className="col-sm-7">
                    <select id="ReadingModeSelect" className="form-select"
                        value={ReadingMode[settingsData.readingMode]}
                        onChange={handleReadingModeChange}>
                        {Object.keys(ReadingMode).filter(f => isNaN(f as any)).map(item =>
                            <option key={item} value={item}>{item}</option>)}
                    </select>
                </div>

                <label className="col-sm-5 col-form-label" htmlFor="QuranFontSelect">Quran Font</label>
                <div className="col-sm-7">
                    <select id="QuranFontSelect" className="form-select"
                        value={settingsData.quranFont}
                        onChange={handleQuranFontChange}>
                        <option value="hafs">KFGQPC HAFS</option>
                        <option value="me_quran">Me Quran</option>
                        <option value="amiri_quran">Amiri Quran</option>
                        <option value="kitab">Kitab</option>
                        <option value="noorehidayat">Noore Hidayat</option>
                        <option value="noorehira">Noore Hira</option>
                        <option value="noorehuda">Noore Huda</option>
                    </select>
                </div>

                <div className='col-12 mt-3'>
                    <h6>Contents</h6>

                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="ShowQuranTextInput"
                            checked={settingsData.showQuranText}
                            onChange={handleShowQuranTextChange} />
                        <label className="form-check-label" htmlFor="ShowQuranTextInput">Show Quran Text</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="ShowWbwInput"
                            checked={settingsData.showWbw}
                            onChange={handleShowWbwChange} />
                        <label className="form-check-label" htmlFor="ShowWbwInput">Show Word By Word</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="showWbwTranslationInput"
                            checked={settingsData.showWbwTranslation}
                            onChange={handleShowWbwTranslationChange} />
                        <label className="form-check-label" htmlFor="showWbwTranslationInput">Show Word By Word Translation</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="showTranslationInput"
                            checked={settingsData.showTranslation}
                            onChange={handleShowTranslationChange} />
                        <label className="form-check-label" htmlFor="showTranslationInput">Show Translation</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="showTafsirInput"
                            checked={settingsData.showTafsir}
                            onChange={handleShowTafsirChange} />
                        <label className="form-check-label" htmlFor="showTafsirInput">Show Tafsir</label>
                    </div>
                </div>
            </div>
            <hr />

            <h5>Themes</h5>
            <ThemeSwitch />
            <hr />
            <button type="button"
                className={"btn btn-outline-danger border w-100 " + (hasSettingsChanged() ? "" : "disabled")}
                onClick={handleResetSettings}>
                Reset Settings
            </button>
            <button type="button"
                className="btn btn-outline-danger border w-100 mt-2"
                onClick={handleClearCache}>
                Clear Cache
            </button>
            <Link to="/about" className="btn btn-outline-info border w-100 mt-2">About Quran PWA</Link>
        </div>
    </div>;
}

export default SettingsPanel

export enum ReadingMode {
    Ayat_By_Ayat,
    Ruku_By_Ruku,
    //FullSura
}

export interface SettingsModel {
    readingMode: ReadingMode,
    showQuranText: boolean,
    showWbw: boolean,
    showWbwTranslation: boolean,
    showTranslation: boolean,
    showTafsir: boolean,
    quranFont: string,
    wbwTranslations: Translation[]
    translations: Translation[]
    tafsirs: Translation[]
    recitaions: Recitation[]
}

interface SettingsPanelProps {
    settingsData: SettingsModel,
    onChange: (model: SettingsModel) => void
}
