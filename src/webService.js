const express = require('express');
const configs = require('./configs');
const mongoose = require('mongoose');
const FormDescriptor = require('./models/formDescriptor')
const Polygon = require('./models/polygon')
const cors = require('cors')
const pointInPolygon = require('point-in-polygon')

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

	FormDescriptor.find({}, {filledForms:0})
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

app.get('/form_descriptors/:id', (req, res) => {
    const id = req.params.id

	FormDescriptor.findById(id, {filledForms:0})
	.then(formDescriptor => {
		res.json({
			result: 'success',
			data: [formDescriptor]
		})
	})
	.catch(err => {
		res.json({
			result: 'fail',
			data: 'Form Descritor ' + id + ' not found.'
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
    
    // FormDescriptor.updateOne({id = "sdhgdwej342"}, )

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

    let parentId = req.body.parentId
    console.log(req.body)
    console.log(parentId)
    req.body['_id'] = mongoose.Types.ObjectId()

    let filledFields = req.body['filledFields']

    let allPolygons = undefined
    Polygon.find()
        .then(polygons => {
            allPolygons = polygons

            for(key in filledFields)
            {
                let value = filledFields[key]
                // console.log(filledFields)
                // console.log(key)
                // console.log(value)
                if(value['lat'] !== undefined)
                {
                    let areas = value.areas
                    for(let polygon of allPolygons)
                    {
                        let coordinates = polygon.geometry.coordinates[0]
                        if(pointInPolygon([value.lon, value.lat], coordinates))
                        {
                            areas.push(polygon.properties.name)
                        }
                    }
                    // console.log(areas)
                }
                
            }

            FormDescriptor.findByIdAndUpdate(parentId, {'$addToSet': {'filledForms': req.body}} ,{new:true})
                .then((formDescriptor) => {
                    res.json({
                        result: 'success',
                        data: [formDescriptor]
                    })
                })
                .catch((err) => {
                    console.log("gjdhfgdsfudhsj")
                    res.status(400).json({
                        result: 'failure',
                        data: err.message
                    })
                })

        })
        .catch(err => {
            res.status(400).json({
                result: 'failure',
                data: err.message
            })
            return
        })

})

app.get('/forms/:id', (req, res) => {
    id = req.params.id

    FormDescriptor.findById(id)
	.then(formDescriptor => {
		res.json({
			result: 'success',
			data: formDescriptor
		})
	})
	.catch(err => {
		res.json({
			result: 'fail',
			data: 'Form Descriptor ' + id + ' not found.'
		})
    })
})

let port = process.env.PORT || configs.PORT
app.listen(port, () => {
    console.log("App Is Running:")
})