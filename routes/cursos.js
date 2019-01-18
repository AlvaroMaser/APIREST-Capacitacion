var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const { checkSchema, validationResult } = require('express-validator/check');

const Curso = require("../models/Curso");
const Alumno = require("../models/Alumno");

var path = require('path');


router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', function (req, res) {
    Curso.find(req.query).limit(10).then(function (cursos) {
        res.json(cursos);
    }).catch((err) => {
        console.error(err);
        res.status(500);
        res.send();
    });
});


function findOneCurso(req,res, onSuccess)
{
    Curso.findByNroCurso(req.params.nroCurso).then(function (curso) {
        if(curso == null)
        {
            res.status(404).send();
            return;
        }
        res.json(onSuccess(curso));
    }).catch((err) => {
        console.error(err);
        res.status(500).send();
    });
};

router.get('/:nroCurso/alumnos',function (req, res) {
    findOneCurso(req,res,(curso)=>curso.alumnos);
});

router.get('/:nroCurso/mejorAlumno',function (req, res) {
    mejorAlumnoCurso(req,res,(curso)=>curso.alumnos[0]);
});

function mejorAlumnoCurso(req,res, onSuccess)
{
    Curso.findByNroCurso(req.params.nroCurso).then(function (curso) {
        if(curso == null)
        {
            res.status(404).send();;
        }
        curso.alumnos.sort(function (alumno1, alumno2) {
           return alumno1.nota<alumno2.nota;
        });
        res.json(onSuccess(curso));
    }).catch((err) => {
        console.error(err);
        res.status(500).send();
    });
};

/*function agregarNuevoAlumnoACurso(req,alumno,res,onSuccess)
{
    Curso.agregarNuevoAlumno(alumno,req.body.nroCurso).then(function (curso) {
        if(curso == null)
        {
            res.status(404).send();
            return;
        }
        res.json(onSuccess(curso));
    }).catch((err) => {
        console.error(err);
        res.status(500).send();
    });
}*/

router.post('/', checkSchema(
    {
    anioDictadoCurso: {
        in: ['body'],
        errorMessage: 'El campo anioDictadoCurso esta mal!',
        isInt: true
    },
    temaDictadoCurso: {
        in: ['body'],
        errorMessage: 'El campo temaDictadoCurso esta mal!',
        isString: true
    },
    duracionCurso:{
        in:['body'],
        errorMessage: 'El campo duracionCurso esta mal!',
        isInt:true
    },
    nroCurso:{
        in:['body'],
        errorMessage: 'El campo duracionCurso esta mal!',
        isInt:true
        }
    }), function (req, res) {

    // let validation = validationResult(req).array();
    //
    // if(validation.length > 0)
    // {
    //     res.status(400).json(validation);
    //     return;
    // }

    var curso = new Curso({
        nroCurso: req.body.nroCurso,
        anioDictado: req.body.anioDictadoCurso,
        tema:req.body.temaDictadoCurso,
        duracion: req.body.duracionCurso
    });

    curso.save().then(doc => {

        res.status(201).json(doc); //devolvemos created y lo que creamos.

    }).catch((err) =>{
        console.error(err);
        res.status(500).send();
    });
});


router.post('/nuevoAlumno',checkSchema({
    nombreAlumno: {
        in: ['body'],
        errorMessage: 'El campo nombreAlumno esta mal!',
        isString: true
    },
    apellidoAlumno: {
        in: ['body'],
        errorMessage: 'El campo apellidoAlumno esta mal!',
        isString: true
    },
    dniAlumno:{
        in:['body'],
        errorMessage: 'El campo dniAlumno esta mal!',
        isInt:true
    },
    notaAlumno:{
        in:['body'],
        errorMessage: 'El campo notaAlumno esta mal!',
        isInt:true
    },
    direccionAlumno:{
        in:['body'],
        errorMessage: 'El campo direccionAlumno esta mal!',
        isString: true
    },
    nroCursoAlumno:{
        in:['body'],
        errorMessage: 'El campo nroCursoAlumno esta mal!',
        isInt:true
    }
}), function (req, res) {

    var alumno = new Alumno({
        nombre: req.body.nombreAlumno,
        apellido: req.body.apellidoAlumno,
        direccion:req.body.direccionAlumno,
        nota: req.body.notaAlumno,
        dni: req.body.dniAlumno
    });

    //agregarNuevoAlumnoACurso(req,alumno, res, (curso) => curso);

    Curso.agregarNuevoAlumno(alumno,req.body.nroCursoAlumno);
    res.status(201).json(alumno);
});

//http://localhost:3000/api/facturas/10000001
router.delete('/:nroCurso', function (req, res) {
    Curso.findOneAndRemove({nroCurso: req.params.nroCurso}).then(function (curso) {
        if(curso == null)
        {
            res.status(404).send();
            return;
        }
        res.json(curso);
    }).catch((err) => {
        console.error(err);
        res.status(500).send();
    });
});

module.exports = router;