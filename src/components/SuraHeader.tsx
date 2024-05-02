import { QuranData } from '../QuranData';

export const quran_karim_114_font_chars = '!"#$%&\'()*+,-./0123456789:;<=>?@aAbBcCdDEeFfgGHhIiJjKklLMmnNOopPQqRrsStTuUvVWwxXyYZz[\\]^_`{|}~¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ';

function SuraHeader({ quranData, suraIdx }: SuraHeaderProps) {

    let sura = quranData.suras[suraIdx];

    return <>
        <h2 className="sura-name-calligraphy">{quran_karim_114_font_chars[suraIdx]}</h2>
        <h2 className="sura-name-en ltr">{suraIdx + 1}. Sura {sura.tname}</h2>
        <div className="sura-info text-center text-secondary ltr">{sura.type} | Ayats: {sura.ayas}</div>

        {suraIdx != 0 && suraIdx != 8 &&
            <p className="bismillah-arabic">{quranData.ayats[0].arabicText}</p>}
    </>
}

export default SuraHeader

interface SuraHeaderProps {
    quranData: QuranData,
    suraIdx: number
}
