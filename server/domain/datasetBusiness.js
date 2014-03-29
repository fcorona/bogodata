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

module.exports.getDatasetById = function(req, res) {

    var getDatasetByIdCallback = function(error, result) {

        if (error) {
            console.error(error);
            res.status(500).json(error);
        } else {
            res.status(200).json(result);
        }
    };

    var datasetId = req.params.datasetId;
    Dataset.findById(datasetId, getDatasetByIdCallback);
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

    var getDatasetByIdCallback = function(error, dataset) {

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

    var datasetId = req.params.datasetId;
    var newReport = req.body;
    Dataset.findById(datasetId, getDatasetByIdCallback);
};

module.exports.getReportsFromDataset = function(req, res) {

    var getDatasetByIdCallback = function(error, dataset) {

        if (error) {
            console.error(error);
            res.status(500).json(error);
        } else {
            res.status(200).json(dataset.reports);
        }
    };

    var datasetId = req.params.datasetId;
    Dataset.findById(datasetId, getDatasetByIdCallback);
};

module.exports.getReportFromDataset = function(req, res) {

    var getDatasetByIdCallback = function(error, dataset) {

        if (error) {
            console.error(error);
            res.status(500).json(error);
        } else {
            res.status(200).json(dataset.reports.id(reportId));
        }
    };

    var datasetId = req.params.datasetId;
    var reportId = req.params.reportId;
    Dataset.findById(datasetId, getDatasetByIdCallback);
};
