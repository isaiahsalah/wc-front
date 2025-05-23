import {toast} from "sonner";
import {apiClient} from "./axiosConfig";

export const getLogin = async ({
  user,
  pass,
  type_module,
  id_sector,
}: {
  user: string;
  pass: string;
  type_module: number;
  id_sector: number;
}) => {
  try {
    const response = await apiClient.post("/auth/login", {
      user,
      pass,
      type_module,
      id_sector,
    });
    toast.success("Inicio de sesión exitoso", {
      description: "Bienvenido(a) de nuevo. Has ingresado correctamente a tu cuenta.",
    });

    return response.data; // Devuelve los datos obtenidos de la API
  } catch (error) {
    toast.error("Error de autenticación", {
      description:
        "Las credenciales ingresadas no son válidas. Por favor, verifica tu usuario y contraseña .",
    });
    throw error; // Lanza el error para que pueda manejarse fuera
  }
};

export const getCheckToken = async ({token}: {token: string}) => {
  try {
    const response = await apiClient.get("/auth/token", {
      headers: {Authorization: `Bearer ${token}`},
    });

    return response.data; // Devuelve los datos obtenidos de la API
  } catch (error) {
    window.localStorage.removeItem("token-app");
    toast.error("Sesión caducada", {
      description: "Vuelva a iniciar sesión",
    });
    console.log("token erroneo o caducado", error);
    throw error; // Lanza el error para que pueda manejarse fuera
  }
};
