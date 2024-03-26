import ThemeSwitch from './ThemeSwitch';
import translationList from '../assets/translation-list.json'
import tafsirList from '../assets/tafsir-list.json'
import recitationList from '../assets/recitation-list.json'
import './SettingsPanel.css'
import { Recitaion, Translation } from '../QuranData';
import Select from 'react-select'
import { getDefaultSettings } from '../Utilities';

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

    const hasSettingsChanged = () => {
        return JSON.stringify(settingsData) != JSON.stringify(getDefaultSettings())
    };

    const handleResetSettings = () => {
        settingsData = getDefaultSettings()
        onChange(settingsData);
    };

    const translationItemsMapToSelectOption = (translationItems: Translation[]) => {
        return translationItems.map(t => {
            return {
                label: t.languageName + ' - ' + t.Name,
                value: t
            }
        })
    }

    const recitaionsMapToSelectOption = (recitaions: Recitaion[]) => {
        return recitaions.map(t => {
            return {
                label: t.name,
                value: t
            }
        })
    }

    return <div className="offcanvas offcanvas-end" id="offcanvasRight" data-bs-scroll="true" aria-labelledby="offcanvasRightLabel">
        <div className="offcanvas-header">
            <h4 id="offcanvasRightLabel">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-sliders2 me-2" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M10.5 1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4H1.5a.5.5 0 0 1 0-1H10V1.5a.5.5 0 0 1 .5-.5M12 3.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m-6.5 2A.5.5 0 0 1 6 6v1.5h8.5a.5.5 0 0 1 0 1H6V10a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5M1 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 8m9.5 2a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V13H1.5a.5.5 0 0 1 0-1H10v-1.5a.5.5 0 0 1 .5-.5m1.5 2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
                </svg>
                Settings
            </h4>
            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
            <h5>Themes</h5>
            <ThemeSwitch />
            <hr />
            <h5>Translations</h5>
            <Select isMulti
                options={translationItemsMapToSelectOption(translationList)}
                value={translationItemsMapToSelectOption(settingsData.translations)}
                onChange={selectedOptions => {
                    settingsData.translations = selectedOptions.map(m => m.value)
                    onChange(settingsData)
                }} />
            <h5 className="mt-3">Tafsirs</h5>
            <Select isMulti
                options={translationItemsMapToSelectOption(tafsirList)}
                value={translationItemsMapToSelectOption(settingsData.tafsirs)}
                onChange={selectedOptions => {
                    settingsData.tafsirs = selectedOptions.map(m => m.value)
                    onChange(settingsData)
                }} />
            <hr />
            <h5 className="mt-3">Recitaions</h5>
            <Select isMulti
                options={recitaionsMapToSelectOption(recitationList)}
                value={recitaionsMapToSelectOption(settingsData.recitaions || recitationList.filter(f => f.id == 'Alafasy_128kbps'))}
                onChange={selectedOptions => {
                    settingsData.recitaions = selectedOptions.map(m => m.value)
                    onChange(settingsData)
                }} />
            <hr />
            <h5>Layout</h5>
            <div className="row">
                <label className="col-sm-4 col-form-label" htmlFor="ReadingModeSelect">Reading Mode</label>
                <div className="col-sm-8">
                    <select id="ReadingModeSelect" className="form-select"
                        value={ReadingMode[settingsData.readingMode]}
                        onChange={handleReadingModeChange}>
                        {Object.keys(ReadingMode).filter(f => isNaN(f as any)).map(item =>
                            <option key={item} value={item}>{item}</option>)}
                    </select>
                </div>
            </div>
            <h5 className="mt-3">Quran Font</h5>
            <div className="row">
                <label className="col-sm-4 col-form-label" htmlFor="QuranFontSelect">Quran Font</label>
                <div className="col-sm-8">
                    <select id="QuranFontSelect" className="form-select"
                        value={settingsData.quranFont}
                        onChange={handleQuranFontChange}>
                        <option value="hafs">KFGQPC Uthmanic Script HAFS</option>
                        <option value="me_quran">Me Quran</option>
                        <option value="amiri_quran">Amiri Quran</option>
                        <option value="kitab">Kitab</option>
                        <option value="noorehidayat">Noore Hidayat</option>
                        <option value="noorehira">Noore Hira</option>
                        <option value="noorehuda">Noore Huda</option>
                    </select>
                </div>
            </div>
            <hr />
            <button type="button"
                className={hasSettingsChanged() ? "btn btn-danger border" : "btn btn-danger border disabled"}
                onClick={handleResetSettings}>
                Reset Settings
            </button>
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
    quranFont: string,
    translations: Translation[]
    tafsirs: Translation[]
    recitaions: Recitaion[]
}

interface SettingsPanelProps {
    settingsData: SettingsModel,
    onChange: (model: SettingsModel) => void
}
