var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DatasetSchema = new Schema({
    type: Number, // dataset type: -1=Bad, 1=Good
    name: {type: String, unique: true}, // dataset name
    description: {type: String, unique: true}, //description of the dataset
    title: String, // title of the dataset
    category: String, //category of the dataset. e.g. theft or traffic
    tags: [
        {
            name: String
        }
    ],
    reports: [
        {
            user: {type: Schema.ObjectId, ref: 'User'},
            latitude: String,
            longitude: String,
            detail: String,
            status: Number,
            votes: [
                {
                    user: {type: Schema.ObjectId, ref: 'User'},
                    type: Number
                }
            ]
        }
    ],
    createdAt: {type: Date, default: Date.now} // Fecha de creación
});

module.exports.model = function(){
    var Dataset = mongoose.model('Dataset', DatasetSchema);
}

module.exports.schema = DatasetSchema;