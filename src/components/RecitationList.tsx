import { useState } from 'react';
import { Recitation } from '../QuranData';
import { groupBy } from '../Utilities';

function RecitationList({ recitationList, selectedRecitations, onChange }: RecitationListProps) {
    const [draggingItem, setDraggingItem] = useState<Recitation>();
    const [items, setItems] = useState(selectedRecitations);

    const handleRecitationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let isChecked = event.target.checked;
        let recitationId = event.target.id;

        let _items = items;

        if (isChecked) {
            if (!_items.some(s => s.id == recitationId)) {
                let recitation = recitationList.find(f => f.id == recitationId);
                if (recitation) {
                    _items.push(recitation);
                }
            }
        } else {
            _items = selectedRecitations.filter(f => f.id != recitationId);
        }
        setItems(_items);
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
                        onChange={handleRecitationChange} />
                    <label className="form-check-label" htmlFor={recitation.id}>{recitation.name}</label>
                    <small className='badge bg-secondary ms-2'>{recitation.byWBW ? 'WBW' : ''}</small>
                    <small className='badge bg-secondary ms-2'>{recitation.isFilePerVerse ? 'With Gap' : ''}</small>
                </div>
            ))
    }

    const dialog = document.getElementById("recitationSelectionDialog") as HTMLDialogElement;

    const handleDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
        if (event.target === dialog) { // to support closing by backdrop click
            dialog.close();
        }
    };
    const handleDialogClose = (/*event: React.MouseEvent<HTMLDialogElement>*/) => {
        if (dialog.returnValue == 'ok') {
            //onChange(checkedRecitations)
        }
    };

    const handleDragStart = (e, item) => {
        setDraggingItem(item);
        e.dataTransfer.setData('text/plain', '');
    };

    const handleDragEnd = () => {
        setDraggingItem(undefined);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, targetItem) => {
        if (!draggingItem) return;

        const currentIndex = items.indexOf(draggingItem);
        const targetIndex = items.indexOf(targetItem);

        if (currentIndex !== -1 && targetIndex !== -1) {
            items.splice(currentIndex, 1);
            items.splice(targetIndex, 0, draggingItem);
            setItems(items);
            onChange(items);
        }
    };

    return <div>
        <ul className="list-group">
            {items.map(item =>
                <li key={item.id}
                    className={"list-group-item " +
                        (item.id == draggingItem?.id ? 'opacity-50' : '')}
                    style={{ cursor: 'move' }}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, item)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, item)}>
                    {item.name} - {item.style}
                </li>)
            }
        </ul>

        <button className='btn btn-outline-primary w-100 mt-2'
            onClick={() => dialog.showModal()}>
            Select More
        </button>

        <dialog id="recitationSelectionDialog"
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