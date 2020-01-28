const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Polygon = new Schema({
	type: {type:String, trim:true, default:''},
    properties: {  name : {type:String, trim:true, default:''}},
    geometry:{type: {type:String}, coordinates:[[[Number]]]}
})

module.exports = mongoose.model('Polygon', Polygon)