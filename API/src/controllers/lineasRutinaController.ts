import { Request, Response } from 'express';
import db from '../database'
import { LineaRutina } from '../models/linea_rutina'
import _multers3 from '../services/multers3'

class LineasRutinaController {

    async get(req: Request, res: Response) {
        const { id_rutina } = req.params;
        const lineas_rutina = await db.query('SELECT * FROM lineas_rutina WHERE id_rutina = ?', [id_rutina]);
        res.json(lineas_rutina)
    }
    async getOne(req: Request, res: Response) {
        const { id_rutina } = req.params;
        const { id_linea } = req.params;

        const rutina = await db.query("SELECT * FROM lineas_rutina WHERE id_rutina = ? && id_linea_rutina = ?", [id_rutina, id_linea])
        if (rutina.length > 0) {
            return res.json(rutina[0])
        }
        res.status(404).json({ message: 'La linea rutina no existe' })
    }
    async create(req: Request, res: Response) {
        console.log('AQUI ENTRO')
        const { id_rutina } = req.params;
        const num_linea = req.body.num_linea;
        const ejercicio = JSON.parse(req.body.linearutina);
        let linea_rutina: LineaRutina = {
            id_rutina: id_rutina,
            num_linea_rutina: num_linea,
            ejercicio: ejercicio.ejercicio,
            repeticiones: ejercicio.repeticiones,
            series: ejercicio.series,
            descanso: ejercicio.descanso,
            imagen: 'https://albertoripoll-tfgdaw-imagenes.s3.eu-west-3.amazonaws.com/default.jpg'
        };

        //Si no se sube una imagen el JSON estaria vacio y daria error si no se usa try catch
        let imagen = null;
        try{
            imagen = JSON.parse(JSON.stringify(req.file));
        }catch(err){
        }
        if (imagen) {
            linea_rutina.imagen = imagen.location;
        }
        await db.query('INSERT INTO lineas_rutina SET ?', [linea_rutina])
        res.json({ message: 'linea rutina almacenada' })
    }
    async update(req: Request, res: Response) {
        const { id_rutina } = req.params;
        const { id_linea } = req.params;
        try {
            await db.query('UPDATE lineas_rutina set ? WHERE id_rutina = ? && num_linea_rutina = ?', [req.body, id_rutina, id_linea])
            res.json({ message: 'Rutina'+ id_rutina+ 'actualizada la linea rutina ' + id_linea })
        } catch (err) {
            console.log("NO Funciono")
            console.log(err)
        }
    }
    async deleteOne(req: Request, res: Response) {
        const { id_rutina } = req.params;
        const { id_linea } = req.params;
        await db.query('DELETE FROM lineas_rutina WHERE id_rutina = ? && id_linea_rutina = ?', [req.body, id_rutina, id_linea])
        res.json({ message: 'Rutina eliminada' })
    }
    async deleteAll(req: Request, res: Response) {
        const { id_rutina } = req.params;
        await db.query('DELETE FROM lineas_rutina WHERE id_rutina = ?', [id_rutina]);
        res.json({ message: 'Rutina eliminada' })
    }
}

const lineas_rutinaController = new LineasRutinaController();
export default lineas_rutinaController;