import {toast} from "sonner";
import {apiClient} from "./axiosConfig";

export const getLogin = async ({
  user,
  pass,
  module,
}: {
  user: string;
  pass: string;
  module: number;
}) => {
  try {
    const response = await apiClient.post("/auth/login", {
      user,
      pass,
      module,
    });
    toast("Inicio de sesión exitoso", {
      description: "Bienvenido(a) de nuevo. Has ingresado correctamente a tu cuenta.",
      action: {
        label: "OK",
        onClick: () => console.log("Aceptar"),
      },
    });

    return response.data; // Devuelve los datos obtenidos de la API
  } catch (error) {
    toast("Error de autenticación", {
      description:
        "Las credenciales ingresadas no son válidas. Por favor, verifica tu usuario y contraseña .",
      action: {
        label: "OK",
        onClick: () => console.log("Aceptar"),
      },
    });
    throw error; // Lanza el error para que pueda manejarse fuera
  }
};

export const getCheckToken = async ({token}: {token: string}) => {
  try {
    setTimeout(() => {}, 2000);
    const response = await apiClient.get("/auth/token", {
      headers: {Authorization: `Bearer ${token}`},
    });

    toast("Bienvenido(a) de nuevo", {
      description: "Has ingresado correctamente a tu cuenta.",
      action: {
        label: "OK",
        onClick: () => console.log("Aceptar"),
      },
    });

    return response.data; // Devuelve los datos obtenidos de la API
  } catch (error) {
    window.localStorage.removeItem("token-app");
    toast("Sesión caducada", {
      description: "Vuelva a iniciar sesión",
      action: {
        label: "OK",
        onClick: () => console.log("Aceptar"),
      },
    });
    console.log("token erroneo o caducado", error);
    throw error; // Lanza el error para que pueda manejarse fuera
  }
};
