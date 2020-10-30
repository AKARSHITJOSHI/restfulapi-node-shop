const express = require('express');
//to register different routes
const routes = express.Router();
const Product = require('../models/productModel');
const mongoose = require('mongoose');

routes.get('/', (req, res, next) => {
    Product.find()
        .then(docs => {
            //response object is created for purpose of a better response
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.name,
                        _id: doc.id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8000/products/' + doc._id
                        }
                    }
                })
            };

            if (docs.length >= 1) {
                console.log(docs);
                res.status(200).json(response);
            } else {
                res.status(200).json({ message: "Request was met. Database empty!!" });
            }
        })
        .catch(err => {
            console.log(err);
            res.send(500).json({ message: "error in retrieving data" });
        });
});

routes.post('/', (req, res, next) => {

    //save the product in database using orm
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                    message: "Product created successfully",
                    createProduct: {
                        name: result.name,
                        price: result.price,
                        id: result._id,
                        request: {
                            type: 'GET',
                            url: "http://localhost:8000/products/" + result._id
                        }
                    }
                })
                //send the status back
        }).catch(err => {
            console.log(err)
            res.status(500).json({ error: err });
        });

    res.status(200).json({
        message: "Handling POST requests to /products",
        createProduct: product
    });

});

routes.get('/:productID', (req, res, next) => {
    let id = req.params.productID;

    Product.findById(id)
        .then(doc => {
            console.log("fROM Database:" + doc);
            if (doc) {
                const showdata = {
                        name: doc.name,
                        price: doc.price,
                        id: doc._id,
                        request: {
                            type: "GET",
                            uri: "https://localhost:8000/:productID" + doc._id
                        }
                    }
                    //send the above created json data
                    //it is much better practice
                res.status(200).json(showdata);
            } else {
                res.status(404).json({ message: "Not a valid id" });
            }

        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err });
        });
});

routes.patch('/:productID', (req, res, next) => {
    let id = req.params.productID;
    //to provide options as to what changes to make
    //if nothing is passed then no change will take place
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Product.update({ _id: id }, {
            $set: updateOps
        })
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});


routes.delete('/:productID', (req, res, next) => {
    let id = req.params.productID;
    Product.remove({ _id: id })
        .then(result => {
            console.log("Removed Product");
            res.status(200).json({ message: "Removed product from database", result: result });
        })
        .catch(err => {
            console.log("Error in deleting product");
            res.status(500).json({ error: err });
        });
});


module.exports = routes;