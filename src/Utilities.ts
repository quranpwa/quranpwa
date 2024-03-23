export function groupBy<T>(arr: T[], fn: (item: T) => any) {
    return arr.reduce<Record<string, T[]>>((prev, curr) => {
        const groupKey = fn(curr);
        const group = prev[groupKey] || [];
        group.push(curr);
        return { ...prev, [groupKey]: group };
    }, {});
}

export function padLeft(str: string, numChars = 3, char = '0') {
    return (Array.from({ length: numChars }).fill(char).join('') + str).slice(-1 * numChars)
}