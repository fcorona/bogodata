module.exports.addDataset = function(req, res) {

    var dataset = req.body;
    
    var newDataset = new Dataset({

        type: dataset.type,
        name: dataset.name,
        description: dataset.description,
        title: dataset.title,
        category: dataset.category,

        tags: dataset.tags,
        reports: dataset.reports
    });

    var saveCallback = function(error, result) {

        if (error) {
            console.error(error);
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
        } else {
            res.status(200).json(result);
        }
    };

    Dataset.find(findCallback);
};

module.exports.getDatasetById = function() {

    var getDatasetByIdCallback = function(result) {
        if (error) {
            console.error(error);
        } else {
            res.status(200).json(result);
        }
    };

    var datasetId = res.params.datasetId;
    Dataset.findById(datasetId, getDatasetByIdCallback);
};
