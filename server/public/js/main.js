/**
 * Created by jhon on 29/03/14.
 */
var BogoData = {};

BogoData.options = {
    passphrase: 'dg76sdgdfg',
    localStorageItem: 'BgD0',
    localStorageDataset: 'DseT'
};

BogoData.markersArray = [];

BogoData.init = function () {
    BogoData.initMap();
    BogoData.setRoutes();
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

            $.ajax({
                url: "/datasets"
            }).done(function (data) {
                    $.each(data, function () {
                        options.append($("<option />").val(this._id).text(this.title));
                    });

                    options.change(function () {
                        var selected;
                        $.each(data, function () {
                            if (this._id === options.val()) {
                                localStorage.setItem(BogoData.options.localStorageDataset, JSON.stringify(this));
                            }
                        });

                        selectDatasetDialog.dialog('close');
                        placeMarker();
                    });

                }).fail(function (jqXHR, textStatus, errorThrown) {
                    options.append($("<option />").val(0).text("No hay datasets"));
                });
        }

        //load template first
        $.get('/templates/hurtosForm.html', templateLoaded);

    });
}

BogoData.initMap = function () {
    var mapCanvas = document.getElementById('map_canvas');
    var mapOptions = {
        center: new google.maps.LatLng(4.670332, -74.086028),
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
            console.log(data);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        });
}

BogoData.cancelReport = function () {
    BogoData.marker.setMap(null);
}

google.maps.event.addDomListener(window, 'load', BogoData.init);