import { Request, Response } from 'express';
import User from '../models/User';

class EntrenadoresController {
    async getEntrenadores(req: Request, res: Response) {
        console.log('BOOM NIGGI')
        User.find({ isEntrenador: true }, { _id: 0, password: 0, rol: 0, rutinas_guardadas: 0, rutinas_recientes: 0, total_Kcal: 0, updatedAt: 0, week_Kcal: 0 }).exec((err, Entrenadores) => {
            if (err) {
                console.log('error', err)
            }
            if (Entrenadores) {
                console.log('ENTRENADORES',Entrenadores)
                res.json(Entrenadores)
            }
        });
    }
    async getFiltrados(req: Request, res: Response) {
        let entrenadores = await User.find({ isEntrenador: true }, { especialidades: 1, ciudad: 1, rate: 1, status: 1, profile_pic: 1, username: 1 });
        let array_filtros = JSON.parse(req.params.filtro);
        console.log(array_filtros);
        let entrenadoresEncontrados = []

        if (array_filtros.stars) {
            entrenadores.forEach(entrenador => {
                if (entrenador.rate >= array_filtros.stars) {
                    entrenadoresEncontrados.push(entrenador);
                }
            });
        }
        //Si me envian filtros de especialidad
        if (array_filtros.especialidades.length >= 1) {
            entrenadoresEncontrados.forEach(entrenador => {
                let coincide = false;
                    let especialidad_entrenador = entrenador.especialidad;
                     for (let index = 0; index < array_filtros.especialidades.length; index++) {
                        let especialidad_filtros = array_filtros.especialidades[index];
                         if (especialidad_entrenador==especialidad_filtros){
                             coincide = true;
                         }
                     }
                if (!coincide){
                    const indice = entrenadoresEncontrados.map(e => e.username).indexOf(entrenador.username);
                    entrenadoresEncontrados.splice(indice,1)
                }
            });
        }
      
 
        console.log(entrenadoresEncontrados);
        return res.json(entrenadoresEncontrados);
    }
}
const entrenadoresController = new EntrenadoresController();
export default entrenadoresController;