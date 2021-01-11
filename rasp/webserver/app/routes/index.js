const { json } = require('express');
var express = require('express');
let fs = require('fs');
var router = express.Router();


//nombre del archivo para leer y escribir
const filename = 'parametros.json';

/**
 * leer los datos del fichero
 */
router.get('/get', function (req, res) {
	fs.readFile(filename, 'utf-8', (err, data) => {
		if (err) {
			console.log('error: ', err);
			return res.status(500).json({ error: err });
		}
		data = JSON.parse(data);
		res.status(200).json(data);
	});

});

/**
 * Modificar valores del archivo
 */
router.post('/edit', function (req, res) {

	if (!req.body.TES || !req.body.TEM || !req.body.MAXGAS || !req.body.MAXHCHO) {
		return res.status(400).json({
			error: "Missing parameters"
		});
	}
	
	const { TES, TEM, MAXGAS, MAXHCHO } = req.body;

	fs.writeFile(filename, '{ "TES":' + TES + ', "TEM":' + TEM + ',"MAXGAS":' + MAXGAS + ',"MAXHCHO":' + MAXHCHO + '}', (err) => {
		if (err) {
			console.log('error: ', err);
			return res.status(500).json({ error: err });
		}
		console.log('Archivo actualizado satisfactoriamente');
		res.status(200).json({ success: true });
	});
});


module.exports = router;
