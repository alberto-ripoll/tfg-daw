import { Request, Response } from 'express';
import db from '../database'
import validator from 'validator';
import { nanoid } from 'nanoid';
import { Rutina } from '../models/Rutina'
import _multers3 from '../services/multers3'
import User from '../models/User';

class RutinasController {

    async get(req: Request, res: Response) {
        const rutinas = await db.query('SELECT * FROM rutinas ORDER BY created_at DESC;');
        res.json({ rutinas })
    }
    async getCreadas(req: Request, res: Response) {
        const { username } = req.params;
        const queryCreadas = await User.find({username:username},{rutinas_creadas:1,_id:0})
        let rutinas_creadas = queryCreadas[0].rutinas_creadas;
        
        let rutinasEncontradas = [];
        for await (const rutina of rutinas_creadas) {
            let rutinas_creada =  Object.values(JSON.parse(JSON.stringify(await db.query(`SELECT * FROM rutinas WHERE id='${rutina}';`))))
            rutinasEncontradas.push(rutinas_creada[0]);
        }
        console.log('BUSQUEDA FINALIZADA',rutinasEncontradas)
        res.json(rutinasEncontradas)
    }

    async getFiltradasUsu(req: Request, res: Response) {
        const userId= req["userId"]
        let array_filtros = req.params.filtro.split('&');
        let filtro_parte_rutinas = array_filtros[0].split('=')
        let filtro_rutina = filtro_parte_rutinas[1];
        let CondiciontipoQuery = '';

        //Si los filtros solo contienen condicion de ordenar
        if (array_filtros.length==2 && array_filtros[1].includes('stars')){
            let stars = array_filtros[1].slice(-1);
            if (stars=='1'){
                CondiciontipoQuery = `ORDER BY stars DESC`;
            }
            if (stars=='0'){
                CondiciontipoQuery = `ORDER BY created_at DESC`;
            }
        }

        //Si los filtros solo contienen condicion de tipo
        if (array_filtros.length>=2 && array_filtros[1].indexOf('stars')==-1){
            for (let i = 1; i < array_filtros.length; i++) {
                CondiciontipoQuery +=  `tipo='${array_filtros[i]}' ||`
            }
            CondiciontipoQuery = CondiciontipoQuery.slice(0,-3);
    
            CondiciontipoQuery = '&& ('+CondiciontipoQuery+')';
        }

        //Si los filtros contienen condicion de ambos tipos
        if (array_filtros.length>2  && array_filtros[1].indexOf('stars')!=-1){
            let stars = array_filtros[1].slice(-1);
            CondiciontipoQuery = '&& ('
            for (let i = 2; i < array_filtros.length; i++) {
                CondiciontipoQuery +=  `(tipo='${array_filtros[i]}') || `
            }
            CondiciontipoQuery = CondiciontipoQuery.slice(0,-3);

            if (stars=='1'){
                CondiciontipoQuery += `) ORDER BY stars DESC`;
            }
            if (stars=='0'){
                CondiciontipoQuery += `) ORDER BY created_at DESC`;
            }
            }

        let rutinasEncontradas = [];
        switch (filtro_rutina) {
            case 'guardadas':
                const queryGuardadas = await User.findById(userId,{rutinas_guardadas:1,_id:0})
                let rutinas_guardadas = queryGuardadas.rutinas_guardadas;
                for await (const rutina of rutinas_guardadas) {
                    let query = `SELECT * FROM rutinas WHERE id='${rutina}' ${CondiciontipoQuery};`
                    let rutina_guardada =  Object.values(JSON.parse(JSON.stringify(await db.query(query))))
                    rutinasEncontradas.push(rutina_guardada[0]);
                }
            break;

            case 'creadas':
                    let query = `SELECT * FROM rutinas WHERE user_id='${userId}' ${CondiciontipoQuery};`
                    console.log(query);
                    let rutinas_creadas =  Object.values(JSON.parse(JSON.stringify(await db.query(query))))
                    rutinasEncontradas = rutinas_creadas;
            break;
        }
        return res.json(rutinasEncontradas)
    }
    async getFiltradas(req: Request, res: Response) {
        let filtro = req.params.filtro.split('&');
        let stars = filtro[0].slice(-1);
        let condition_stars = '';
        if (stars=='0'){
            condition_stars = 'ORDER BY created_at DESC';
        }
        if (stars=='1'){
            condition_stars = 'ORDER BY stars DESC';

        }
        let tipoQuery = '';
        if (filtro.length>1){
            tipoQuery = 'WHERE '
            for (let i = 1; i < filtro.length; i++) {
                tipoQuery +=  `tipo='${filtro[i]}' ||`
            }
            tipoQuery = tipoQuery.slice(0,-3);
        }
        let query = `SELECT * FROM rutinas ${tipoQuery} ${condition_stars};`

        console.log(query)
        const rutinas = await db.query(query);
        res.json(rutinas)
    }
    async getGuardadas(req: Request, res: Response){
        const query = await User.findById(req["userId"],{rutinas_guardadas:1,_id:0})
        let rutinas = [];
        let rutinas_guardadas = query.rutinas_guardadas;
        console.log(rutinas_guardadas)

        for await (const rutina of rutinas_guardadas) {
            let rutina_guardada =  Object.values(JSON.parse(JSON.stringify(await db.query('SELECT * FROM rutinas WHERE id=?;',rutina))))
            rutinas.push(rutina_guardada[0]);
        }
         res.json({rutinas})
    }
    async getOne(req: Request, res: Response) {
        const { id } = req.params;
        const rutina = await db.query("SELECT * FROM rutinas WHERE id = ?", [id])
        if (rutina.length > 0) {
            return res.json(rutina[0])
        }
        res.status(404).json({ message: 'La rutina no existe' })
    }
    async create(req: Request, res: Response) {

        let rutina_data = JSON.parse(req.body.rutina);

        let validate_title = !validator.isEmpty(rutina_data.title);
        if (!validate_title) {
            res.json({ status: 'failed', message: 'La rutina debe tener un nombre' });
            return;
        }
        let id_rutina = nanoid();
        let rutina: Rutina = {
            id: id_rutina,
            title: rutina_data.title,
            description: rutina_data.description,
            image: 'https://albertoripoll-tfgdaw-imagenes.s3.eu-west-3.amazonaws.com/default.jpg',
            user_id: req["userId"],
            tipo: rutina_data.tipo
        };


        //Si no se sube una imagen el JSON estaria vacio y daria error si no se usa try catch
        let imagen = null;
        try{
            imagen = JSON.parse(JSON.stringify(req.file));
        }catch(err){
        }

        if (imagen) {
            rutina.image = imagen.location;
        }

        await db.query('INSERT INTO rutinas SET ?', [rutina])
        await User.findByIdAndUpdate(req["userId"],{$push: { "rutinas_creadas": id_rutina }, function(err, result){
            if(err){
                console.log(err);
            }
            if (result){
                console.log("RESULT: " + result);
            }
        }});
            

        return res.status(200).json({ status: 'success', rutina: rutina })
    }
    async update(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await db.query('UPDATE rutinas set stars = stars+1 WHERE id = ?', [id])
            res.json({ message: 'Rutina actualizada' })
        } catch (err) {
            console.log("NO Funciono")
            res.status(404).json({ message: 'Error' })
        }
    }
    async delete(req: Request, res: Response) {
        const { id } = req.params;
        const userId = req["userId"];

        await db.query('DELETE FROM lineas_rutina WHERE id_rutina = ?', [id]);
        await db.query('DELETE FROM rutinas WHERE id = ?', [id]);
        User.findOneAndUpdate({_id:userId}, {
            $pull: {
                rutinas_creadas: id,
                rutinas_guardadas:id
            }
        }).exec((err, user) => {
            if (err) {
                console.log('error', err)
            }
            if (user) {
                res.json({ message: 'Rutina eliminada' })
                return;
            }
        });
    }

    async search(req: Request, res: Response) {
        const { searchString } = req.params;
        const rutinas = await db.query("SELECT * FROM rutinas WHERE title LIKE ?", ['%' + searchString + '%'])
        if (rutinas.length > 0) {
            return res.json(rutinas)
        }
        res.status(404).json({ message: 'No se ha encontrado nada' })
    }

    getImage(req: Request, res: Response) {

    }
}

const rutinasController = new RutinasController();
export default rutinasController;