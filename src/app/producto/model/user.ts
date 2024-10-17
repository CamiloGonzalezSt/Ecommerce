export class User {
    // si no Inicializo los valores, da Error
    // Por eso es el constructor por obligación
    nombre: string;
    password: string;
   
   // si no Inicializo los valores, da Error
   constructor(obj: any){
    this.nombre = obj && obj.nombre || null
    this.password = obj && obj.password || null
  }
  
    
   }