var http = require('http');

function getNewDataset(datasetNumber) {

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
            latitude: 123 + datasetNumber,
            longitude: 234 + datasetNumber,
            detail: 'detail' + datasetNumber,
            status: 'NEW' + datasetNumber,
            date: '2014-03-29',
            data: {
                tipoRobo: 'llaves de la casa ' + datasetNumber

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

    return newDataset;
};

function makeHttpPostRequest(numberOfRequests) {

    for (var i = 0; i < numberOfRequests; i++) {

        var postData = JSON.stringify(getNewDataset(i));

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
    }
};

var numberOfRequests = 10;
makeHttpPostRequest(numberOfRequests);
