
function About() {

    return (<div className="container">

        <h1 className="text-center my-3">
            <img className="rounded me-2" src="/images/quran-rehal.svg" alt="Quran Rehal" height="40" />
            <b>Quran</b> PWA
        </h1>

        <p className="text-center">
            <span className="badge bg-secondary"> Version: 1.1.1 </span>
            <span className="badge bg-secondary ms-2">Release Date: 2024-06-19</span>
        </p>

        <p>Quran PWA is a open source project. <a href="https://github.com/quranpwa/quranpwa" target="_blank">link</a></p>
        <p>The data used in this project is collected from the various sources. Following are the notable mentions.</p>
        <ul>
            <li><a href="https://tanzil.net/" target="_blank">Tanzil.net</a></li>
            <li><a href="https://gtaf.org/" target="_blank">Greentech Apps Foundation (gtaf.org)</a></li>
            <li><a href="https://quranenc.com/" target="_blank">The Noble Qur'an Encyclopedia (QuranEnc.com)</a></li>
            <li><a href="https://quran.com/" target="_blank">Quran.com</a></li>
            <li><a href="https://quranwbw.com/" target="_blank">QuranWBW.com</a></li>
            <li><a href="https://everyayah.com/" target="_blank">EveryAyah.com</a></li>
            <li><a href="https://www.quranicaudio.com/" target="_blank">QuranicAudio.com</a></li>
            <li><a href="https://quran.gov.bd/" target="_blank">Quran.gov.bd</a></li>
        </ul>

        <button className="btn btn-primary" onClick={() => history.back()}>Go Back</button>
    </div>)
}

export default About;