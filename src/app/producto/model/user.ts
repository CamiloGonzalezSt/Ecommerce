export class User {

    nombre: string;
    password: string;
   

   constructor(obj: any){
    this.nombre = obj && obj.nombre || null
    this.password = obj && obj.password || null
  }
  
    
   }