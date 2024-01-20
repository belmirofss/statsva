export function formatToKm(meters: number) {
    if (!meters) {
        return "-"
    }

    return (meters / 1000).toFixed(1).concat(" km");
};

export function formatToM(meters: number) {
    if (!meters) {
        return "-"
    }

    return meters.toFixed(0).concat(" m");
};

export function formatTime(seconds: number) {
    if (!seconds) {
        return "-"
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}

export function formatKmPerHour(meters: number, seconds: number) {
    if (!meters || !seconds) {
        return "-"
    }

    return formatToKm((meters/seconds) * 3600).concat('/h')
}

export function formatMetersPerHour(meters: number, seconds: number) {
    if (!meters || !seconds) {
        return "-"
    }

    return formatToM((meters/seconds) * 3600).concat('/h')
}