export function formatToKm(meters: number) {
    return (meters / 1000).toFixed(1).concat(" km");
};

export function formatToM(meters: number) {
    return meters.toFixed(0).concat(" m");
};

export function formatTime(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}

export function formatKmPerHour(meters: number, seconds: number) {
    return formatToKm((meters/seconds) * 3.6 * 1000).concat('/h')
}