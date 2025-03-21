import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
import { QuranData, SuraAudio } from './QuranData.ts'
import './index.css'
import About from './routes/about.tsx'
import Quran from './routes/quran.tsx'
import Root from './routes/root.tsx'
import AudioManager from './routes/audio-manager.tsx'
import { IndexedDBService } from './IndexedDBService.ts'
import recitationList from './assets/recitation-list.json';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />
    },
    {
        path: "/quran",
        element: <Quran />
    },
    {
        path: "/audio-manager",
        element: <AudioManager />
    },
    {
        path: "/about",
        element: <About />
    }
]);

async function initQuranData() {
    const quranDBService = new IndexedDBService<QuranData>('quranDatabase', 'quranStore');
    let quranData = await quranDBService.getData(1);

    if (quranData) {
        QuranData.instance = quranData
    } else {
        await QuranData.instance.setAyats();
        await QuranData.instance.setCorpus();

        await quranDBService.storeData(QuranData.instance);
    }

    const audioDBService = new IndexedDBService<SuraAudio>('audioDatabase', QuranData.instance.recitations[0]?.recitaionMeta?.id);
    await audioDBService.initDatabase(recitationList.map(item => item.id));
}

initQuranData().then(() => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>,
    )
});