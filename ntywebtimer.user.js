// ==UserScript==
// @name         Fast-forward Timer on Website
// @namespace    https://github.com/itsShiroharu/NTYwebTimer
// @version      1.0
// @description  Skips or speeds up artificial wait + cursor-wait animations
// @author       Shengwei Xiong
// @match        *://*.khaddavi.net/*
// @match        *://*.cararegistrasi.com/*
// @match        *://*.assessschisma.com/*
// @match        *://*.revenuecpmgate.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

// ─────────────────────────────────────────────────────────────────── //
// Hey there. Before you run on TamperMonkey, be sure to change the    //
// website written on @match to your desired website domain. Otherwise //
// the script won't start. Good Luck.                                  //
// ─────────────────────────────────────────────────────────────────── //

(function() {
    'use strict';
    const SPEEDUP = 200;           // Speeds up 200x, from 10s to 2s
                                   // Change the value as you wish

    // ──────────────────────────────────────────────────────────────── //
    //      Very aggressive setTimeout / setInterval monkey-patch       //
    // ──────────────────────────────────────────────────────────────── //
    const originalSetTimeout  = window.setTimeout;
    const originalSetInterval = window.setInterval;

    window.setTimeout = function(callback, delay, ...args) {
        if (typeof delay === 'number' && delay >= 800 && delay <= 15000) {
            console.log("[fastwait] speeding up setTimeout from", delay, "→", delay/SPEEDUP);
            return originalSetTimeout(callback, Math.max(1, delay / SPEEDUP), ...args);
        }
        return originalSetTimeout(callback, delay, ...args);
    };

    window.setInterval = function(callback, delay, ...args) {
        if (typeof delay === 'number' && delay >= 800 && delay <= 15000) {
            console.log("[fastwait] speeding up setInterval from", delay, "→", delay/SPEEDUP);
            return originalSetInterval(callback, Math.max(1, delay / SPEEDUP), ...args);
        }
        return originalSetInterval(callback, delay, ...args);
    };

    // Also patch Promise-based delays
    const originalThen = Promise.prototype.then;
    Promise.prototype.then = function(onFulfilled, onRejected) {
        if (typeof onFulfilled === 'function') {
            const originalFn = onFulfilled;
            onFulfilled = function(...args) {
                if (this instanceof Promise && args.length === 0) {
                    return originalFn.apply(this, args);
                }
                return originalFn.apply(this, args);
            };
        }
        return originalThen.call(this, onFulfilled, onRejected);
    };

    // ──────────────────────────────────────────────────────────────── //
    //      Force-enable & click the button as soon as it appears       //
    // ──────────────────────────────────────────────────────────────── //
    function tryActivateButton() {
        document.querySelectorAll('a.cursor-wait, a.bg-[#1A56DB]\\/70, a:not([href]):not([data-href])').forEach(el => {
            if (el.textContent.includes('Wait') || el.textContent.includes('...')) {
                console.log("[fastwait] found waiting button → forcing activation");

                // Remove waiting classes
                el.classList.remove('cursor-wait', 'bg-[#1A56DB]/70', 'select-none');
                el.classList.add('cursor-pointer', 'bg-[#1A56DB]');

                // Restore text
                if (el.textContent.includes('Wait')) {
                    el.textContent = 'Open';
                }

                // Try to re-attach the original onclick if possible
                if (!el.onclick && el.hasAttribute('data-onclick')) {
                    try {
                        el.onclick = new Function(el.getAttribute('data-onclick'));
                    } catch {}
                }

                // Force click after tiny delay
                setTimeout(() => {
                    if (el.isConnected) {
                        console.log("[fastwait] auto-clicking button");
                        el.click();
                    }
                }, 120);
            }
        });
    }

    // ──────────────────────────────────────────────────────────────── //
    //      Observer – catches button the moment it is added/changed    //
    // ──────────────────────────────────────────────────────────────── //
    new MutationObserver((mutations) => {
        let shouldCheck = false;

        for (const mut of mutations) {
            if (mut.type === 'childList' || mut.type === 'attributes') {
                shouldCheck = true;
                break;
            }
        }

        if (shouldCheck) {
            tryActivateButton();
        }
    }).observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'innerHTML', 'textContent']
    });

    // Initial check + periodic safety net
    setInterval(tryActivateButton, 400);

    // Also try very early
    document.addEventListener('DOMContentLoaded', tryActivateButton, {once: true});
    if (document.readyState !== 'loading') tryActivateButton();

})();
