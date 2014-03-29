/**
 * Created by jhon on 29/03/14.
 */
var BogoData = {};

BogoData.options = {
    passphrase: 'dg76sdgdfg',
    localStorageItem: 'BgD0'
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

BogoData.initMap = function () {
    var mapCanvas = document.getElementById('map_canvas');
    var mapOptions = {
        center: new google.maps.LatLng(4.670332, -74.086028),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(mapCanvas, mapOptions);

    var georssLayer = new google.maps.KmlLayer('http://api.flickr.com/services/feeds/geo/?g=322338@N20&lang=en-us&format=feed-georss');
    georssLayer.setMap(map);

    BogoData.map = map;

    var html = "<table>" +
        "<tr><td>Name:</td> <td><input type='text' id='name'/> </td> </tr>" +
        "<tr><td>Address:</td> <td><input type='text' id='address'/></td> </tr>" +
        "<tr><td>Type:</td> <td><select id='type'>" +
        "<option value='bar' SELECTED>bar</option>" +
        "<option value='restaurant'>restaurant</option>" +
        "</select> </td></tr>" +
        "<tr><td></td><td><input type='button' value='Save & Close' onclick='saveData()'/></td></tr>";


    var infowindow = new google.maps.InfoWindow({
        content: html
    });

    google.maps.event.addListener(BogoData.map, "click", function (event) {
        marker = new google.maps.Marker({
            position: event.latLng,
            map: BogoData.map
        });
        google.maps.event.addListener(marker, "click", function () {
            infowindow.open(BogoData.map, marker);
        });
    });
}

BogoData.isLoggedIn = function () {

}

google.maps.event.addDomListener(window, 'load', BogoData.init);