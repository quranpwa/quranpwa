import { Translation } from '../QuranData';
import { groupBy } from '../Utilities';

function TranslationCheckList({ translationList, checkedTranslations, onChange }: TranslationCheckListProps) {

    const handleTranslationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let isChecked = event.target.checked;
        let translationFileName = event.target.id;

        let _checkedTranslations = checkedTranslations;

        if (isChecked) {
            if (!_checkedTranslations.some(s => s.id == translationFileName)) {
                let translation = translationList.find(f => f.id == translationFileName);
                if (translation) {
                    _checkedTranslations.push(translation);
                }
            }
        } else {
            _checkedTranslations = checkedTranslations.filter(f => f.id != translationFileName);
        }

        onChange(_checkedTranslations);
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
                        checked={checkedTranslations?.some(s => s.id === translation.id)}
                        onChange={handleTranslationChange} />
                    <label className="form-check-label" htmlFor={translation.id}>
                        {translation.languageName} - {translation.name}
                    </label>
                </div>
            ))

    }

    return <div>
        {translationCheckItems}
    </div>;
}

export default TranslationCheckList

interface TranslationCheckListProps {
    translationList: Translation[],
    checkedTranslations: Translation[],
    onChange: (checkedTranslations: Translation[]) => void
}
