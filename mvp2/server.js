/**
 * Created by elad.katz on 01/03/2016.
 */

"use strict";

var express = require('express');
var app = express();
var products = require ('./data/products');
var _ = require('underscore');
var bodyParser = require('body-parser');


app.use(bodyParser.json());

var productsApi = require('./api/products');
app.use('/api/products', productsApi);

var categoriesApi = require('./api/categories');
app.use('/api/categories', categoriesApi);


app.use(express.static('public'));
app.use('/angular', express.static(__dirname + '/node_modules/angular/'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css/'));
app.use('/node_modules/ng-admin/build/', express.static(__dirname + '/node_modules/ng-admin/build/'));


app.get('/pdfjson', function (req, res) {

    var obj = require("./output.json");

    res.json(obj)
    //res.send('Hello World!');
});

app.get('/getInvoices', function(req, res) {

    var fs = require('fs');

    fs.readdir(__dirname + '/sample_pdfs', function(err, items) {

        if (err)
            console.log(err);

        items = items.filter(function(filename) { return filename.toLowerCase().endsWith('.pdf');  })

        res.json(items);
    });
});

app.get('/getInvoice/:filename', function(req, res) {
    var filename = req.params.filename;

    var pdfParser = require('./pdfParser');

    pdfParser(filename, function(parsedDoc) {
        res.json(parsedDoc);
    });


});

app.get('/categories', function(req, res) {

    var categories = _.uniq(products.map(p => p.category));

    res.json(categories);
});

//app.get('/api/products', function(req,res));

app.get('/products', function(req, res) {

    res.json(products);
});


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});


