import { useRef } from 'react';
import { Recitation } from '../QuranData';
import { groupBy } from '../Utilities';
import { ReactSortable } from 'react-sortablejs';

function RecitationList({ recitationList, selectedRecitations, onChange }: RecitationListProps) {
    const dialogRef = useRef<any>();

    const handleSelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let isChecked = event.target.checked;
        let _id = event.target.id;

        let _items = selectedRecitations;

        if (isChecked) {
            let item = recitationList.find(f => f.id == _id);
            if (item) {
                _items.push(item);
            }
        } else {
            _items = selectedRecitations.filter(f => f.id != _id);
        }

        onChange(_items);
    }

    let recitationGroupByStyle = groupBy(recitationList, x => x.style);
    let recitationCheckItems: JSX.Element[] = [];

    for (let recitationStyle in recitationGroupByStyle) {
        let recitations = recitationGroupByStyle[recitationStyle] as Recitation[];

        recitationCheckItems.push(<h6 className="mt-3" key={recitationStyle}>{recitationStyle}</h6>);

        recitations.forEach(recitation =>
            recitationCheckItems.push(
                <div key={recitation.id} className="form-check">
                    <input className="form-check-input" type="checkbox" id={recitation.id}
                        checked={selectedRecitations?.some(s => s.id === recitation.id)}
                        onChange={handleSelectionChange} />
                    <label className="form-check-label" htmlFor={recitation.id}>{recitation.name}</label>
                    <small className='badge bg-secondary ms-2'>{recitation.byWBW ? 'WBW' : ''}</small>
                    <small className='badge bg-secondary ms-2'>{recitation.isFilePerVerse ? 'With Gap' : ''}</small>
                </div>
            ))
    }

    const handleDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
        if (event.target === dialogRef.current) { // to support closing by backdrop click
            dialogRef.current.close();
        }
    };
    const handleDialogClose = (/*event: React.MouseEvent<HTMLDialogElement>*/) => {
        if (dialogRef.current?.returnValue == 'ok') {
            //onChange(checkedRecitations)
        }
    };

    return <div>
        <ReactSortable list={selectedRecitations} setList={onChange}
            tag="ul" className="list-group"
            handle='.sortable-handle'>
            {selectedRecitations.map((item) => (
                <li key={item.id} className="list-group-item">
                    <span className='sortable-handle' style={{ cursor: 'move' }}> :↕️: </span>
                    {item.name} - {item.style}
                </li>
            ))}
        </ReactSortable>

        <button className='btn btn-outline-secondary w-100 mt-2'
            onClick={() => dialogRef.current?.showModal()}>
            Select More
        </button>

        <dialog ref={dialogRef}
            onClick={handleDialogClick}
            onClose={handleDialogClose}>
            <form method="dialog">
                <div className="d-flex justify-content-between">
                    <span id="ayatDetailDialogTitle" className="h5 pe-4">Reciters</span>
                    <button type="submit" className="btn-close bg-theme-text" value="close"></button>
                </div>
                {recitationCheckItems}
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

export default RecitationList

interface RecitationListProps {
    recitationList: Recitation[],
    selectedRecitations: Recitation[],
    onChange: (selectedRecitations: Recitation[]) => void
}