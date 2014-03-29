/**
 * Created by jhon on 29/03/14.
 */
var BogoData = {};

BogoData.options = {
    passphrase: 'dg76sdgdfg',
    localStorageItem: 'BgD0'
};

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
                localStorage.setItem(BogoData.options.localStorageItem, encrypted);

                $("#signInButton").hide();
                $("#signOutButton").show();

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

    BogoData.map = map;
}

BogoData.isLoggedIn = function () {

}

google.maps.event.addDomListener(window, 'load', BogoData.init);