import React, { useReducer, useState } from 'react';
import { Ayat, QuranData, RecitaionTiming } from '../QuranData';
import { getAyatId, padLeft } from '../Utilities';
import { ReadingMode, SettingsModel } from './SettingsPanel';

function AudioPlayer({ quranData, settingsData, ayats, selectedAyat, onPlayingAyatChanged }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [recitationIdx, setRecitationIdx] = useState<number>(0)
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const getAudioUrl = (): string => {

        let recitation = quranData.recitations[recitationIdx];
        if (!recitation || !ayats?.length)
            return '';

        let recitationMeta = recitation.recitaionMeta;
        let startingAyat = ayats[selectedAyat - ayats[0].serial] || ayats[0];

        if (recitationMeta.isFilePerVerse) {
            let ayatId = getAyatId(startingAyat)

            return `${recitationMeta.url}/${ayatId}.mp3`;
        }
        else if (recitationMeta.isFilePerSura) {
            let suraSerial = padLeft((startingAyat.suraIdx + 1).toString(), 3);

            return `${recitationMeta.url}/${suraSerial}.mp3`;
        }
        else return ''
    };

    const handlePlayClick = (/*event: React.MouseEvent<HTMLButtonElement>*/) => {
        setIsPlaying(true);
        let audio = document.getElementsByTagName('audio').item(0) as HTMLAudioElement;

        let recitation = quranData.recitations[recitationIdx];
        if (recitation?.recitaionMeta?.isFilePerSura) {
            let timing: RecitaionTiming;
            if (recitation.recitaionMeta.byWBW) {
                timing = recitation.timings[selectedAyat - 1];
            } else {
                let suraIdx = ayats[0].suraIdx
                timing = recitation.timings[selectedAyat - 1 + suraIdx];
            }

            audio.currentTime = (timing.time || 0) / 1000;
        }

        audio.play();
    };

    const handlePauseClick = (/*event: React.MouseEvent<HTMLButtonElement>*/) => {
        setIsPlaying(false);
        let audio = document.getElementsByTagName('audio').item(0) as HTMLAudioElement;
        audio.pause();
    };

    let currentWordId: string;

    const handleOnTimeUpdate = (event: React.SyntheticEvent<HTMLAudioElement>) => {

        let recitation = quranData.recitations[recitationIdx];
        if (recitation?.recitaionMeta?.isFilePerSura) {
            let currentTimeInMS = event.currentTarget.currentTime * 1000;

            let nextAyatTiming: RecitaionTiming;
            if (recitation.recitaionMeta.byWBW) {
                nextAyatTiming = recitation.timings[selectedAyat];

                let thisAyatTiming = recitation.timings[selectedAyat - 1];

                let currentWordTiming = thisAyatTiming.wordTimings.filter(t =>
                    t[1] /*startTime*/ <= currentTimeInMS && t[2] /*endTime*/ >= currentTimeInMS)[0]

                if (currentWordTiming) {
                    let wordNumber = currentWordTiming[0];
                    let thisWordId = 'word_' + thisAyatTiming.sura + '_' + thisAyatTiming.ayat + '_' + wordNumber;

                    if (currentWordId != thisWordId) {
                        //if (currentWordId)
                        //    document.getElementById(currentWordId).style.color = 'white';

                        let thisWordElement = document.getElementById(thisWordId);
                        if (thisWordElement)
                            thisWordElement.style.color = 'purple';

                        currentWordId = thisWordId;
                    }
                }
            } else {
                let suraIdx = ayats[0].suraIdx;
                nextAyatTiming = recitation.timings[selectedAyat + suraIdx];
            }

            if (nextAyatTiming && currentTimeInMS >= nextAyatTiming.time) {
                let currentAyatIdx = selectedAyat - ayats[0].serial;
                let nextAyat = ayats[currentAyatIdx + 1];

                if (nextAyat) {
                    if (nextAyat.serial > ayats[ayats.length - 1].serial) {
                        setIsPlaying(false);
                        event.currentTarget.pause();
                        return;
                    }

                    onPlayingAyatChanged(nextAyat);
                } else {
                    setIsPlaying(false);
                    event.currentTarget.pause();
                }
                return;
            }
        }
    };

    const handleOnEnded = () => {
        if (!isPlaying || !ayats.length)
            return;

        let currentAyatIdx = (selectedAyat || ayats[0].serial) - ayats[0].serial;
        let isLastAyat = currentAyatIdx >= ayats.length - 1;
        let isLastRecitaion = recitationIdx >= quranData.recitations.length - 1;

        if (isLastAyat) {
            if (isLastRecitaion) {
                setIsPlaying(false);
                setRecitationIdx(0);
            } else {
                setRecitationIdx(recitationIdx + 1);
                if (settingsData.readingMode == ReadingMode.Ayat_By_Ayat)
                    forceUpdate();
                else
                    onPlayingAyatChanged(ayats[0]);
            }
            return;
        }

        if (settingsData.readingMode == ReadingMode.Ayat_By_Ayat) {
            if (isLastRecitaion) {
                setRecitationIdx(0);
            } else {
                setRecitationIdx(recitationIdx + 1);
                forceUpdate();
                return;
            }
        }

        let nextAyat = ayats[currentAyatIdx + 1];
        onPlayingAyatChanged(nextAyat)
    };

    return <div className='fixed-bottom d-flex p-2' style={{ justifyContent: 'center' }}>

        <div className="btn-group">
            {!isPlaying &&
                <button className="btn theme-colored border" type="button" onClick={handlePlayClick} title="Recite">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-play-fill" viewBox="0 0 16 16">
                        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
                    </svg>
                </button>
            }
            {isPlaying &&
                <button className="btn theme-colored border" type="button" onClick={handlePauseClick} title="Pause">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pause-fill" viewBox="0 0 16 16">
                        <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5" />
                    </svg>
                </button>
            }
            <div className="btn-group">
                <button type="button" className="btn theme-colored border dropdown-toggle" data-bs-toggle="dropdown">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                    </svg>
                </button>
                <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">...</a></li>
                </ul>
            </div>
        </div>

        <audio src={getAudioUrl()} crossOrigin="anonymous" autoPlay={isPlaying}
            onTimeUpdate={handleOnTimeUpdate}
            onEnded={handleOnEnded}></audio>
    </div>;
}

export default AudioPlayer

interface AudioPlayerProps {
    quranData: QuranData,
    settingsData: SettingsModel,
    ayats: Ayat[],
    selectedAyat: number,
    onPlayingAyatChanged: (ayat: Ayat) => void,
}
