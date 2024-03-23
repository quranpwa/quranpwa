import { useState } from 'react';
import { Ayat } from '../QuranData';
import { padLeft } from '../Utilities';
import recitationList from '../assets/recitation-list.json'

function AudioPlayer({ ayats, selectedAyat, onPlayingAyatChanged }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState<boolean>(false)

    const getAudioUrl = (): string => {

        let ayat = ayats[selectedAyat - ayats[0].serial];

        if (!ayat)
            ayat = ayats[0];

        let suraSerial = padLeft((ayat.suraIdx + 1).toString(), 3);
        let ayatSerialInSura = padLeft(ayat.serialInSura.toString(), 3);

        let urlPrefix = recitationList[0].url;

        return `${urlPrefix}/${suraSerial}${ayatSerialInSura}.mp3`;
    };

    const handleOnPlay = () => {
        setIsPlaying(true);
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

        <audio src={getAudioUrl()} controls autoPlay={isPlaying}
            onPlay={handleOnPlay}
            onPause={handleOnPause}
            onEnded={handleOnEnded}></audio>
    </div>;
}

export default AudioPlayer

interface AudioPlayerProps {
    ayats: Ayat[],
    selectedAyat: number,
    onPlayingAyatChanged: (ayat: Ayat) => void
}
