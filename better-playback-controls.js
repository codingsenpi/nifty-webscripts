// ==UserScript==
// @name         Better Playback Controls UwU
// @namespace    https://codingsenpi.me
// @version      1.0
// @description  Toggle fullscreen (Enter), play/pause (Space), and seek (←/→ with Ctrl skip).
// @author       codingsenpi
// @match        *://*/*
// @grant        none
// ==/UserScript==
(function () {
  "use strict";

  let currentVideo = null;

  function findActiveVideo() {
    const videos = document.querySelectorAll("video");
    for (const video of videos) {
      video.addEventListener(
        "play",
        () => {
          currentVideo = video;
        },
        { once: true },
      );
    }
  }

  findActiveVideo();

  const observer = new MutationObserver(findActiveVideo);
  observer.observe(document.body, { childList: true, subtree: true });

  function isInputFocused() {
    const tag = document.activeElement.tagName;
    return (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      document.activeElement.isContentEditable
    );
  }

  function blurYouTubeShortsFocus() {
    if (!window.location.hostname.includes("youtube.com")) return;
    const active = document.activeElement;
    if (!active) return;
    if (
      active.closest &&
      (active.closest("#shorts-player") || active.closest("#shorts-container"))
    ) {
      active.blur();
    }
  }

  function onKeyDown(e) {
    if (!currentVideo) return;
    if (isInputFocused()) return;

    blurYouTubeShortsFocus();

    switch (e.key) {
      case "Enter":
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();

        if (window.location.hostname.includes("youtube.com")) {
          const fullscreenBtn = document.querySelector(
            ".ytp-fullscreen-button",
          );
          if (fullscreenBtn) {
            fullscreenBtn.click();
          }
        } else {
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            if (currentVideo.requestFullscreen)
              currentVideo.requestFullscreen();
            else if (currentVideo.webkitRequestFullscreen)
              currentVideo.webkitRequestFullscreen();
            else if (currentVideo.mozRequestFullScreen)
              currentVideo.mozRequestFullScreen();
            else if (currentVideo.msRequestFullscreen)
              currentVideo.msRequestFullscreen();
          }
        }
        break;

      case " ":
        if (!window.location.hostname.includes("youtube.com")) {
          e.preventDefault();
          e.stopImmediatePropagation();
          e.stopPropagation();
          if (currentVideo.paused) {
            currentVideo.play();
          } else {
            currentVideo.pause();
          }
        }
        // Else let YouTube handle spacebar natively
        break;

      case "ArrowRight":
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        currentVideo.currentTime += e.ctrlKey ? 20 : 5;
        break;

      case "ArrowLeft":
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        currentVideo.currentTime -= e.ctrlKey ? 20 : 5;
        break;
    }
  }

  document.addEventListener("keydown", onKeyDown, true);
  window.addEventListener("keydown", onKeyDown, true);
  document.body.addEventListener("keydown", onKeyDown, true);
})();
