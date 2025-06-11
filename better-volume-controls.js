// ==UserScript==
// @name         Better Volume controls
// @namespace    https://codingsenpi.me
// @version      1.0
// @description  Volume Controls on Youtube and Instagram UwU
// @author       codingsenpi
// @match        *://www.instagram.com/*
// @match        *://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const VOLUME_STEP = 0.05;
    let lastVolume = 1.0;
    let isMuted = false;

    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.bottom = '10px';
    overlay.style.right = '10px';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
    overlay.style.color = 'white';
    overlay.style.padding = '6px 12px';
    overlay.style.borderRadius = '6px';
    overlay.style.fontSize = '16px';
    overlay.style.fontFamily = 'monospace';
    overlay.style.zIndex = 9999;
    overlay.style.display = 'none';
    document.body.appendChild(overlay);

    function showOverlay(text) {
        overlay.textContent = text;
        overlay.style.display = 'block';
        clearTimeout(overlay.timeout);
        overlay.timeout = setTimeout(() => {
            overlay.style.display = 'none';
        }, 1000);
    }

    function getActiveVideos() {
        // Only return playing or visible videos
        return Array.from(document.querySelectorAll('video')).filter(v => {
            const rect = v.getBoundingClientRect();
            return rect.height > 0 && rect.width > 0;
        });
    }

    function adjustVolume(direction) {
        const videos = getActiveVideos();
        let adjusted = false;
        for (const video of videos) {
            if (video.muted) video.muted = false;
            let newVolume = video.volume + direction * VOLUME_STEP;
            newVolume = Math.max(0, Math.min(1, newVolume));
            video.volume = newVolume;
            lastVolume = newVolume;
            isMuted = false;
            adjusted = true;
        }
        if (adjusted) showOverlay(`Volume: ${(lastVolume * 100).toFixed(0)}%`);
    }

    function toggleMute() {
        const videos = getActiveVideos();
        let anyMuted = false;
        for (const video of videos) {
            video.muted = !video.muted;
            anyMuted = video.muted;
        }
        isMuted = anyMuted;
        showOverlay(isMuted ? `Muted` : `Unmuted`);
    }

    const observer = new MutationObserver(() => {
        getActiveVideos().forEach(video => {
            video.volume = lastVolume;
            video.muted = isMuted;
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

   window.addEventListener('keydown', (e) => {
    const isVideoActive = getActiveVideos().length > 0;
    if (!isVideoActive) return;

    switch (e.key) {
        case 'ArrowUp':
            e.preventDefault();
            e.stopImmediatePropagation(); 
            adjustVolume(1);
            break;
        case 'ArrowDown':
            e.preventDefault();
            e.stopImmediatePropagation();
            adjustVolume(-1);
            break;
        case 'm':
        case 'M':
            e.preventDefault();
            e.stopImmediatePropagation(); 
            toggleMute();
            break;
    }
}, true);

})();

