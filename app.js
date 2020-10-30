const app = require('express')();
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const mongoose = require('mongoose');

const uri = "mongodb+srv://node-shop:node-shop@restful-api.t9a3l.mongodb.net/restful-api?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const morgan = require('morgan');
const bodyParser = require('body-parser');
//use will handle all type of requests 
//filter will be used in routes/products file

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//setting Cors origin
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin,x-Requested-With,Content-Type,Accept,Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATH,GET,DELETE')
        return res.status(200);
    }
    next();
});

//forwarding our routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {

    //this will be displayed when none of the above url are not found
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

//error handling for database operations
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json(({
        message: error.message
    }))
});

module.exports = app;