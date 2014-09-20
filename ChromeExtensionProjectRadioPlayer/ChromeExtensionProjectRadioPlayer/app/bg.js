var audioElement = document.createElement('audio');
audioElement.setAttribute("preload", "auto", "controls");
//audioElement.autobuffer = true;

var source = document.createElement('source');
source.type = 'audio/mpeg';

//var id = "koigdohkoimhiiojnhiakphibiinfdpi";
var id = chrome.runtime.id;
console.log("id: " + id);

function reloadExtension(id) {
    chrome.management.setEnabled(id, false, function () {
        chrome.management.setEnabled(id, true);
    });
}

chrome.extension.onMessage.addListener(
   function (request, sender, sendResponse) {
       source.src = request.link;
       audioElement.appendChild(source);

       if (request.action == "play") {
           audioElement.load();
           //console.log("in play");
           audioElement.play();
       }
       if (request.action == "stop") {
           //console.log("in stop");
           audioElement.pause();
       }
       if (request.action == "volumePlus") {
           audioElement.volume += .2;
       }
       if (request.action == "volumeMinus") {
           audioElement.volume -= .2;
       }
       if (request.action == "volumeReset") {
           var vol = request.volume / 100;
           audioElement.volume = vol;
       }
       if (request.action == "mute") {
           var vol = 0;
           audioElement.volume = vol;
       }
       if (request.action == "reload") {
           //reloadExtension(id);
           chrome.runtime.reload();
       }
   });