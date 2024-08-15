﻿import React, { useState } from 'react';
import { Ayat, QuranData, Recitation, RecitationTiming } from '../QuranData';
import { getAyatId, padLeft, secondsToTimeString, sum } from '../Utilities';
import { ReadingMode, SettingsModel } from './SettingsPanel';
import { FaEllipsisV, FaPause, FaPlay } from 'react-icons/fa';

function AudioPlayer({ quranData, settingsData, ayats, selectedAyatSerial, onPlayingAyatChanged }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [recitationIdx, setRecitationIdx] = useState<number>(0);

    const recitations = settingsData.recitaions;

    const getAudioUrl = (recitation: Recitation): string => {
        if (!recitation || !ayats?.length)
            return '';

        let startingAyat = ayats[selectedAyatSerial - ayats[0].serial] || ayats[0];

        if (recitation.isFilePerVerse) {
            let ayatId = getAyatId(startingAyat)

            return `${recitation.url}/${ayatId}.mp3`;
        }
        else if (recitation.isFilePerSura) {
            const recitationWithData = quranData.recitations.find(f => f.recitaionMeta?.id == recitation.id);
            let suraUrl = recitationWithData?.suraUrls[startingAyat.suraIdx];

            if (suraUrl)
                return suraUrl
            else {
                let suraSerial = recitation.hasFileNameLeadingZeros === false
                    ? startingAyat.suraIdx + 1
                    : padLeft((startingAyat.suraIdx + 1).toString(), 3);

                return `${recitation.url}/${suraSerial}.mp3`;
            }
        }
        else return ''
    };

    const getDuration = (recitationId: string, startingAyatSerial: number, endingAyatSerial: number): number => {

        const recitationTimings = quranData.recitations.find(f => f.recitaionMeta?.id == recitationId)?.timings ?? [];

        const ayatsTimings = recitationTimings.slice(startingAyatSerial - 1, endingAyatSerial) ?? [];

        let totalDuration = sum(ayatsTimings.map(m => m.duration));

        return totalDuration;
    };

    const getTotalTimeInSecond = (): number => {
        const startingAyat = ayats[0];
        const endingAyat = ayats[ayats.length - 1];

        let totalDuration = 0;

        recitations.forEach(recitation => {
            totalDuration += getDuration(recitation.id, startingAyat.serial, endingAyat.serial);
        });

        return totalDuration / 1000;
    };

    const getCurrentTimeInSecond = (): number => {

        const startingAyat = ayats[0];
        const currentAyat = ayats[selectedAyatSerial - ayats[0].serial] ?? ayats[0];

        let totalDuration = 0;

        if (settingsData.readingMode == ReadingMode.Ayat_By_Ayat) {
            recitations.forEach(recitation => {
                totalDuration += getDuration(recitation.id, startingAyat.serial, currentAyat.serial - 1);
            });
        } else if (settingsData.readingMode == ReadingMode.Ruku_By_Ruku) {
            const currentRukuStartingAyat = ayats.find(f => f.rukuIdx == currentAyat.rukuIdx) ?? startingAyat;

            //played by all reciters prior to current ruku
            recitations.forEach(recitation => {
                totalDuration += getDuration(recitation.id, startingAyat.serial, currentRukuStartingAyat.serial - 1);
            });

            //current ruku: played by prior reciters
            const currentRukuEndingAyat = ayats.findLast(f => f.rukuIdx == currentAyat.rukuIdx) ?? currentAyat;
            for (let i = 0; i < recitationIdx; i++) {
                const recitation = recitations[i];
                totalDuration += getDuration(recitation.id, currentRukuStartingAyat.serial, currentRukuEndingAyat.serial);
            }

            //current ruku: played by current reciter
            const currentRecitation = recitations[recitationIdx];
            if (currentRecitation)
                totalDuration += getDuration(currentRecitation.id, currentRukuStartingAyat.serial, currentAyat.serial);
        }

        return totalDuration / 1000;
    };

    const getTimeInfo = (): { totalTime: number, currentTime: number, currentPercentage: number } => {
        const totalTime = getTotalTimeInSecond();

        const currentTime = getCurrentTimeInSecond();

        return {
            totalTime: totalTime,
            currentTime: currentTime,
            currentPercentage: currentTime / totalTime * 100
        };
    };

    const timeInfo = getTimeInfo();

    const getCurrentTime = (): string => {
        return secondsToTimeString(timeInfo.currentTime);
    };

    const getTotalTime = (): string => {
        return secondsToTimeString(timeInfo.totalTime)
    };

    const getCurrentPercentage = (): string => {
        return timeInfo.currentPercentage + '%';
    };

    const handlePlay = (_recitationIdx: number, _ayatSerial: number) => {
        let recitation = recitations[_recitationIdx];

        let audioElements = document.getElementsByTagName('audio')

        for (let audioElement of audioElements) {
            if (audioElement.id == recitation.id) {
                if (recitation?.isFilePerSura) {
                    let recitationTimings = quranData.recitations.find(f => f.recitaionMeta?.id == recitation.id)?.timings ?? [];
                    let currentAyatTiming: RecitationTiming = recitationTimings[_ayatSerial - 1];
                    let currentAyatStartTime = (currentAyatTiming.timeStart || 0) / 1000;

                    if (audioElement.currentTime < currentAyatStartTime
                        || audioElement.currentTime > currentAyatTiming.duration + 1) {
                        audioElement.currentTime = currentAyatStartTime;
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
        handlePlay(recitationIdx, selectedAyatSerial);

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
            let currentAyatTiming = recitationTimings[selectedAyatSerial - 1];

            if (recitation.byWBW && currentAyatTiming.wordTimings) {

                let currentWordTiming = currentAyatTiming.wordTimings.filter(t =>
                    t[1] /*startTime*/ <= currentTimeInMS && t[2] /*endTime*/ >= currentTimeInMS)[0]

                if (currentWordTiming) {
                    let wordNumber = currentWordTiming[0];
                    let currentWordId = 'word_' + currentAyatTiming.sura + '_' + currentAyatTiming.ayat + '_' + wordNumber;

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

            const timingAdjustment = recitation.timingAdjustment ?? 0;
            let isCurrentTimeExceedingAyatDuration = currentTimeInMS >= currentAyatTiming.timeStart + currentAyatTiming.duration + timingAdjustment;

            let isCurrentTimeExceedingFileDuration = event.currentTarget.currentTime >= event.currentTarget.duration;

            if (isCurrentTimeExceedingAyatDuration || isCurrentTimeExceedingFileDuration) {
                setTimeout(() => {
                    const currentAyatIdx = selectedAyatSerial - ayats[0].serial;
                    const nextAyat = ayats[currentAyatIdx + 1];
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
                    handlePlay(nextRecitationId, selectedAyatSerial);
                }
            } else {
                if (isLastRecitaion && nextAyat)
                    onPlayingAyatChanged(nextAyat);

                handlePlay(nextRecitationId, selectedAyatSerial);
            }
        } else if (settingsData.readingMode == ReadingMode.Ruku_By_Ruku) {
            let currentAyat = ayats[currentAyatIdx];
            let isLastAyatInThisRuku = currentAyat.rukuIdx != nextAyat?.rukuIdx;

            if (isLastAyatInThisRuku) {
                pauseAll();
                let nextRecitation = recitations[nextRecitationId];
                let isTranslation = nextRecitation.language != 'ar';

                if (isLastRecitaion) {
                    if (!isLastAyat && nextAyat) {
                        setRecitationIdx(nextRecitationId);
                        onPlayingAyatChanged(nextAyat, isTranslation);
                        handlePlay(nextRecitationId, nextAyat.serial);
                    } else {
                        setIsPlaying(false);
                    }
                } else {
                    let firstAyatInThisRuku = ayats.find(a => a.rukuIdx == currentAyat.rukuIdx);
                    if (firstAyatInThisRuku) {
                        setRecitationIdx(nextRecitationId);
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

        let currentAyatIdx = selectedAyatSerial - ayats[0].serial;
        let isLastAyat = currentAyatIdx >= ayats.length - 1;
        let isLastRecitaion = recitationIdx >= recitations.length - 1;
        let nextRecitationId = isLastRecitaion ? 0 : recitationIdx + 1;

        if (settingsData.readingMode == ReadingMode.Ayat_By_Ayat) {
            setRecitationIdx(nextRecitationId);

            if (isLastAyat) {
                if (isLastRecitaion) {
                    setIsPlaying(false);
                } else {
                    handlePlay(nextRecitationId, selectedAyatSerial);
                }
            } else {
                if (isLastRecitaion) {
                    let nextAyat = ayats[currentAyatIdx + 1];
                    if (nextAyat) {
                        onPlayingAyatChanged(nextAyat);
                    }
                }

                setTimeout(() => { handlePlay(nextRecitationId, selectedAyatSerial) });
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
                        setTimeout(() => { handlePlay(nextRecitationId, firstAyatInThisRuku?.serial ?? selectedAyatSerial) });
                    }
                }

            } else if (nextAyat) {
                let recitation = recitations[recitationIdx];
                let isTranslation = recitation.language != 'ar';
                onPlayingAyatChanged(nextAyat, isTranslation);
                setTimeout(() => { handlePlay(recitationIdx, selectedAyatSerial) });
            }
        }
    };

    return <>
        <div className='fixed-bottom d-flex p-2' style={{ justifyContent: 'center' }}>
            <div className="btn-group">
                {!isPlaying &&
                    <button className="btn theme-colored border" type="button" onClick={handlePlayClick} title="Recite">
                        <FaPlay />
                    </button>
                }
                {isPlaying &&
                    <button className="btn theme-colored border" type="button" onClick={handlePauseClick} title="Pause">
                        <FaPause />
                    </button>
                }
                <span className='btn theme-colored border'>
                    {getCurrentTime()} / {getTotalTime()}
                </span>
                {isPlaying &&
                    <span className="btn theme-colored border d-none d-md-inline">{recitations[recitationIdx]?.name}</span>
                }
                <button type="button" className="btn theme-colored border dropdown-toggle" data-bs-toggle="dropdown">
                    <FaEllipsisV />
                </button>
                <ul className="dropdown-menu">
                    {recitations.map((r, i) =>
                        <li key={r.id} className="dropdown-item">
                            <p style={{ cursor: 'pointer' }}
                                onClick={() => { setRecitationIdx(i); handlePlay(i, selectedAyatSerial); }}>
                                {recitationIdx == i ? '●' : ''} {r.name}
                            </p>
                            <audio id={r.id}
                                src={getAudioUrl(r)}
                                onTimeUpdate={handleOnTimeUpdate}
                                onEnded={handleOnEnded}
                                controls></audio>

                            <label>{getAudioUrl(r).startsWith('blob')? 'Offline': 'Online'}</label>
                        </li>
                    )}
                </ul>
            </div>
        </div>
        {isPlaying &&
            <div className="progress fixed-bottom" style={{ height: '0.5rem' }}>
                <div className="progress-bar" style={{ width: getCurrentPercentage() }}></div>
            </div>
        }
    </>;
}

export default AudioPlayer

interface AudioPlayerProps {
    quranData: QuranData,
    settingsData: SettingsModel,
    ayats: Ayat[],
    selectedAyatSerial: number,
    onPlayingAyatChanged: (ayat: Ayat, isTranslation?: boolean) => void,
}
