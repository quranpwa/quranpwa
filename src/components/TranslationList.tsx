import { useRef } from 'react';
import { Translation } from '../QuranData';
import { getLanguageName, groupBy } from '../Utilities';
import { ReactSortable } from 'react-sortablejs';
import { FaCheck, FaTimes } from 'react-icons/fa';

function TranslationList({ title, translationList, selectedTranslations, onChange }: TranslationListProps) {
    const dialogRef = useRef<any>();

    const handleSelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let isChecked = event.target.checked;
        let _id = event.target.id;

        let _items = selectedTranslations;

        if (isChecked) {
            let item = translationList.find(f => f.id == _id);
            if (item) {
                _items.push(item);
            }
        } else {
            _items = selectedTranslations.filter(f => f.id != _id);
        }

        onChange(_items);
    }

    let translationGroupByLanguage = groupBy(translationList, x => x.language);
    let translationCheckItems: JSX.Element[] = [];

    for (let language in translationGroupByLanguage) {
        let translations = translationGroupByLanguage[language] as Translation[];

        translationCheckItems.push(<h6 className="mt-3" key={language}>{getLanguageName(language)}</h6>);

        translations.forEach(translation =>
            translationCheckItems.push(
                <div key={translation.id} className="form-check">
                    <input className="form-check-input" type="checkbox" id={translation.id}
                        checked={selectedTranslations?.some(s => s.id === translation.id)}
                        onChange={handleSelectionChange} />
                    <label className="form-check-label" htmlFor={translation.id}>
                        {translation.name}
                    </label>
                </div>
            ))
    }

    const handleDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
        if (event.target === dialogRef.current) { // to support closing by backdrop click
            dialogRef.current?.close();
        }
    };
    const handleDialogClose = (/*event: React.MouseEvent<HTMLDialogElement>*/) => {
        if (dialogRef.current.returnValue == 'ok') {
            //onChange(checkedTranslations)
        }
    };

    return <div>
        <ReactSortable list={selectedTranslations} setList={onChange}
            tag="ul" className="list-group"
            handle='.sortable-handle'>
            {selectedTranslations.map((item) => (
                <li key={item.id} className="btn-group">
                    <button className='sortable-handle btn theme-colored border' style={{ flex: 0, cursor: 'move' }}>:↕️:</button>
                    <span className='btn theme-colored border' style={{ cursor: 'default' }}>{item.name}</span>
                    <button className='btn theme-colored border' style={{ flex: 0 }}
                        onClick={() => { onChange(selectedTranslations.filter(f => f.id != item.id)) }}>-</button>
                </li>
            ))}
        </ReactSortable>

        <button className='btn btn-outline-secondary w-100'
            onClick={() => dialogRef.current?.showModal()}>
            Select More
        </button>

        <dialog ref={dialogRef}
            onClick={handleDialogClick}
            onClose={handleDialogClose}>
            <form method="dialog">
                <div className="dialog-header d-flex justify-content-between">
                    <span className="fs-5">{title}</span>
                    <button type="submit" className="btn-close bg-theme-text" value="close"></button>
                </div>
                <div className="dialog-content">
                    {translationCheckItems}
                </div>
                <div className="dialog-footer d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary" value="ok"><FaCheck /> OK</button>
                    <button type="submit" className="btn btn-secondary ms-2" value="close"><FaTimes /> Close</button>
                </div>
            </form>
        </dialog>
    </div>;
}

export default TranslationList

interface TranslationListProps {
    title: string
    translationList: Translation[],
    selectedTranslations: Translation[],
    onChange: (selectedTranslations: Translation[]) => void
}