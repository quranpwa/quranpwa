import { Translation } from '../QuranData';
import { groupBy } from '../Utilities';

function TranslationList({ translationList, selectedTranslations, onChange }: TranslationListProps) {

    const handleTranslationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let isChecked = event.target.checked;
        let translationFileName = event.target.id;

        let _selectedTranslations = selectedTranslations;

        if (isChecked) {
            if (!_selectedTranslations.some(s => s.fileName == translationFileName)) {
                let translation = translationList.find(f => f.fileName == translationFileName);
                if (translation) {
                    _selectedTranslations.push(translation);
                }
            }
        } else {
            _selectedTranslations = selectedTranslations.filter(f => f.fileName != translationFileName);
        }

        onChange(_selectedTranslations);
    }

    let translationGroupByLanguage = groupBy(translationList, x => x.languageName);
    let translationCheckItems: JSX.Element[] = [];

    for (let languageName in translationGroupByLanguage) {
        let translations = translationGroupByLanguage[languageName] as Translation[];

        translationCheckItems.push(<h6 className="mt-3" key={languageName}>{languageName}</h6>);

        translations.forEach(translation =>
            translationCheckItems.push(
                <div key={translation.fileName} className="form-check">
                    <input className="form-check-input" type="checkbox" id={translation.fileName}
                        checked={selectedTranslations?.some(s => s.fileName === translation.fileName)}
                        onChange={handleTranslationChange} />
                    <label className="form-check-label" htmlFor={translation.fileName}>
                        {translation.languageName} - {translation.Name}
                    </label>
                </div>
            ))

    }

    const dialog = document.getElementById("translationSelectionDialog") as HTMLDialogElement;

    const handleDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
        if (event.target === dialog) { // to support closing by backdrop click
            dialog.close();
        }
    };
    const handleDialogClose = (/*event: React.MouseEvent<HTMLDialogElement>*/) => {
        if (dialog.returnValue == 'ok') {
            //onChange(checkedTranslations)
        }
    };

    return <div>
        <ul className="list-group">
            {selectedTranslations.map(translation =>
                <li key={translation.fileName} className="list-group-item">
                    {translation.languageName} - {translation.Name}
                </li>)
            }
        </ul>

        <button className='btn btn-outline-primary w-100 mt-2'
            onClick={() => dialog.showModal()}>
            Select More
        </button>

        <dialog id="translationSelectionDialog"
            onClick={handleDialogClick}
            onClose={handleDialogClose}>
            <form method="dialog">
                <div className="d-flex justify-content-between">
                    <span id="ayatDetailDialogTitle" className="h5 pe-4 pb-3"></span>
                    <button type="submit" className="btn-close bg-theme-text" value="close"></button>
                </div>
                {translationCheckItems}
                <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                    <div className="btn-group me-2" role="group" aria-label="First group">
                        <button type="submit" className="btn btn-primary" value="ok">OK</button>
                    </div>
                    <div className="btn-group" role="group" aria-label="Second group">
                        <button type="submit" className="btn btn-secondary" value="close">Close</button>
                    </div>
                </div>
            </form>
        </dialog>
    </div>;
}

export default TranslationList

interface TranslationListProps {
    translationList: Translation[],
    selectedTranslations: Translation[],
    onChange: (selectedTranslations: Translation[]) => void
}

