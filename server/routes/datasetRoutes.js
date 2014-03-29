var datasetBusiness = require('../domain/datasetBusiness');

module.exports = function(app, passport) {

    app.post('/datasets', datasetBusiness.addDataset);

    app.get('/datasets', datasetBusiness.getAllDatasets);

    app.get('/datasets/:datasetId', datasetBusiness.getDatasetById);
};
