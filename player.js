'use strict';
const video = document.getElementById('video');
const button = document.getElementById('play');
const status = document.getElementById('status');
let finished = false;
let starting = false;

async function play() {
  if (finished || starting) return;
  starting = true;
  try {
    await video.play();
    button.hidden = true;
  } catch (error) {
    if (!finished && !video.error) button.hidden = false;
  } finally {
    starting = false;
  }
}

button.addEventListener('click', play);
video.addEventListener('click', () => {
  if (finished) return;
  if (video.paused) play();
  else video.pause();
});
document.addEventListener('keydown', event => {
  if (event.target === button || event.repeat || finished || !['Space', 'KeyK'].includes(event.code)) return;
  event.preventDefault();
  if (video.paused) play();
  else video.pause();
});
video.addEventListener('pause', () => {
  if (!finished && !video.ended) {
    button.hidden = false;
    button.setAttribute('aria-label', 'Resume video');
  }
});
video.addEventListener('play', () => {
  if (finished) video.pause();
  else button.hidden = true;
});
video.addEventListener('ended', () => {
  finished = true;
  button.hidden = true;
  status.textContent = 'Video finished. Refresh the page to watch again.';
});
video.addEventListener('error', () => {
  button.hidden = true;
  status.className = 'error';
  status.textContent = 'The video could not be loaded. Please refresh and try again.';
});
// State belongs to this page load; refresh starts a new viewing.
play();
