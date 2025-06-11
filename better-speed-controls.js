// ==UserScript==
// @name         Better Speed Control UwU
// @namespace    https://codingsenpi.me
// @version      1.0
// @description  Adjust playback speed using [, ], and \ on any website UwU
// @author       codingsenpi
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let currentVideo = null;

    // Speed overlay
    const speedOverlay = document.createElement('div');
    speedOverlay.style.position = 'fixed';
    speedOverlay.style.bottom = '10px';
    speedOverlay.style.right = '10px';
    speedOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    speedOverlay.style.color = 'white';
    speedOverlay.style.padding = '5px 10px';
    speedOverlay.style.borderRadius = '5px';
    speedOverlay.style.zIndex = 9999;
    speedOverlay.style.fontSize = '16px';
    speedOverlay.style.fontFamily = 'monospace';
    speedOverlay.style.display = 'none';
    document.body.appendChild(speedOverlay);

    function updateOverlay(text) {
        speedOverlay.textContent = text;
        speedOverlay.style.display = 'block';
        clearTimeout(speedOverlay.timeout);
        speedOverlay.timeout = setTimeout(() => {
            speedOverlay.style.display = 'none';
        }, 1000);
    }

    function findActiveVideo() {
        const videos = document.querySelectorAll('video');
        for (const video of videos) {
            video.addEventListener('play', () => {
                currentVideo = video;
            }, { once: true });
        }
    }

    findActiveVideo();
    const observer = new MutationObserver(findActiveVideo);
    observer.observe(document.body, { childList: true, subtree: true });

    function isInputFocused() {
        const tag = document.activeElement.tagName;
        return tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement.isContentEditable;
    }

    document.addEventListener('keydown', function (e) {
        if (!currentVideo || isInputFocused()) return;

        switch (e.key) {
            case ']':
                e.preventDefault();
                currentVideo.playbackRate = Math.min(currentVideo.playbackRate + 0.1, 16);
                updateOverlay(`Speed: ${currentVideo.playbackRate.toFixed(1)}x`);
                break;
            case '[':
                e.preventDefault();
                currentVideo.playbackRate = Math.max(currentVideo.playbackRate - 0.1, 0.1);
                updateOverlay(`Speed: ${currentVideo.playbackRate.toFixed(1)}x`);
                break;
            case '\\':
                e.preventDefault();
                currentVideo.playbackRate = 1.0;
                updateOverlay(`Speed: 1.0x`);
                break;
        }
    }, true);
})();

