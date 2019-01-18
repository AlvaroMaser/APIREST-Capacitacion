const mongoose = require("mongoose");
const express = require('express');
var AlumnosRouter = require('./routes/alumnos.js');
var CursosRouter = require('./routes/cursos.js');
const app = express();
const port = 3001;

app.use('/api/alumnos', AlumnosRouter);
app.use('/api/cursos', CursosRouter);

app.use(express.static('public'));

mongoose.connect('mongodb://localhost/proyecto');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    app.listen(port, () => console.log(`Corriendo en ${port}!`));
});
