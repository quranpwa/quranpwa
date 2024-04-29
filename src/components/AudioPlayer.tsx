import { useState } from 'react';
import { Ayat, QuranData } from '../QuranData';
import { padLeft } from '../Utilities';
import React from 'react';

function AudioPlayer({ quranData, ayats, selectedAyat, onPlayingAyatChanged }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState<boolean>(false)

    const getAudioUrl = (): string => {

        let recitation = quranData.recitations[0];
        if (!recitation)
            return '';

        let recitationMeta = recitation.recitaionMeta;
        let startingAyat = ayats[selectedAyat - ayats[0].serial];
        if (!startingAyat)
            startingAyat = ayats[0];

        if (recitationMeta.byVerse) {
            let suraSerial = padLeft((startingAyat.suraIdx + 1).toString(), 3);
            let ayatSerialInSura = padLeft(startingAyat.serialInSura.toString(), 3);

            return `${recitationMeta.url}/${suraSerial}${ayatSerialInSura}.mp3`;
        }
        else if (recitationMeta.bySura) {
            let suraSerial = padLeft((startingAyat.suraIdx + 1).toString(), 3);

            return `${recitationMeta.url}/${suraSerial}.mp3`;
        }
        else return ''
    };

    const handleOnPlay = (event: React.SyntheticEvent<HTMLAudioElement>) => {
        setIsPlaying(true);

        let recitation = quranData.recitations[0];
        if (recitation?.recitaionMeta?.bySura) {
            let suraIdx = ayats[0].suraIdx
            let [, , timing] = recitation.timings[selectedAyat - 1 + suraIdx];
            event.currentTarget.currentTime = (timing || 0) / 1000;
        }
    };
    const handleOnTimeUpdate = (event: React.SyntheticEvent<HTMLAudioElement>) => {

        let recitation = quranData.recitations[0];
        if (recitation?.recitaionMeta?.bySura) {
            let suraIdx = ayats[0].suraIdx
            let [, , nextTiming] = recitation.timings[selectedAyat + suraIdx];

            if (event.currentTarget.currentTime >= nextTiming / 1000) {
                let currentAyatIdx = selectedAyat - ayats[0].serial;
                let nextAyat = ayats[currentAyatIdx + 1];

                if (nextAyat.serial > ayats[ayats.length - 1].serial) {
                    setIsPlaying(false);
                    event.currentTarget.pause();
                    return;
                }

                onPlayingAyatChanged(nextAyat)
                return;
            }
        }
    };

    const handleOnPause = () => {
        //setIsPlaying(false);
    };

    const handleOnEnded = () => {
        if (!isPlaying)
            return;

        let currentAyatIdx = selectedAyat - ayats[0].serial;
        if (currentAyatIdx >= ayats.length - 1) {
            setIsPlaying(false);
            return;
        }

        let nextAyat = ayats[currentAyatIdx + 1];
        onPlayingAyatChanged(nextAyat)
    };

    return <div className='fixed-bottom d-flex p-2' style={{ justifyContent: 'center' }}>


        <div className="btn-group d-none">
            {/*{!isPlaying &&*/}
            {/*    <button className="btn theme-colored border" type="button" onClick={handlePlayClick} title="Recite">*/}
            {/*        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-play-fill" viewBox="0 0 16 16">*/}
            {/*            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />*/}
            {/*        </svg>*/}
            {/*    </button>*/}
            {/*}*/}
            {/*{isPlaying &&*/}
            {/*    <button className="btn theme-colored border" type="button" onClick={handlePauseClick} title="Pause">*/}
            {/*        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pause-fill" viewBox="0 0 16 16">*/}
            {/*            <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5" />*/}
            {/*        </svg>*/}
            {/*    </button>*/}
            {/*}*/}
            <div className="btn-group">
                <button type="button" className="btn theme-colored border dropdown-toggle" data-bs-toggle="dropdown">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                    </svg>
                </button>
                <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">Etc..</a></li>
                </ul>
            </div>
        </div>
        <audio src={getAudioUrl()} controls crossOrigin="anonymous" autoPlay={isPlaying}
            onPlay={handleOnPlay}
            onTimeUpdate={handleOnTimeUpdate}
            onPause={handleOnPause}
            onEnded={handleOnEnded}></audio>
    </div>;
}

export default AudioPlayer

interface AudioPlayerProps {
    quranData: QuranData,
    ayats: Ayat[],
    selectedAyat: number,
    onPlayingAyatChanged: (ayat: Ayat) => void,
}
