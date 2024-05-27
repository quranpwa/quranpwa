import { QuranData } from '../QuranData';

export const quran_karim_114_font_chars = '!"#$%&\'()*+,-./0123456789:;<=>?@aAbBcCdDEeFfgGHhIiJjKklLMmnNOopPQqRrsStTuUvVWwxXyYZz[\\]^_`{|}~¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ';

function SuraHeader({ quranData, suraIdx }: SuraHeaderProps) {

    let sura = quranData.suras[suraIdx];

    return <>
        <h2 className="sura-name-calligraphy">{quran_karim_114_font_chars[suraIdx]}</h2>
        <h2 className="sura-name-en ltr">{suraIdx + 1}. {sura.tname}</h2>
        <div className="text-nowrap text-center text-secondary ltr">
            <span className="emoji-icon me-1">{sura.type == 'Meccan' ? '🕋' : '🕌'}</span>
            {sura.ayas} Ayats
            <span className="emoji-icon ms-3 me-1">⏱️</span>{quranData.getReadingTime(sura)}
        </div>

        {suraIdx != 0 && suraIdx != 8 &&
            <div className="text-center">
                <img className="bismillah-calligraphy" alt="Bismillahir Rahmanir Rahim" src="/images/bismillah.svg" />
            </div>}
    </>
}

export default SuraHeader

interface SuraHeaderProps {
    quranData: QuranData,
    suraIdx: number
}
