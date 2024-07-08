import React, { useRef, useState } from 'react';
import { Ayat, QuranData, Recitation, RecitationTiming } from '../QuranData';
import { getAyatId, padLeft, secondsToTimeString, sum } from '../Utilities';
import { ReadingMode, SettingsModel } from './SettingsPanel';

function AudioPlayer({ quranData, settingsData, ayats, selectedAyat, onPlayingAyatChanged }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [recitationIdx, setRecitationIdx] = useState<number>(0);
    const spanRefCurrentTime = useRef<any>();

    const recitations = settingsData.recitaions;

    const getAudioUrl = (recitation: Recitation): string => {
        if (!recitation || !ayats?.length)
            return '';

        let startingAyat = ayats[selectedAyat - ayats[0].serial] || ayats[0];

        if (recitation.isFilePerVerse) {
            let ayatId = getAyatId(startingAyat)

            return `${recitation.url}/${ayatId}.mp3`;
        }
        else if (recitation.isFilePerSura) {
            let suraSerial = recitation.hasFileNameLeadingZeros === false
                ? startingAyat.suraIdx + 1
                : padLeft((startingAyat.suraIdx + 1).toString(), 3);

            return `${recitation.url}/${suraSerial}.mp3`;
        }
        else return ''
    };

    const getDurationInSecond = (endingAyat: Ayat, includeEndingAyat: boolean = true): number => {
        if (!endingAyat)
            return 0;

        let startingAyat = ayats[0];

        let totalDuration = 0;

        recitations.forEach(recitation => {

            let recitationTimings = quranData.recitations.find(f => f.recitaionMeta?.id == recitation.id)?.timings ?? [];

            let ayatsTimings = recitationTimings.slice(startingAyat.serial - 1, endingAyat.serial - (includeEndingAyat ? 0 : 1)) ?? [];

            totalDuration += sum(ayatsTimings.map(m => m.duration));

        });

        return totalDuration / 1000;
    };

    const getCurrentTime = (): string => {
        const currentAyat = ayats[selectedAyat - ayats[0].serial];
        return secondsToTimeString(getDurationInSecond(currentAyat, false))
    };

    const getTotalTime = (): string => {
        const endingAyat = ayats[ayats.length - 1];
        return secondsToTimeString(getDurationInSecond(endingAyat))
    };

    const handlePlay = (p_recitationIdx: number, p_ayatSerial: number) => {
        let recitation = recitations[p_recitationIdx];

        let audioElements = document.getElementsByTagName('audio')

        for (let audioElement of audioElements) {
            if (audioElement.id == recitation.id) {
                if (recitation?.isFilePerSura) {
                    let recitationTimings = quranData.recitations.find(f => f.recitaionMeta?.id == recitation.id)?.timings ?? [];
                    let currentAyatTiming: RecitationTiming = recitationTimings[p_ayatSerial - 1];
                    let nextAyatTiming: RecitationTiming = recitationTimings[p_ayatSerial];
                    let currentAyatStartTime = (currentAyatTiming.timeStart || 0) / 1000;
                    let nextAyatStartTime = nextAyatTiming.sura == currentAyatTiming.sura ? (nextAyatTiming.timeStart || 0) / 1000 : Number.MAX_VALUE - 1;

                    if (audioElement.currentTime < currentAyatStartTime
                        || audioElement.currentTime > nextAyatStartTime + 1) {
                        audioElement.currentTime = (currentAyatTiming.timeStart || 0) / 1000;

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
        handlePlay(recitationIdx, selectedAyat);

        setIsPlaying(true);
    };

    const handlePauseClick = (/*event: React.MouseEvent<HTMLButtonElement>*/) => {
        pauseAll();

        setIsPlaying(false);
    };

    let previousWordId: string;

    const handleOnTimeUpdate = (event: React.SyntheticEvent<HTMLAudioElement>) => {
        let recitation = recitations[recitationIdx];

        if (recitation?.isFilePerSura) {
            let currentTimeInMS = event.currentTarget.currentTime * 1000;
            let recitationTimings = quranData.recitations.find(f => f.recitaionMeta?.id == recitation.id)?.timings ?? [];

            if (recitation.byWBW) {

                let thisAyatTiming = recitationTimings[selectedAyat - 1];

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
            let nextAyatTiming = recitationTimings[selectedAyat];

            let isCurrentTimeExceedingNextAyatStartTime = nextAyatTiming
                && nextAyatTiming.sura == currentAyat.suraIdx + 1
                && currentTimeInMS >= nextAyatTiming.timeStart;

            let isCurrentTimeExceedingDuration = event.currentTarget.currentTime >= event.currentTarget.duration;

            if (isCurrentTimeExceedingNextAyatStartTime || isCurrentTimeExceedingDuration) {
                setTimeout(() => {
                    ayatEnded(currentAyatIdx, nextAyat);
                });
            }
        }
    };

    const ayatEnded = (currentAyatIdx: number, nextAyat?: Ayat) => {

        if (recitations.length == 1) {
            if (nextAyat)
                onPlayingAyatChanged(nextAyat);
            return;
        }

        let isLastAyat = currentAyatIdx >= ayats.length - 1;
        let isLastRecitaion = recitationIdx >= recitations.length - 1;
        let nextRecitationId = isLastRecitaion ? 0 : recitationIdx + 1;

        if (settingsData.readingMode == ReadingMode.Ayat_By_Ayat) {
            pauseAll();
            setRecitationIdx(nextRecitationId);

            if (isLastAyat) {
                if (isLastRecitaion) {
                    setIsPlaying(false);
                } else {
                    handlePlay(nextRecitationId, selectedAyat);
                }
            } else {
                if (isLastRecitaion && nextAyat)
                    onPlayingAyatChanged(nextAyat);

                handlePlay(nextRecitationId, selectedAyat);
            }
        } else if (settingsData.readingMode == ReadingMode.Ruku_By_Ruku) {
            let currentAyat = ayats[currentAyatIdx];
            let isLastAyatInThisRuku = currentAyat.rukuIdx != nextAyat?.rukuIdx;

            if (isLastAyatInThisRuku) {
                pauseAll();
                setRecitationIdx(nextRecitationId);
                let nextRecitation = recitations[nextRecitationId];
                let isTranslation = nextRecitation.language != 'ar';

                if (isLastRecitaion) {
                    if (!isLastAyat && nextAyat) {
                        onPlayingAyatChanged(nextAyat, isTranslation);
                        handlePlay(nextRecitationId, nextAyat.serial);
                    } else {
                        setIsPlaying(false);
                    }
                } else {
                    let firstAyatInThisRuku = ayats.find(a => a.rukuIdx == currentAyat.rukuIdx);
                    if (firstAyatInThisRuku) {
                        onPlayingAyatChanged(firstAyatInThisRuku, isTranslation);
                        handlePlay(nextRecitationId, firstAyatInThisRuku.serial);
                    }
                }

            } else if (nextAyat) {
                let recitation = recitations[recitationIdx];
                let isTranslation = recitation.language != 'ar';
                onPlayingAyatChanged(nextAyat, isTranslation);
            }
        }
    };

    const handleOnEnded = () => {
        if (!isPlaying || !ayats.length)
            return;

        let currentAyatIdx = selectedAyat - ayats[0].serial;
        let isLastAyat = currentAyatIdx >= ayats.length - 1;
        let isLastRecitaion = recitationIdx >= recitations.length - 1;
        let nextRecitationId = isLastRecitaion ? 0 : recitationIdx + 1;

        if (settingsData.readingMode == ReadingMode.Ayat_By_Ayat) {
            setRecitationIdx(nextRecitationId);

            if (isLastAyat) {
                if (isLastRecitaion) {
                    setIsPlaying(false);
                } else {
                    handlePlay(nextRecitationId, selectedAyat);
                }
            } else {
                if (isLastRecitaion) {
                    let nextAyat = ayats[currentAyatIdx + 1];
                    if (nextAyat) {
                        onPlayingAyatChanged(nextAyat);
                    }
                }

                setTimeout(() => { handlePlay(nextRecitationId, selectedAyat) });
            }
        } else if (settingsData.readingMode == ReadingMode.Ruku_By_Ruku) {
            let currentAyat = ayats[currentAyatIdx];
            let nextAyat = ayats[currentAyatIdx + 1];
            let isLastAyatInThisRuku = currentAyat.rukuIdx != nextAyat?.rukuIdx;
            let nextRecitation = recitations[nextRecitationId];
            let isTranslation = nextRecitation.language != 'ar';

            if (isLastAyatInThisRuku) {
                setRecitationIdx(nextRecitationId);

                if (isLastRecitaion) {
                    if (!isLastAyat && nextAyat) {
                        onPlayingAyatChanged(nextAyat, isTranslation);
                        setTimeout(() => { handlePlay(nextRecitationId, nextAyat.serial) });
                    } else {
                        setIsPlaying(false);
                    }
                } else {
                    let firstAyatInThisRuku = ayats.find(a => a.rukuIdx == currentAyat.rukuIdx);
                    if (firstAyatInThisRuku) {
                        onPlayingAyatChanged(firstAyatInThisRuku, isTranslation);
                        setTimeout(() => { handlePlay(nextRecitationId, firstAyatInThisRuku?.serial ?? selectedAyat) });
                    }
                }

            } else if (nextAyat) {
                let recitation = recitations[recitationIdx];
                let isTranslation = recitation.language != 'ar';
                onPlayingAyatChanged(nextAyat, isTranslation);
                setTimeout(() => { handlePlay(recitationIdx, selectedAyat) });
            }
        }
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
            <span className='btn theme-colored border'>
                <span ref={spanRefCurrentTime}>{getCurrentTime()}</span> / {getTotalTime()}
            </span>
            {isPlaying &&
                <span className="btn theme-colored border">{recitations[recitationIdx]?.name}</span>
            }
            <button type="button" className="btn theme-colored border dropdown-toggle" data-bs-toggle="dropdown">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                </svg>
            </button>
            <ul className="dropdown-menu">
                {recitations.map((r, i) =>
                    <li key={r.id} className="dropdown-item">
                        <p style={{ cursor: 'pointer' }}
                            onClick={() => { setRecitationIdx(i); handlePlay(i, selectedAyat); }}>
                            {recitationIdx == i ? '●' : ''} {r.name}
                        </p>
                        <audio id={r.id}
                            src={getAudioUrl(r)}
                            onTimeUpdate={handleOnTimeUpdate}
                            onEnded={handleOnEnded}
                            controls></audio>
                    </li>
                )}
            </ul>
        </div>
    </div>;
}

export default AudioPlayer

interface AudioPlayerProps {
    quranData: QuranData,
    settingsData: SettingsModel,
    ayats: Ayat[],
    selectedAyat: number,
    onPlayingAyatChanged: (ayat: Ayat, isTranslation?: boolean) => void,
}
