var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DatasetSchema = new Schema({
    type: Boolean, // dataset type: -1=Bad, 1=Good
    name: {type: String, unique: true}, // dataset name
    description: {type: String, unique: true}, //description of the dataset
    title: String, // title of the dataset
    category: String, //category of the dataset. e.g. theft or traffic
    tags: [
        {
            name: String
        }
    ],
    dataTemplate: Schema.Types.Mixed,
    reports: [
        {
            user: {type: Schema.ObjectId, ref: 'User'},
            latitude: Number,
            longitude: Number,
            detail: String,
            status: String,
            createdDate: {type: Date, default: Date.now}, // Fecha de creación
            data: Schema.Types.Mixed, // An instance of the data template.
            votes: [
                {
                    user: {type: Schema.ObjectId, ref: 'User'},
                    type: Boolean 
                }
            ]
        }
    ],
    createdAt: {type: Date, default: Date.now} // Fecha de creación
});

module.exports.model = function(){
    var Dataset = mongoose.model('Dataset', DatasetSchema);
};

module.exports.schema = DatasetSchema;
