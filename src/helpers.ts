export function formatDistance(meters: number) {
  if (!meters) {
    return;
  }

  if (meters < 1000) {
    return meters.toFixed(0).concat(" m");
  }

  return (meters / 1000).toFixed(1).concat(" km");
}

export function formatTime(seconds: number) {
  if (!seconds) {
    return;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = hours < 10 ? "0" + hours : hours;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export function formatSpeed(speedInMS: number) {
  if (!speedInMS) {
    return;
  }

  const kilometersPerHour = speedInMS * 3.6;
  const metersPerHour = kilometersPerHour * 1000;

  if (kilometersPerHour >= 1) {
    return kilometersPerHour.toFixed(1).concat(" km/h")
  }

  return metersPerHour.toFixed(0).concat(" m/h")
}

export function formatDistancePerHour(meters: number, seconds: number) {
  if (!meters || !seconds) {
      return;
  }

  const result = formatDistance((meters/seconds) * 3600);

  if (!result) {
    return;
  }

  return result.concat('/h')
}

export function formatCalories(kilojoules: number) {
  if (!kilojoules) {
    return;
  }

  const calories = kilojoules * 0.239;
  return calories.toFixed(0).concat(" cal");
}

export function formatHeartrate(heartrate: number) {
  if (!heartrate) {
    return;
  }

  return heartrate.toFixed(0).concat(" bpm")
}