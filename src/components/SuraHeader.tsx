import { QuranData } from '../QuranData';

export const quran_karim_114_font_chars = '!"#$%&\'()*+,-./0123456789:;<=>?@aAbBcCdDEeFfgGHhIiJjKklLMmnNOopPQqRrsStTuUvVWwxXyYZz[\\]^_`{|}~¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ';

function SuraHeader({ quranData, suraIdx }: SuraHeaderProps) {

    let sura = quranData.suras[suraIdx];

    return <div className="col-12">
        <h2 className="sura-name-calligraphy">{quran_karim_114_font_chars[suraIdx]}</h2>
        <h2 className="sura-name-en ltr">{suraIdx + 1}. {sura.tname}</h2>
        <div className="row text-secondary ltr">
            <div className="col-6 col-md-3"><span className="emoji-icon">{sura.type == 'Meccan' ? '🕋' : '🕌'}</span> {sura.type}</div>
            <div className="col-6 col-md-3"><span className="emoji-icon" style={{ fontFamily: 'arial' }}>۝</span> {sura.ayas} Ayats</div>
            <div className="col-6 col-md-3"><span className="emoji-icon">🔃</span> {sura.rukus} Ruku{sura.rukus > 1 ? 's' : ''}</div>
            <div className="col-6 col-md-3"><span className="emoji-icon">⏱️</span> {quranData.getReadingTime(sura)}</div>
        </div>

        {suraIdx != 0 && suraIdx != 8 &&
            <div className="text-center">
                <img className="bismillah-calligraphy" alt="Bismillahir Rahmanir Rahim" src="/images/bismillah.svg" />
            </div>}
    </div>
}

export default SuraHeader

interface SuraHeaderProps {
    quranData: QuranData,
    suraIdx: number
}
