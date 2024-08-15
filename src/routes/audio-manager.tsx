import { useEffect, useReducer, useState } from "react";
import { AudioDownloadState, QuranData, Sura, SuraAudio } from "../QuranData";
import { FaCheck, FaFileDownload, FaSpinner } from "react-icons/fa";
import { IndexedDBService } from "../IndexedDBService";
import { padLeft } from "../Utilities";
import ThemeSwitch from "../components/ThemeSwitch";
import recitationList from '../assets/recitation-list.json';

function AudioManager() {
    const quranData = QuranData.instance;

    const [reciterId, setReciterId] = useState(recitationList[0].id);
    const [suraList, setSuraList] = useState(quranData.suras);
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const loadStoredSuraSerials = (reciterId: string) => {
        const audioDBService = new IndexedDBService<SuraAudio>('audioDatabase', reciterId);

        audioDBService.getAllKeys()
            .then(allKeys => {
                suraList.forEach(sura => {
                    if (allKeys.some(s => s == sura.serial))
                        sura.audioDownloadState = AudioDownloadState.Downlaoded
                    else
                        sura.audioDownloadState = AudioDownloadState.NotDownlaoded
                });
                setSuraList(suraList);
                forceUpdate();
            })
            .catch(error => console.error('Error retrieving all keys:', error));
    };

    useEffect(() => {
        loadStoredSuraSerials(reciterId);
    }, [])

    const handleReciterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedReciterId = event.target.value;
        setReciterId(selectedReciterId);
        loadStoredSuraSerials(selectedReciterId);
    };

    const download = async (sura: Sura) => {
        if (!sura) return;
        sura.audioDownloadState = AudioDownloadState.Downlaoding;

        const recitation = recitationList.find(f => f.id == reciterId);
        if (!recitation) return;

        const suraSerial = recitation.hasFileNameLeadingZeros === false
            ? sura.serial
            : padLeft((sura.serial).toString(), 3);

        const mp3Url = `${recitation.url}/${suraSerial}.mp3`;
        const response = await fetch(mp3Url);
        const mp3Blob = await response.blob();

        const audioDBService = new IndexedDBService<SuraAudio>('audioDatabase', reciterId);

        audioDBService.storeData({ id: sura.serial, mp3Blob: mp3Blob })
            .then(() => loadStoredSuraSerials(reciterId))
            .catch(error => console.error('Error storing data:', error));

        forceUpdate();
    };

    return (<div className="container">

        <h1 className="text-center my-3">
            <img className="rounded me-2" src="/images/quran-rehal.svg" alt="Quran Rehal" height="40" />
            <b>Quran</b> PWA
        </h1>

        <h2 className="text-center">Audio Manager</h2>

        <div className="row">
            <label htmlFor="ReciterSelect" className="form-label text-md-end col-md-2">Reciter</label>
            <div className="col-md-10">
                <select id="ReciterSelect" className="form-select" onChange={handleReciterChange} title="Reciter">
                    {recitationList.map(item =>
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>)}
                </select>
            </div>
        </div>
        <hr />
        <ul className="list-group">
            {suraList.map(sura =>
                <li key={sura.serial} className="list-group-item d-flex justify-content-between">
                    <span>{sura.serial}. {sura.tname}</span>

                    {sura.audioDownloadState == AudioDownloadState.Downlaoded ?
                        <FaCheck /> :
                        sura.audioDownloadState == AudioDownloadState.Downlaoding ?
                            <FaSpinner className="icon-spin" /> : <FaFileDownload onClick={() => download(sura)} />}
                </li>
            )}
        </ul>
        <hr />
        <ThemeSwitch />
        <br />
        <button className="btn btn-primary" onClick={() => history.back()}>Go Back</button>
    </div>)
}

export default AudioManager;