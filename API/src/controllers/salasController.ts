import { Request, Response } from 'express';
import db from '../database'
import validator from 'validator';
import { nanoid } from 'nanoid';
import { Sala } from '../models/Sala'
import _multers3 from '../services/multers3'
import User from '../models/User';

class SalasController {

    async get(req: Request, res: Response) {
        const salas = await db.query('SELECT * FROM salas ORDER BY created_at DESC;');
        res.json({ salas })
    }

    async create(req: Request, res: Response) {
        let sala_data = JSON.parse(req.body.sala);
        

        let validate_title = !validator.isEmpty(sala_data.title);
        if (!validate_title) {
            res.json({ status: 'failed', message: 'La sala debe tener un nombre' });
            return;
        }
        let id_sala = nanoid();
        let sala: Sala = {
            id: id_sala,
            title: sala_data.title,
            description: sala_data.description,
            image: 'https://albertoripoll-tfgdaw-imagenes.s3.eu-west-3.amazonaws.com/default.jpg',
            entrenador: req["userId"],
            tipo: sala_data.tipo,
            link: sala_data.link
        };


        //Si no se sube una imagen el JSON estaria vacio y daria error si no se usa try catch
        let imagen = null;
        try{
            imagen = JSON.parse(JSON.stringify(req.file));
        }catch(err){
        }

        if (imagen) {
            sala.image = imagen.location;
        }

        await db.query('INSERT INTO salas SET ?', [sala])
        return res.status(200).json(true);

    }

    async getFiltradas(req: Request, res: Response) {
        let filtro = JSON.parse(req.params.filtro);
        console.log(filtro);
        let tipoQuery = '';
        if (filtro.especialidades.length>=1){
            tipoQuery = 'WHERE '
            for (let i = 0; i < filtro.especialidades.length; i++) {
                tipoQuery +=  `tipo='${filtro.especialidades[i]}' ||`
            }
            tipoQuery = tipoQuery.slice(0,-3);
        }
        let query = `SELECT * FROM salas ${tipoQuery};`

        console.log(query)
        const salas = await db.query(query);
        res.json(salas)
    }
}

const salasController = new SalasController();
export default salasController;