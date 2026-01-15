import { useEffect, useRef } from "react";

export function useKeepScreenAwake(isPlaying: boolean) {
    const wakeLockRef = useRef<WakeLockSentinel | null>(null);

    const requestWakeLock = async () => {
        try {
            if ("wakeLock" in navigator && !wakeLockRef.current) {
                wakeLockRef.current = await navigator.wakeLock.request("screen");
                console.log("Wake Lock acquired");
            }
        } catch (err) {
            console.warn("Wake Lock request failed:", err);
        }
    };

    const releaseWakeLock = async () => {
        try {
            if (wakeLockRef.current) {
                await wakeLockRef.current.release();
                wakeLockRef.current = null;
                console.log("Wake Lock released");
            }
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible" && isPlaying) {
                requestWakeLock();
            }
        };

        if (isPlaying) {
            requestWakeLock();
        } else {
            releaseWakeLock();
        }

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            releaseWakeLock(); // cleanup on unmount
        };
    }, [isPlaying]);
}
