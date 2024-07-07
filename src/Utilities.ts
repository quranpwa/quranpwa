import { Ayat } from "./QuranData";
import languageDictionary from "./assets/language-dictionary.json"

export function groupBy<T>(arr: T[], fn: (item: T) => any) {
    return arr.reduce<Record<string, T[]>>((prev, curr) => {
        const groupKey = fn(curr);
        const group = prev[groupKey] || [];
        group.push(curr);
        return { ...prev, [groupKey]: group };
    }, {});
}

export function sum(arr: number[]): number {
    return arr.reduce((prev, curr) => prev + curr, 0);
}

export function padLeft(str: string, numChars = 3, char = '0') {
    return (Array.from({ length: numChars }).fill(char).join('') + str).slice(-1 * numChars)
}

export function getAyatId(ayat: Ayat) {
    let suraSerial = padLeft((ayat.suraIdx + 1).toString(), 3);
    let ayatSerialInSura = padLeft(ayat.serialInSura.toString(), 3);

    return suraSerial + ayatSerialInSura;
}

export function getLanguageName(languageCode: string) {
    //let languageNames = new Intl.DisplayNames(['en'], {type: 'language'});
    //return languageNames.of(languageCode);

    return languageDictionary[languageCode]?.name ?? languageCode;
}

export function secondsToTimeString(totalSeconds:number): string {
    const totalHours = totalSeconds / 3600;
    const hoursPart = Math.floor(totalHours);

    const minutes = (totalHours - hoursPart) * 60;
    const minutePart = Math.floor(minutes);

    const secondPart = Math.round((minutes - minutePart) * 60);

    if (hoursPart > 0){
        return hoursPart.toString().padStart(2,'0') + ":" +  
        minutePart.toString().padStart(2,'0') + ":" + 
        secondPart.toString().padStart(2,'0');
    } else{
        return minutePart.toString().padStart(2,'0') + ":" + 
        secondPart.toString().padStart(2,'0');
    }
}