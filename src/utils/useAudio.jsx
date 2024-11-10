export function playAudio(audio, volume = 1, startTime = 0) {
  audio.volume = volume;
  audio.currentTime = startTime;
  audio.play();
}
