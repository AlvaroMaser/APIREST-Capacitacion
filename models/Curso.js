const mongoose = require("mongoose");
const Alumno = require("./Alumno.js").schema;

//https://mongoosejs.com/docs/schematypes.html <-- tipos para schema con sus restricciones

const Curso = new mongoose.Schema({
    nroCurso: {type:Number, min: 0},
    anioDictado: { type: Number, min: 0 },
    duracion:{type:Number,min:0},
    tema: { type:String, trim:true },
    alumnos: {type:[Alumno],default: []}
});

Curso.statics.findByNroCurso = function (nroCurso) {
    return this.findOne({nroCurso: nroCurso});
};

Curso.statics.agregarNuevoAlumno = function(alumno,nroCurso){
    return this.findOneAndUpdate({nroCurso:nroCurso},{$push:{alumnos:alumno}},function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log(success);
            }
        });
};

module.exports = mongoose.model("Curso", Curso);