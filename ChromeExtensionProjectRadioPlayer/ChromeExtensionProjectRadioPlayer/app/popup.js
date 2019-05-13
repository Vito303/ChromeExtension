var stations = [];

function station(name, link) {
    this.name = name;
    this.link = link;
};

function getArray() {
    //http://www.listenlive.eu/slovenia.html
    return $.getJSON('data/stations.json');
};

var index = 0;

getArray().done(function (json) {
    $.each(json, function (key, val) {
        $.each(val, function (key, val) {
            stations[index++] = new station(val.name, val.link);
        });        
    });
});

if (localStorage["SelectedStationValue"] != null) {
    var val = localStorage["SelectedStationValue"];
} else {
    var val = 0;
};

if (localStorage["SelectedVolumeValue"] != null) {
    var volumer = localStorage["SelectedVolumeValue"];
} else {
    var volumer = 0;
};

function hasClass(elem, className) {
    return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
};

window.onload = function () {
    $.each(stations, function (key, value) {
        $('#stations')
            .append($('<option>', { value: key })
                .text(value.name));
    });

    var volumeChange = function () {
        var vol = sliderVol.getValue();
        localStorage["SelectedVolumeValue"] = vol;
        //console.log("vol:" + vol);
        if ($('#btnMute').hasClass('icon-volume-low')) {
            $('#btnMute').removeClass('highlite');
            $('#btnMute').removeClass('icon-volume-low');
            $('#btnMute').addClass('icon-volume-medium');
        };
        chrome.extension.sendMessage({ action: "volumeReset", volume: vol });
    };

    var sliderVol = $('#ex1').slider({
        tooltip: 'hide',
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
        //$('#btnStop').addClass('highlite');
        $('#btnPlay').removeClass('highlite');
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

    $('#btnMute').click(function () {
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
