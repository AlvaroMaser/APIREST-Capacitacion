const mongoose = require("mongoose");

const Alumno = new mongoose.Schema({
    nombre: { type:String, trim:true },
    apellido: { type:String, trim:true },
    dni: {type:Number, min:0} ,
    direccion: { type:String, trim:true },
    nota:{type:Number,min:0}
});

module.exports = mongoose.model("Alumno", Alumno);