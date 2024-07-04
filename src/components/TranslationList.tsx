import { useState } from 'react';
import { Translation } from '../QuranData';
import { groupBy } from '../Utilities';
import { ReactSortable } from 'react-sortablejs';

function TranslationList({ translationList, selectedTranslations, onChange }: TranslationListProps) {
    const [items, setItems] = useState(selectedTranslations);

    const onSetList = (list: Translation[]) => {
        setItems(list);
        onChange(list);
    }

    const handleTranslationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let isChecked = event.target.checked;
        let _id = event.target.id;

        let _items = items;

        if (isChecked) {
            let item = translationList.find(f => f.id == _id);
            if (item) {
                _items.push(item);
            }
        } else {
            _items = selectedTranslations.filter(f => f.id != _id);
        }

        onSetList(_items);
    }

    let translationGroupByLanguage = groupBy(translationList, x => x.languageName);
    let translationCheckItems: JSX.Element[] = [];

    for (let languageName in translationGroupByLanguage) {
        let translations = translationGroupByLanguage[languageName] as Translation[];

        translationCheckItems.push(<h6 className="mt-3" key={languageName}>{languageName}</h6>);

        translations.forEach(translation =>
            translationCheckItems.push(
                <div key={translation.id} className="form-check">
                    <input className="form-check-input" type="checkbox" id={translation.id}
                        checked={selectedTranslations?.some(s => s.id === translation.id)}
                        onChange={handleTranslationChange} />
                    <label className="form-check-label" htmlFor={translation.id}>
                        {translation.languageName} - {translation.name}
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
        <ReactSortable list={items} setList={onSetList}
            tag="ul" className="list-group">
            {items.map((item) => (
                <li key={item.id} className="list-group-item"
                    style={{ cursor: 'move' }}>
                    {item.languageName} - {item.name}
                </li>
            ))}
        </ReactSortable>

        <button className='btn btn-outline-secondary w-100 mt-2'
            onClick={() => dialog.showModal()}>
            Select More
        </button>

        <dialog id="translationSelectionDialog"
            onClick={handleDialogClick}
            onClose={handleDialogClose}>
            <form method="dialog">
                <div className="d-flex justify-content-between">
                    <span id="ayatDetailDialogTitle" className="h5 pe-4"></span>
                    <button type="submit" className="btn-close bg-theme-text" value="close"></button>
                </div>
                {translationCheckItems}
                <div className="btn-toolbar mt-4" role="toolbar" aria-label="Toolbar with button groups">
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