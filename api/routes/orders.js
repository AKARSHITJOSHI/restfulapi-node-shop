const express = require('express');
//to register different routes
const routes = express.Router();
const Order = require('../models/orderModel');
const mongoose = require('mongoose');

routes.get('/', (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        //populate is used to get the reference object from Product tables
        .populate('product')
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});


routes.post("/", (req, res, next) => {

    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productID
    });

    order.save()
        .then(result => {
            console.log(result);
            res.status(201).json(result);
        })
        .catch(err => {
            res.status(500).json({ erro: err });
        });

});



routes.get('/:orderID', (req, res, next) => {
    let id = req.params.orderID
    Order.findById(id)
        .then(doc => {
            const response = {
                productname: doc.product,
                quantity: doc.quantity,

            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});


routes.delete('/:orderID', (req, res, next) => {
    let id = req.params.orderID
    Order.remove({ product: id })
        .then(result => {
            console.log("Order removed");
            res.status(200).json({ message: "Removed order from database", result: result });
        })
        .catch(err => {
            console.log("Error in deleting order");
            res.status(500).json({ error: err });
        });
});



module.exports = routes;