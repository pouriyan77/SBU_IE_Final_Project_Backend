const mongoose = require('mongoose');

let fieldDescriptorSchema = new mongoose.Schema({
    name : String,
    title : String,
    type : String,
    required : Boolean,
    options : []
});

let formDescriptorSchema = new mongoose.Schema({
    title : String,
    id : Number,
    fields : [fieldDescriptorSchema]
});