import {apiClient} from "../axiosConfig";
import {IColor} from "@/utils/interfaces";
import {toast} from "sonner";

export const getColors = async ({all}: {all?: boolean | null}) => {
  try {
    const params = {all};
    const response = await apiClient.get("/pr/color", {params}); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de colores
  } catch (error) {
    console.error("Error al obtener los colores:", error);
    throw error;
  }
};

export const getColorById = async (id: number) => {
  try {
    const response = await apiClient.get(`/pr/color/${id}`);
    return response.data; // Devuelve el color encontrado
  } catch (error) {
    console.error(`Error al obtener el color con ID ${id}:`, error);
    throw error;
  }
};

export const createColor = async ({data}: {data: IColor}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.post("/pr/color/", data);
    toast.success("El color se creó correctamente.");
    return response.data; // Devuelve el color creado
  } catch (error) {
    toast.error(`Error al crear el color con ID ${data.id}: ${error}`);
    throw error;
  }
};

export const updateColor = async ({data}: {data: IColor}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.put(`/pr/color/${data.id}`, data);
    toast.success("El color se editó correctamente.");
    return response.data; // Devuelve el color actualizado
  } catch (error) {
    toast.error(`Error al editar el color con ID ${data.id}: ${error}`);
    throw error;
  }
};

export const softDeleteColor = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.delete(`/pr/color/soft/${id}`);
    toast.success("El color se desactivó correctamente.");
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast.error(`Error al desactivar el color con ID ${id}: ${error}`);
    throw error;
  }
};

export const hardDeleteColor = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.delete(`/pr/color/hard/${id}`);
    toast.success("El color se eliminó correctamente.");
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast.error(`Error al eliminar el color con ID ${id}: ${error}`);
    throw error;
  }
};

export const recoverColor = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/color/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast.success("El color se recuperó correctamente.");
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast.error(`Error al recuperar el color con ID ${id}: ${error}`);
    throw error;
  }
};
