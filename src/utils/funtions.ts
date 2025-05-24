import {getCheckToken} from "@/api/login.api";
import {IGeneral, IPermission, ISesion} from "./interfaces";
import {typeModule} from "./const";

export function countCurrentMonth(data: IGeneral[]): number {
  const now = new Date();
  const currentMonth = now.getMonth(); // Mes actual (0-11)
  const currentYear = now.getFullYear(); // Año actual

  return data.reduce((count, item) => {
    const itemDate = item.createdAt ? new Date(item.createdAt) : null; // Convierte a objeto Date si está definido
    if (
      itemDate &&
      itemDate.getMonth() === currentMonth &&
      itemDate.getFullYear() === currentYear
    ) {
      count++;
    }
    return count;
  }, 0);
}

export const randomNumber = (from: number, to: number) => {
  return Math.floor(Math.random() * (to - from + 1)) + from;
};

export const checkToken = async ({
  setSesion,
}: {
  setSesion: React.Dispatch<React.SetStateAction<ISesion | null>>;
}) => {
  const rawToken = window.localStorage.getItem("token-app");

  if (!rawToken) {
    //setIsAuthenticated(false);
    //navigate("/login");
    //setLoading(false);
    return false;
  }

  const savedtoken = JSON.parse(rawToken).toString();

  return await getCheckToken({token: savedtoken})
    .then((response) => {
      if (response.token) {
        // Almacena el token en localStorage
        window.localStorage.setItem("token-app", JSON.stringify(response.token));
        // Actualiza la sesión en el estado

        setSesion(response as ISesion);
        return true;
        //setIsAuthenticated(true);
        // Navega a la ruta deseada después de iniciar sesión
        //navigate("/home");
      }
    })
    .catch(() => {
      return false;
    });
  //.finally(() => setLoading(false));
};

export const getModuleBySesion = ({sesion}: {sesion: ISesion}) => {
  const moduleId = (sesion?.user.permissions as IPermission[])[0].type_module;
  return typeModule.find((module) => module.id === moduleId);
};
