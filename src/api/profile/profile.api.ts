import {ISystemUser} from "@/utils/interfaces";
import {apiClient} from "../axiosConfig";
import {toast} from "sonner";

export const updateProfile = async ({data}: {data: ISystemUser}) => {
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

export const updatePassword = async ({
  id,
  oldPassword,
  newPassword,
}: {
  id: number;
  oldPassword: string;
  newPassword: string;
}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.put(`/profile/pass/${id}`, {oldPassword, newPassword});
    toast.success("La contraseña se editó correctamente.");
    return response.data; // Devuelve el color actualizado
  } catch (error) {
    toast.error(`Contraseña incorrecta`);
    throw error;
  }
};
