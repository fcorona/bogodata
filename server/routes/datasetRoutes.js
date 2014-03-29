var datasetBusiness = require('../domain/datasetBusiness');

module.exports = function(app, passport) {

    app.post('/datasets', datasetBusiness.addDataset);

    app.get('/datasets', datasetBusiness.getAllDatasets);

    app.get('/datasets/:datasetName', datasetBusiness.getDatasetByName);

    app.post('/datasets/:datasetName/reports', datasetBusiness.addReportToDataset);

    app.get('/datasets/:datasetName/reports', datasetBusiness.getReportsFromDataset);

    app.get('/datasets/:datasetName/reports/:reportId', datasetBusiness.getReportFromDataset);

    // Get KML from dataset
    app.get('/datasets/:datasetName/kml', datasetBusiness.getDatasetKml);
};
