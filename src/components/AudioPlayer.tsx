import React, { useState } from 'react';
import { Ayat, QuranData, RecitaionTiming, RecitaionWithData } from '../QuranData';
import { getAyatId, padLeft } from '../Utilities';
import { ReadingMode, SettingsModel } from './SettingsPanel';

function AudioPlayer({ quranData, settingsData, ayats, selectedAyat, onPlayingAyatChanged }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [recitationIdx, setRecitationIdx] = useState<number>(0)
    const recitations = quranData.recitations.sort((a, b) => a?.recitaionMeta?.language > b?.recitaionMeta?.language ? 1 : -1);

    const getAudioUrl = (recitation: RecitaionWithData): string => {
        if (!recitation || !ayats?.length)
            return '';

        let recitationMeta = recitation.recitaionMeta;
        let startingAyat = ayats[selectedAyat - ayats[0].serial] || ayats[0];

        if (recitationMeta.isFilePerVerse) {
            let ayatId = getAyatId(startingAyat)

            return `${recitationMeta.url}/${ayatId}.mp3`;
        }
        else if (recitationMeta.isFilePerSura) {
            let suraSerial = recitationMeta.hasFileNameLeadingZeros === false
                ? startingAyat.suraIdx + 1
                : padLeft((startingAyat.suraIdx + 1).toString(), 3);

            return `${recitationMeta.url}/${suraSerial}.mp3`;
        }
        else return ''
    };

    const handlePlay = (p_recitationIdx?: number) => {
        let recitation = recitations[p_recitationIdx ?? recitationIdx];

        let audioElements = document.getElementsByTagName('audio')

        for (let audioElement of audioElements) {
            if (audioElement.id == recitation.recitaionMeta.id) {
                if (recitation?.recitaionMeta?.isFilePerSura) {
                    let currentAyatTiming: RecitaionTiming = recitation.timings[selectedAyat - 1];
                    let nextAyatTiming: RecitaionTiming = recitation.timings[selectedAyat];
                    let currentAyatStartTime = (currentAyatTiming.time || 0) / 1000;
                    let nextAyatStartTime = nextAyatTiming.sura == currentAyatTiming.sura ? (nextAyatTiming.time || 0) / 1000 : Number.MAX_VALUE - 1;

                    if (audioElement.currentTime < currentAyatStartTime
                        || audioElement.currentTime > nextAyatStartTime + 1) {
                        audioElement.currentTime = (currentAyatTiming.time || 0) / 1000;
                    }
                }
                audioElement.play();
            }
            else {
                audioElement.pause();
            }
        }
    };

    const pauseAll = () => {
        let audioElements = document.getElementsByTagName('audio')

        for (let audioElement of audioElements) {
            audioElement.pause();
        }
    };

    const handlePlayClick = (/*event: React.MouseEvent<HTMLButtonElement>*/) => {
        handlePlay();

        setIsPlaying(true);
    };

    const handlePauseClick = (/*event: React.MouseEvent<HTMLButtonElement>*/) => {
        pauseAll();

        setIsPlaying(false);
    };

    let previousWordId: string;

    const handleOnTimeUpdate = (event: React.SyntheticEvent<HTMLAudioElement>) => {
        let recitation = recitations[recitationIdx];

        if (recitation?.recitaionMeta?.isFilePerSura) {
            let currentTimeInMS = event.currentTarget.currentTime * 1000;

            if (recitation.recitaionMeta.byWBW) {
                let thisAyatTiming = recitation.timings[selectedAyat - 1];

                let currentWordTiming = thisAyatTiming.wordTimings.filter(t =>
                    t[1] /*startTime*/ <= currentTimeInMS && t[2] /*endTime*/ >= currentTimeInMS)[0]

                if (currentWordTiming) {
                    let wordNumber = currentWordTiming[0];
                    let currentWordId = 'word_' + thisAyatTiming.sura + '_' + thisAyatTiming.ayat + '_' + wordNumber;

                    if (previousWordId != currentWordId) {
                        //let previousWordElement = document.getElementById(previousWordId);
                        //if (previousWordElement)
                        //    previousWordElement.style.color = 'gray';

                        let currentWordElement = document.getElementById(currentWordId);
                        if (currentWordElement)
                            currentWordElement.style.color = 'lightgreen';

                        previousWordId = currentWordId;
                    }
                }
            }

            let currentAyatIdx = selectedAyat - ayats[0].serial;
            let currentAyat = ayats[currentAyatIdx];
            let nextAyat = ayats[currentAyatIdx + 1];
            let nextAyatTiming = recitation.timings[selectedAyat];

            if (nextAyat) {
                if (currentTimeInMS >= nextAyatTiming?.time) {
                    setTimeout(() => {
                        ayatEnded(currentAyatIdx, nextAyat);
                    });
                }
            } else {
                let isCurrentTimeExceedingNextAyatStartTime = nextAyatTiming
                    && nextAyatTiming.sura == currentAyat.suraIdx + 1
                    && currentTimeInMS >= nextAyatTiming.time;

                let isCurrentTimeExceedingDuration = event.currentTarget.currentTime >= event.currentTarget.duration;

                if (isCurrentTimeExceedingNextAyatStartTime || isCurrentTimeExceedingDuration) {
                    ayatEnded(currentAyatIdx, nextAyat);
                }
            }
        }
    };

    const ayatEnded = (currentAyatIdx: number, nextAyat: Ayat) => {

        if (recitations.length == 1) {
            if (nextAyat)
                onPlayingAyatChanged(nextAyat);
            return;
        }

        pauseAll();

        let isLastAyat = currentAyatIdx >= ayats.length - 1;
        let isLastRecitaion = recitationIdx >= recitations.length - 1;
        let nextRecitationId = isLastRecitaion ? 0 : recitationIdx + 1;

        if (isLastAyat) {
            setRecitationIdx(nextRecitationId);
            if (isLastRecitaion) {
                setIsPlaying(false);
            } else {
                handlePlay(nextRecitationId);
            }
            return;
        }

        setRecitationIdx(nextRecitationId);

        if (settingsData.readingMode == ReadingMode.Ayat_By_Ayat) {
            handlePlay(nextRecitationId);
        }

        if (isLastRecitaion && nextAyat)
            onPlayingAyatChanged(nextAyat);
    };

    const handleOnEnded = () => {
        if (!isPlaying || !ayats.length)
            return;

        let currentAyatIdx = selectedAyat - ayats[0].serial;
        let isLastAyat = currentAyatIdx >= ayats.length - 1;
        let isLastRecitaion = recitationIdx >= recitations.length - 1;
        let nextRecitationId = isLastRecitaion ? 0 : recitationIdx + 1;

        if (isLastAyat) {
            setRecitationIdx(nextRecitationId);
            if (isLastRecitaion) {
                setIsPlaying(false);
            } else {
                if (settingsData.readingMode == ReadingMode.Ayat_By_Ayat)
                    handlePlay(nextRecitationId);
                else
                    onPlayingAyatChanged(ayats[0]);
            }
            return;
        }

        if (settingsData.readingMode == ReadingMode.Ayat_By_Ayat) {
            setRecitationIdx(nextRecitationId);
            handlePlay(nextRecitationId);

            if (!isLastRecitaion) {
                return;
            }
        }

        let nextAyat = ayats[currentAyatIdx + 1];
        onPlayingAyatChanged(nextAyat);

        setTimeout(() => { handlePlay(nextRecitationId) });
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
            {isPlaying && <>
                <button className="btn theme-colored border" type="button" onClick={handlePauseClick} title="Pause">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pause-fill" viewBox="0 0 16 16">
                        <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5" />
                    </svg>
                </button>
                <span className="btn theme-colored border">{recitations[recitationIdx]?.recitaionMeta?.name}</span>
            </>}
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
        {recitations.map(r =>
            <audio key={r.recitaionMeta.id} id={r.recitaionMeta.id}
                src={getAudioUrl(r)}
                onTimeUpdate={handleOnTimeUpdate}
                onEnded={handleOnEnded}></audio>
        )}

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
