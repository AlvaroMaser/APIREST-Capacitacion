var express = require('express');
var router = express.Router();

const Curso = require("../models/Curso");


router.get('/', function (req, res) {

    Factura.distinct('cliente', null, function (err, clientes) {
        if (err) return console.error(err);

        res.send(clientes);
    })

});

module.exports = router;