const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const FormDescriptor = new Schema({
	title: {type:String, trim:true, default:''},
    fields: [{  name : {type:String, trim:true, default:''},
                title : {type:String, trim:true, default:''},
                type : {type:String, enum:{values:["text", "number", "location", "date"], message:"incorrect type"}, trim:true, default:'', },
                required : {type:Boolean, default:true},
                options : [{
                            label : {type:String, trim:true, default:''},
                            value : {type:Schema.Types.Mixed}
                        }]
            }],
    filledForms: [{type:Schema.Types.Mixed}]
})

module.exports = mongoose.model('FormDescriptor', FormDescriptor)