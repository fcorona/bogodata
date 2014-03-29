/**
 * Created by jhon on 29/03/14.
 */
var BogoData = {};

BogoData.options = {
    passphrase: 'dg76sdgdfg',
    localStorageItem: 'BgD0',
    localStorageDataset: 'DseT',
    localStorageAllDatasets: 'ADseTs'
};

BogoData.markersArray = [];

BogoData.init = function () {
    BogoData.initMap();
    BogoData.showDoc();
    BogoData.loadLayers();
    BogoData.setRoutes();

}

BogoData.showDoc = function(){
    $("#showDoc").dialog({
        modal: true,
        width:750
    });

    $(function() {
        $('.jcarousel').jcarousel();
    });

}

BogoData.toggleLayer = function (id, name) {
    var check = $("#layer_" + id);

    if (check.is(':checked')) {
        BogoData.togglePoints(id, name, false);
    } else {
        BogoData.togglePoints(id, name, true);
    }
}

BogoData.markers = [];
BogoData.infoWindow;

BogoData.togglePoints = function (id, name, hide) {
    if (!hide) {
        $.ajax({
            url: "/datasets/" + name
        }).done(function (data) {

                //first delete all if any
                if (!(typeof BogoData.markers[name] == 'undefined')) {
                    $.each(BogoData.markers[name], function () {
                        this.setMap(null);
                    });
                }

                //then repopulate
                $.each(data.reports, function () {

                    var image = '/img/icons/pin-robo.png';


                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(this.latitude, this.longitude),
                        map: BogoData.map,
                        title: this.title,
                        icon: image
                    });

                    var that = this;

                    google.maps.event.addListener(marker, 'click', function() {

                        var templateLoaded = function (template) {

                            var html = $.tmpl(template, {that: that, data: data}).html();

                            if (BogoData.infoWindow) {
                                BogoData.infoWindow.close();
                            }

                            BogoData.infoWindow = new google.maps.InfoWindow({
                                content: html
                            });
                            BogoData.infoWindow.open(BogoData.map,marker);
                        }

                        $.get('/templates/infowindow.html', templateLoaded);

                    })

                    if (typeof BogoData.markers[name] == 'undefined') {
                        BogoData.markers[name] = [];
                    }

                    BogoData.markers[name].push(marker);
                    marker.setMap(BogoData.map);
                });
            }).fail(function (jqXHR, textStatus, errorThrown) {
                alert("Error");
            });
    } else {
        if (!(typeof BogoData.markers[name] == 'undefined')) {
            $.each(BogoData.markers[name], function () {
                this.setMap(null);
            });
        }
    }
}

BogoData.loadLayers = function () {
    $.ajax({
        url: "/datasets"
    }).done(function (data) {
            localStorage.setItem(BogoData.options.localStorageAllDatasets, JSON.stringify(data));

            var templateLoaded = function (template) {

                var html = $.tmpl(template, data).appendTo("#selectLayers");

                var selectLayersDiv = $("#selectLayers");
                selectLayersDiv.dialog({
                    dialogClass: "no-close",
                    title: "Datos",
                    position: "left"
                });
            }

            $.get('/templates/layers.html', templateLoaded);

        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert("Error");
        });
}

BogoData.setRoutes = function () {
    $.router.add('/auth/refresh', function () {
        $.ajax({
            url: "/auth/user"
        }).done(function (data) {
                var encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), BogoData.options.passphrase);
                //var decrypted = CryptoJS.AES.decrypt(encrypted, BogoData.options.passphrase);
                if (data) {
                    $("#signInButton").hide();
                    $("#signOutButton").show();
                    localStorage.setItem(BogoData.options.localStorageItem, encrypted);
                } else {
                    $("#signInButton").show();
                    $("#signOutButton").hide();
                    localStorage.removeItem(BogoData.options.localStorageItem);
                }
                //reset URL
                $.router.go("/", "");

            }).fail(function (jqXHR, textStatus, errorThrown) {
                $("#signInButton").show();
                $("#signOutButton").hide();
                localStorage.removeItem(BogoData.options.localStorageItem);
                //reset URL
                $.router.go("/", "");
            });
    });
}

BogoData.showSignIn = function () {
    $("#signIn").dialog({
        modal: true
    });
}

BogoData.setUpActions = function () {
    google.maps.event.addListener(BogoData.map, "click", function (event) {

        var templateLoaded = function (template) {

            var html = $.tmpl(template).html();

            var infowindow = new google.maps.InfoWindow({
                content: html
            });

            var selectDatasetDialog = $("#selectDataset");

            selectDatasetDialog.dialog({
                modal: true
            });

            var placeMarker = function () {

                if (BogoData.marker) {
                    BogoData.marker.setMap(null);
                }

                BogoData.marker = new google.maps.Marker({
                    position: event.latLng,
                    draggable: true,
                    map: BogoData.map
                });

                infowindow.open(BogoData.map, BogoData.marker);

                google.maps.event.addListener(BogoData.marker, "click", function () {
                    infowindow.open(BogoData.map, BogoData.marker);
                });
            }

            var options = $("#selectDatasetShowDatasets");
            //reset
            options.find('option').remove().end().append('<option value="-1">Escoga una opción</option>');

            var dataSets = JSON.parse(localStorage.getItem(BogoData.options.localStorageAllDatasets));

            $.each(dataSets, function () {
                options.append($("<option />").val(this._id).text(this.title));
            });

            options.change(function () {
                var selected;
                $.each(dataSets, function () {
                    if (this._id === options.val()) {
                        localStorage.setItem(BogoData.options.localStorageDataset, JSON.stringify(this));
                    }
                });

                selectDatasetDialog.dialog('close');
                placeMarker();
            });
        }

        var templateUrl = '/templates/hurtosForm.html';

        var currentDataSet = JSON.parse(localStorage.getItem(BogoData.options.localStorageDataset));

        console.log(currentDataSet);

        if(currentDataSet.name == "Movilidad"){
            templateUrl = '/templates/movilidadForm.html';
        }

        //load template first
        $.get(templateUrl, templateLoaded);

    });
}

BogoData.initMap = function () {
    var mapCanvas = document.getElementById('map_canvas');

    var bogota = new google.maps.LatLng(4.670332, -74.086028);

    var mapOptions = {
        center: bogota,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(mapCanvas, mapOptions);

    BogoData.map = map;

    BogoData.setUpActions();
}


BogoData.report = function () {

    var postData = {
        latitude: BogoData.marker.position.k,
        longitude: BogoData.marker.position.A,
        detail: $("#detailInput").val(),
        data: {
            tipoRobo: $("#tipoRobo").val()
        }
    }

    var selectedDataset = JSON.parse(localStorage.getItem(BogoData.options.localStorageDataset));

    $.ajax({
        url: "/datasets/" + selectedDataset.name + "/reports",
        type: "POST",
        data: postData
    }).done(function (data) {
            BogoData.cancelReport();
            var currentDataSet = JSON.parse(localStorage.getItem(BogoData.options.localStorageDataset));

            var check = $("#layer_" + currentDataSet._id);

            check.prop('checked', true);

            var isChecked = check.is(':checked');
            //toggle all again
            BogoData.togglePoints(currentDataSet._id, currentDataSet.name, !isChecked);

        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        });
}

BogoData.related = function(){

    BogoData.getHurtoAPersonas();

    $("#stats").show();

    $("#stats").dialog({
        modal: true,
        width: 430
    });
}

BogoData.cancelReport = function () {
    BogoData.marker.setMap(null);
}

BogoData.getHurtoAPersonas = function() {


    var apis = ['http://api.bogotacomovamos.org/api/datas/77/?key=comovamos/',
                        'http://api.bogotacomovamos.org/api/datas/82/?key=comovamos/',
                        'http://api.bogotacomovamos.org/api/datas/83/?key=comovamos/',
                        'http://api.bogotacomovamos.org/api/datas/78/?key=comovamos/',
                        'http://api.bogotacomovamos.org/api/datas/78/?key=comovamos/'
    ];

    $.ajax({
        url: apis[Math.floor(Math.random() * apis.length)],
        type: "GET"
    }).done(function (data) {

            var yearValueMap = data.datas;
            var arrayKeys = Object.keys(yearValueMap);
            var arrayValues = [];

            console.log(arrayKeys);

            for (var i = 0; i < arrayKeys.length; i++) {

                var value = yearValueMap[arrayKeys[i]];
                arrayValues.push(value);
            }

            console.log(arrayValues);

            var data = {

                labels: arrayKeys,
                datasets: [{

                    fillColor : "rgba(151,187,205,0.5)",
                    strokeColor : "rgba(151,187,205,1)",
                    data : arrayValues
                }]
            };


            var ctx = document.getElementById("barChart").getContext("2d");
            var barChart = new Chart(ctx).Bar(data);
        });
};

google.maps.event.addDomListener(window, 'load', BogoData.init);