import {IUser} from "@/utils/interfaces";
import {apiClient} from "../axiosConfig";
import {toast} from "sonner";

export const updateProfile = async ({data}: {data: IUser}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.put(`/profile/${data.id}`, data);
    toast.success("El perfil se editó correctamente.");
    return response.data; // Devuelve el color actualizado
  } catch (error) {
    toast.error(`Error al editar el perfil con ID ${data.id}: ${error}`);
    throw error;
  }
};
