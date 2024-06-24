import { useEffect, useState } from "react";

const InstallPWA = () => {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState<any>(null);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setSupportsPWA(true);
            setPromptInstall(e);
        };
        window.addEventListener("beforeinstallprompt", handler);

        return () => window.removeEventListener("transitionend", handler);
    }, []);

    const onClick = (e: any) => {
        e.preventDefault();
        if (!promptInstall) {
            return;
        }
        promptInstall.prompt();
    };
    if (!supportsPWA) {
        return null;
    }
    return (
        <button type="button"
            className="btn btn-primary m-2"
            id="install-button"
            aria-label="Install app"
            title="Install app"
            onClick={onClick}
        >
            ⬇️ Install
        </button>
    );
};

export default InstallPWA;