import {getCheckToken} from "@/api/login.api";
import {IGeneral, IPermission, ISesion} from "./interfaces";
import {typeModule} from "./const";
import {endOfWeek, setHours, setMinutes, setSeconds, startOfWeek} from "date-fns";

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
        console.log("Permisos del usuario:", response);

        console.log("holaaa", response);
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
  const moduleId = (sesion?.sys_user.permissions as IPermission[])[0].type_module;
  return typeModule.find((module) => module.id === moduleId);
};

// Función para obtener el rango de la semana
export const getWeekRange = (date: Date = new Date()): {start: Date; end: Date} => {
  // Configuración regional: el lunes como inicio de semana
  const weekStartsOn = 1; // 0 = Domingo, 1 = Lunes

  // Obtener el inicio y el fin de la semana
  const startOfTheWeek = startOfWeek(date, {weekStartsOn});
  const endOfTheWeek = endOfWeek(date, {weekStartsOn});

  // Ajustar el inicio de la semana a las 00:00:00
  const start = setHours(setMinutes(setSeconds(startOfTheWeek, 0), 0), 0);

  // Ajustar el final de la semana a las 23:59:59
  const end = setHours(setMinutes(setSeconds(endOfTheWeek, 59), 59), 23);

  return {start, end};
};
