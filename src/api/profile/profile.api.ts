import {IUser} from "@/utils/interfaces";
import {apiClient} from "../axiosConfig";
import {toast} from "sonner";

export const updateProfile = async ({data}: {data: IUser}) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.put(`/profile/${data.id}`, data);
    toast("El perfil se editó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el color actualizado
  } catch (error) {
    toast(`Error al editar el perfil con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};
