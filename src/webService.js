const express = require('express');
const configs = require('./configs');
const mongoose = require('mongoose');
const FormDescriptor = require('./models/formDescriptor')
const Polygon = require('./models/polygon')
const cors = require('cors')

mongoose.connect(configs.DATABASE_URL, {useUnifiedTopology: true, useNewUrlParser: true}, (error => {
    if(error)
    {
        console.log(error);
    }
    else
    {
        console.log("Connected to database.")
    }
}))

const app = express();

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.use(cors());

app.get('/form_descriptors', (req, res) => {

	FormDescriptor.find()
	.then(formDescriptors => {
		res.json({
			result: 'success',
			data: formDescriptors
		})
	})
	.catch(err => {
		res.status(400).json({
			result: 'failure',
			data: err.message
		})
	})
})

app.post('/form_descriptors', (req, res) => {

    const title = req.body.title
    if(title == null || title ==='')
    {
        res.status(400).json({
			result: 'failure',
			data: 'empty form title'
        })
        next()
    }

    FormDescriptor.create(req.body)
	.then(formDescriptor => {
		res.json({
			result: 'success',
			data: formDescriptor
		})
	})
	.catch(err => {
		res.status(400).json({
			result: 'failure',
			data: err.message
		})
	})
})

app.put('/form_descriptors', (req, res) => {

    let id = req.query.id
    delete req.query.id
	FormDescriptor.findByIdAndUpdate(id, req.query, {new:true})
	.then(formDescriptor => {
		res.json({
			result: 'success',
			data: formDescriptor
		})
	})
	.catch(err => {
		res.status(400).json({
			result: 'failure',
			data: err.message
		})
	})
})

app.delete('/form_descriptors', (req, res) => {

    let id = req.query.id
	FormDescriptor.findByIdAndDelete(id)
	.then(formDescriptor => {
		res.json({
			result: 'success',
			data: formDescriptor
		})
	})
	.catch(err => {
		res.status(400).json({
			result: 'failure',
			data: err.message
		})
	})
})

app.get('/areas', (req, res) => {

	Polygon.find()
	.then(polygons => {
		res.json({
			result: 'success',
			data: polygons
		})
	})
	.catch(err => {
		res.status(400).json({
			result: 'failure',
			data: err.message
		})
	})
})

app.post('/areas', (req, res) => {

    const geometry = req.body.geometry
    if(geometry == null)
    {
        res.status(400).json({
			result: 'failure',
			data: 'geometry is empty'
        })
        next();
    }
    const coordinates = geometry.coordinates[0]
    if(coordinates == null || coordinates.length < 4)
    {
        res.status(400).json({
			result: 'failure',
			data: 'coordinates must have four points at least'
        })
        next();
    }

	Polygon.create(req.body)
	.then(polygon => {
		res.json({
			result: 'success',
			data: polygon
		})
	})
	.catch(err => {
		res.status(400).json({
			result: 'failure',
			data: err.message
		})
	})
})

app.put('/areas', (req, res) => {

    // just can update name of polygon
    let id = req.query.id
    delete req.query.id
    const name = req.query.name
    if(name == null)
    {
        res.status(400).json({
			result: 'failure',
			data: "new name required"
        })
        next();
    }
    const newName = { $set: { properties: req.query }};
	Polygon.findByIdAndUpdate(id, newName, {new:true})
	.then(polygon => {
		res.json({
			result: 'success',
			data: polygon
		})
	})
	.catch(err => {
		res.status(400).json({
			result: 'failure',
			data: err.message
		})
	})
})

app.delete('/areas', (req, res) => {

    let id = req.query.id
	Polygon.findByIdAndDelete(id)
	.then(polygon => {
		res.json({
			result: 'success',
			data: polygon
		})
	})
	.catch(err => {
		res.status(400).json({
			result: 'failure',
			data: err.message
		})
	})
})

app.post('/forms', (req, res) => {

    console.log(req.body);
    console.log("SALAM");
    res.send("SALAM ASSISAM")
})

let port = process.env.PORT || configs.PORT
app.listen(port, () => {
    console.log("App Is Running:")
})