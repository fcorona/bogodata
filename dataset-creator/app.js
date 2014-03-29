var http = require('http');
var Chance = require('chance');
var chance = new Chance();

function getNewDataset(datasetNumber) {

    var tiposRobo = ["moto", "banco", "residencia", "automovil", "personal"];

    console.log("Available tiposRobo:"+tiposRobo);

    var latitude = chance.floating({min: 4.47, max: 4.70, fixed: 7});
    var longitude = chance.floating({min: -74.20, max: -74.04, fixed: 7});

    console.log("Latitude: "+latitude);
    console.log("Longitude: "+longitude);

    var newDataset = {
        type: 1,
        name: 'Seguridad' + datasetNumber,
        description: 'Dataset de datos de seguridad relacionados con ' + datasetNumber,
        title: 'Seguridad de bogota ' + datasetNumber,
        category: 'seguridad' + datasetNumber,
        tags: [{ name: 'seguridad ' + datasetNumber }, { name: 'ciudadanía ' + datasetNumber }],
        dataTemplate: {
            tipoRobo: ''
        },
        reports: [
            {
            latitude: latitude,
            longitude: longitude,
            detail: 'detail' + datasetNumber,
            status: 'NEW' + datasetNumber,
            date: '2014-03-29',
            data: {
                tipoRobo: tiposRobo[Math.floor(Math.random()*tiposRobo.length)]
            },
            votes: [
                {
                user: 'user' + datasetNumber,
                type: true
            },
            {
                user: 'user3' + datasetNumber,
                type: false
            },
            {
                user: 'user4' + datasetNumber,
                type: true
            }
            ]
        }
        ]
    };

    console.log("New dataset: "+newDataset);

    return newDataset;
};

function makeHttpPostRequest(numberOfRequests) {

    console.log("starting "+numberOfRequests);

    for (var i = 0; i < numberOfRequests; i++) {

        console.log("Inserting dataset #"+i);

        var postData = JSON.stringify(getNewDataset(i));

        console.log("*****************"+postData);

        var postOptions = {

            host: 'bogodata.org',
            port: '80',
            path: '/datasets',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        var postRequest = http.request(postOptions, function(res) {

            res.setEncoding('utf8');
            res.on('data', function (chunk) {

            });
        });

        postRequest.write(postData);
        postRequest.end();

        console.log("Finished");
    }
};

var numberOfRequests = 10;
makeHttpPostRequest(numberOfRequests);
