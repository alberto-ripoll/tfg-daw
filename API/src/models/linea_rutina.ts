export interface LineaRutina {
    id_rutina : string;
    num_linea_rutina : number;
    ejercicio: string;
    repeticiones:number;
    series: number;
    descanso?: number;
    imagen?:string;
}