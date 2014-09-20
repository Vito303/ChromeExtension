function station(name, link) {
    this.name = name;
    this.link = link;
}

var stations = new Array();
stations[0] = new station("Val202", "http://mp3.rtvslo.si/val202");
stations[1] = new station("Radio Koper", "http://mp3.rtvslo.si/rakp");
stations[2] = new station("Radio 1", "http://live3.infonetmedia.si:8000/Radio1PRI");
stations[3] = new station("Radio Center", "http://212.18.63.51:8038/;");
stations[4] = new station("Radio Hit", "http://live.radiohit.si:9560/;");
stations[5] = new station("Radio Antena", "http://live2.infonetmedia.si:8000/Antena");
stations[6] = new station("Radio Ekspres", "http://93.103.13.156:8000/;");
stations[7] = new station("Radio Dur", "http://ph.dur.si/dur");
stations[8] = new station("Radio Radio 4 YoU", "http://livestream.radio4you.cc:7057/;");
stations[9] = new station("Radio Dzungla", "http://www.mobile.ba:16000/;");
stations[10] = new station("Radio Naxi", "http://naxi128.streaming.rs:9150/;");
stations[11] = new station("Radio Jazz", "http://sc01.warpradio.com:8216/;");
stations[12] = new station("Radio Deejay", "http://mp3.kataweb.it:8000/RadioDeejay");

if (localStorage["SelectedStationValue"] != null) {
    var val = localStorage["SelectedStationValue"];
} else {
    var val = 0;
}

if (localStorage["SelectedVolumeValue"] != null) {
    var volumer = localStorage["SelectedVolumeValue"];
} else {
    var volumer = 0;
}

function hasClass(elem, className) {
    return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
}

window.onload = function () {
    var volumeChange = function () {
        var vol = sliderVol.getValue();
        localStorage["SelectedVolumeValue"] = vol;
        console.log("vol:" + vol);
        if ($('#btnMute').hasClass('icon-volume-low')) {
            $('#btnMute').removeClass('highlite');
            $('#btnMute').removeClass('icon-volume-low');
            $('#btnMute').addClass('icon-volume-medium');
        };
        chrome.extension.sendMessage({ action: "volumeReset", volume: vol });
    };

    var sliderVol = $('#ex1').slider({
        tooltip:'hide',
        formater: function (value) {
            return 'Current value: ' + value;
        }
    }).on('slide', volumeChange).data('slider');;

    chrome.extension.sendMessage({ action: "volumeReset", volume: volumer });
    sliderVol.setValue(parseInt(volumer));

    if (localStorage["SelectedPlay"] == "true") {
        $('#btnPlay').addClass('highlite');
    };

    if (localStorage["SelectedMute"] == "true") {
        $('#btnMute').addClass('highlite');
        $('#btnMute').removeClass('icon-volume-medium');
        $('#btnMute').addClass('icon-volume-low');
        chrome.extension.sendMessage({ action: "mute" });
    };

    $('.selectpicker').selectpicker({
        style: 'btn-info',
        size: 'false' /*'auto'*/
    });

    $('.selectpicker').selectpicker('val', val);
    $('.selectpicker').selectpicker('render');

    $('#btnPlay').click(function () {
        val = $('.selectpicker option:selected').val();
        localStorage["SelectedStationValue"] = val;
        localStorage["SelectedPlay"] = "true";
        var stationLink = stations[val].link;
        //$('#btnStop').removeClass('highlite');
        $('#btnPlay').addClass('highlite');
        chrome.extension.sendMessage({ action: "play", link: stationLink });
    });

    $('#btnStop').click(function () {
        $('#btnPlay').removeClass('highlite');
        //$('#btnStop').addClass('highlite');
        delete localStorage["SelectedStationValue"];
        localStorage["SelectedPlay"] = "false";
        chrome.extension.sendMessage({ action: "stop" });
    });

    $('#btnVolumePlus').click(function () {
        chrome.extension.sendMessage({ action: "volumePlus" });
    });

    $('#btnVolumeMinus').click(function () {
        chrome.extension.sendMessage({ action: "volumeMinus" });
    });

    $('#btnReload').click(function () {
        delete localStorage["SelectedStationValue"];
        chrome.extension.sendMessage({ action: "reload" });
    });
    $('#btnMute').click(function() {
        if ($('#btnMute').hasClass('icon-volume-medium')) {
            $('#btnMute').removeClass('icon-volume-medium');
            $('#btnMute').addClass('icon-volume-low');
            $('#btnMute').addClass('highlite');
            localStorage["SelectedMute"] = "true";
            chrome.extension.sendMessage({ action: "mute" });
        } else {
            $('#btnMute').removeClass('highlite');
            $('#btnMute').removeClass('icon-volume-low');
            $('#btnMute').addClass('icon-volume-medium');
            localStorage["SelectedMute"] = "false";
            chrome.extension.sendMessage({ action: "volumeReset", volume: volumer });
            sliderVol.setValue(parseInt(volumer));
        }
    });
};
