export interface SesionInterface {
    params: string;
    token: string;
  }


  
export interface UsuarioInterface {
    id?: number | null;
    name: string;
    lastname: string;
    birthday: Date;
    image: string;
    phone: string;
    user: string;
    pass: string;
    id_rol: number;
  
    //rol?: RolInterface | null;
  
    createdAt?: Date | null;
    updatedAt?: Date | null;
  }