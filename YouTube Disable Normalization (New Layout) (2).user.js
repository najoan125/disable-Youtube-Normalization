// ==UserScript==
// @name         YouTube Disable Normalization (New Layout)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Allows true 100% volume on youtube videos.
// @author       Wouter Gerarts
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @grant        none
// ==/UserScript==

var alwaysEnable = true;
var buttonAdded = false;
var isEnabled = true;
var el;
var orgVolume = 1;

(function() {
    'use strict';

    function baseElement() {
        return document.querySelector('#content');
    }

    if (typeof fullVolumeButtonTaskId === 'number') {
        console.log('clearing interval');
        clearInterval(fullVolumeButtonTaskId);
    }

    function createFullVolumeButton() {
        buttonAdded = true;
        el = document.createElement('button');
        el.innerText = '100% 음량 켜짐';
        el.classList.add('full-volume-addon-button');
        //css
        el.style.borderRadius = "25px";
        el.style.height = "36px";
        el.style.border = "none";
        el.style.marginLeft = "7px";
        el.style.backgroundColor = 'green';
        el.style.color = 'white';
        el.style.cursor = 'pointer';
        //onclick
        el.onclick = function() {
            var video = baseElement().querySelector('video');
            if (!isEnabled){
                orgVolume = video.volume
                video.volume = 1;
                el.innerText = '100% 음량 켜짐';
                el.style.backgroundColor = 'green';
                el.style.color = 'white';
                isEnabled = true;
            }
            else {
                video.volume = orgVolume
                el.innerText = '100% 음량 꺼짐';
                el.style.backgroundColor = '#e6e6e6';
                el.style.color = 'black';
                isEnabled = false;
            }
        };
        return el;
    }

    //repeat
    var test = setInterval(function() {
        if (buttonAdded){
            var video = baseElement().querySelector('video');
            var volumeSlider = baseElement().querySelector('.ytp-volume-slider-handle')
            if (volumeSlider === undefined || volumeSlider === null) {
                console.log('volumeSlider not found');
                return;
            }
            var volumeSliderLeftStr = volumeSlider.style.left;
            var volumeSliderLeft = volumeSliderLeftStr.substr(0, volumeSliderLeftStr.length - 2);
            var volumeSliderValue = parseFloat(volumeSliderLeft) * 2.5;
            if (video.volume != 1 && isEnabled && volumeSliderValue === 100) {
                orgVolume = video.volume
                video.volume = 1;
            }
        }
    }, 500);

    function round (num, sig) {
        var mult = Math.pow(10, sig);
        return Math.round(num * mult) / mult;
    }

    var fullVolumeButtonTaskId = setInterval(function() {
        if (baseElement().querySelector('video') === undefined) {
            console.log('video element not found');
            return;
        }
        if (baseElement().querySelector('.full-volume-addon-button') != undefined) {
            console.log('full volume addon button already found');
            clearInterval(fullVolumeButtonTaskId);
            return;
        }
        var volumeSlider = baseElement().querySelector('.ytp-volume-slider-handle')
        if (volumeSlider === undefined || volumeSlider === null) {
            console.log('volumeSlider not found');
            return;
        }
        var video = baseElement().querySelector('video');
        var volumeSliderLeftStr = volumeSlider.style.left;
        var volumeSliderLeft = volumeSliderLeftStr.substr(0, volumeSliderLeftStr.length - 2);
        var volumeSliderValue = parseFloat(volumeSliderLeft) * 2.5;
        console.log('Checking slider ' + round(volumeSliderValue / 100, 2).toString() + ' against value ' + round(video.volume, 2).toString());
        if (alwaysEnable || volumeSliderValue / 100 > video.volume) {
            // var videoTitleElement = baseElement().querySelector('h1.ytd-watch-metadata.style-scope');
            var videoTitleElement = baseElement().querySelector('#above-the-fold');
            videoTitleElement.prepend(createFullVolumeButton());
        } else {
            console.log('volume slider did not meet criteria for Full Volume button');
        }
    }, 500);
})();
