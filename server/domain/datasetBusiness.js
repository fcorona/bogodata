var mongoose = require('mongoose');
var Dataset = mongoose.model('Dataset');

module.exports.addDataset = function(req, res) {

    var dataset = req.body;

    var newDataset = new Dataset({

        type: dataset.type,
        name: dataset.name,
        description: dataset.description,
        title: dataset.title,
        category: dataset.category,

        tags: dataset.tags,
        dataTemplate: dataset.dataTemplate,
        reports: dataset.reports
    });

    var saveCallback = function(error, result) {

        if (error) {
            console.error(error);
            res.status(500).json(error);
        } else {
            res.status(201).json(result);
        }
    };

    newDataset.save(saveCallback);
};

module.exports.getAllDatasets = function(req, res) {

    var findCallback = function(error, result) {

        if (error) {
            console.error(error);
            res.status(500).json(error);
        } else {
            res.status(200).json(result);
        }
    };

    Dataset.find(findCallback);
};

module.exports.getDatasetByName = function(req, res) {

    var getDatasetByNameCallback = function(error, result) {

        if (error) {
            console.error(error);
            res.status(500).json(error);
        } else {
            res.status(200).json(result);
        }
    };

    var datasetName = req.params.datasetName;
    Dataset.findOne({ name: datasetName }, getDatasetByNameCallback);
};

function reportDataMatchesDatasetDataTemplate(dataTemplate, reportData) {

    var dataTemplateKeys = Object.keys(dataTemplate);
    var reportDataKeys = Object.keys(reportData);

    var answer = false;

    if (dataTemplateKeys.length == reportDataKeys.length) {

        var areTheSame = true;

        for (var i = 0; i < dataTemplateKeys.length && areTheSame; i++) {

            areTheSame = dataTemplateKeys[i] === reportDataKeys[i];
        }

        answer = areTheSame;
    }

    return answer;
};

module.exports.addReportToDataset = function(req, res) {

    var getDatasetByNameCallback = function(error, dataset) {

        if (error) {

            console.error(error);
            res.status(500).json(error);

        } else {

            if (reportDataMatchesDatasetDataTemplate(dataset.dataTemplate, newReport.data)) {

                var saveCallback = function(error, result) {

                    if (error) {
                        console.error(error);
                        res.status(500).json(error);
                    } else {
                        res.status(200).json("The report was successfully added to the dataset.");
                    }
                };

                dataset.reports.push(newReport);
                dataset.save(saveCallback);
            }
        }
    };

    var datasetName = req.params.datasetName;

    console.log(datasetName);

    var newReport = req.body;
    Dataset.findOne({ name: datasetName }, getDatasetByNameCallback);
};

module.exports.getReportsFromDataset = function(req, res) {

    var getDatasetByNameCallback = function(error, dataset) {

        if (error) {
            console.error(error);
            res.status(500).json(error);
        } else {
            res.status(200).json(dataset.reports);
        }
    };

    var datasetName = req.params.datasetName;
    Dataset.findOne({ name: datasetName }, getDatasetByNameCallback);
};

module.exports.getReportFromDataset = function(req, res) {

    var getDatasetByNameCallback = function(error, dataset) {

        if (error) {
            console.error(error);
            res.status(500).json(error);
        } else {
            res.status(200).json(dataset.reports.id(reportId));
        }
    };

    var datasetName = req.params.datasetName;
    var reportId = req.params.reportId;
    Dataset.findOne({ name: datasetName }, getDatasetByNameCallback);
};

function getKmlCoordinates(datasetReports) {

    var coordinatesArray = [];

    for (var i = 0; i < datasetReports.length; i++) {

        var reportCoordinates = datasetReports[i].longitude + ',' + datasetReports[i].latitude + ',' + 0;
        coordinatesArray.push(reportCoordinates);
    }

    return coordinatesArray;
};

function getJsonKmlFromDataset(dataset) {

    var jsonKml = {

        name: dataset.name,
        description: dataset.description,
        coordinates: getKmlCoordinates(dataset.reports)
    };

    return jsonKml;
};

module.exports.getDatasetKml = function(req, res) {

    var getDatasetByNameCallback = function(error, dataset) {

        if (error) {
            console.error(error);
            res.status(500).json(error);
        } else {

            var fs = require('fs');
            var ejs = require('ejs');
            var jsonKml = getJsonKmlFromDataset(dataset);

            var readFileCallcack = function(error, template) {

                var content = ejs.render(template, jsonKml);
                res.
                res.write(content);
                res.end();
            };

            fs.readFile('./views/kml-template.ejs', 'utf-8', readFileCallcack);
        }
    };

    var datasetName = req.params.datasetName;
    var reportId = req.params.reportId;
    Dataset.findOne({ name: datasetName }, getDatasetByNameCallback);
};
