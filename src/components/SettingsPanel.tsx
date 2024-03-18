import ThemeSwitch from './ThemeSwitch';
import translationList from '../assets/translation-list.json'
import tafsirList from '../assets/tafsir-list.json'
import './SettingsPanel.css'
import { Translation } from '../QuranData';
import Select from 'react-select'

function SettingsPanel({ settingsModel, onChange }: SettingsPanelProps) {

    const handleReadingModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let selectedItem = event.target.value;
        const selectedReadingMode: ReadingMode = ReadingMode[selectedItem as keyof typeof ReadingMode];
        settingsModel.readingMode = selectedReadingMode;
        onChange(settingsModel);
    };

    const handleQuranFontChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let selectedItem = event.target.value;
        settingsModel.quranFont = selectedItem;
        onChange(settingsModel);
    };

    const translationItemsMapToSelectOption = (translationItems: Translation[]) => {
        return translationItems.map(t => {
            return {
                label: t.languageName + ' - ' + t.Name,
                value: t
            }
        })
    }

    return <div className="offcanvas offcanvas-end" id="offcanvasRight" data-bs-scroll="true" aria-labelledby="offcanvasRightLabel">
        <div className="offcanvas-header">
            <h4 id="offcanvasRightLabel">
                <img alt="Settings Icon" src="/images/settings.svg" width="20" className="me-2" />
                Settings
            </h4>
            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
            <h5>Themes</h5>
            <ThemeSwitch />
            <hr />
            <h5>Layout</h5>
            <div className="row">
                <label className="col-sm-4 col-form-label" htmlFor="ReadingModeSelect">Reading Mode</label>
                <div className="col-sm-8">
                    <select id="ReadingModeSelect" className="form-select"
                        value={ReadingMode[settingsModel.readingMode]}
                        onChange={handleReadingModeChange}>
                        {Object.keys(ReadingMode).filter(f => isNaN(f as any)).map(item =>
                            <option key={item} value={item}>{item}</option>)}
                    </select>
                </div>
            </div>
            <hr />
            <h5>Translations</h5>
            <Select isMulti
                options={translationItemsMapToSelectOption(translationList)}
                value={translationItemsMapToSelectOption(settingsModel.translations)}
                onChange={selectedOptions => {
                    settingsModel.translations = selectedOptions.map(m => m.value)
                    onChange(settingsModel)
                }} />
            <hr />
            <h5>Tafsirs</h5>
            <Select isMulti
                options={translationItemsMapToSelectOption(tafsirList)}
                value={translationItemsMapToSelectOption(settingsModel.tafsirs)}
                onChange={selectedOptions => {
                    settingsModel.tafsirs = selectedOptions.map(m => m.value)
                    onChange(settingsModel)
                }} />
            <hr />
            <h5>Quran Font</h5>
            <div className="row">
                <label className="col-sm-4 col-form-label" htmlFor="QuranFontSelect">Quran Font</label>
                <div className="col-sm-8">
                    <select id="QuranFontSelect" className="form-select"
                        value={settingsModel.quranFont}
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
}

interface SettingsPanelProps {
    settingsModel: SettingsModel,
    onChange: (model: SettingsModel) => void
}
