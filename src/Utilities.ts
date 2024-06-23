import { Ayat } from "./QuranData";

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
