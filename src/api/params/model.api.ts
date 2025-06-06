import {apiClient} from "../axiosConfig";
import {IProductModel} from "@/utils/interfaces";
import {toast} from "sonner";

export const getModels = async ({
  id_sector_process,
  all,
}: {
  id_sector_process?: number | null;
  all?: boolean | null;
}) => {
  try {
    const params = {
      id_sector_process,
      all,
    };
    const response = await apiClient.get("/pr/model", {params}); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de modelos
  } catch (error) {
    console.error("Error al obtener los modelos:", error);
    throw error;
  }
};

export const getModelById = async (id: number) => {
  try {
    const response = await apiClient.get(`/pr/model/${id}`);
    return response.data; // Devuelve el modelo encontrado
  } catch (error) {
    console.error(`Error al obtener el modelo con ID ${id}:`, error);
    throw error;
  }
};

export const createModel = async ({data}: {data: IProductModel}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.post("/pr/model/", data);
    toast.success("El modelo se creó correctamente.");
    return response.data; // Devuelve el modelo creado
  } catch (error) {
    toast.error(`Error al crear el modelo con ID ${data.id}: ${error}`);
    throw error;
  }
};

export const updateModel = async ({data}: {data: IProductModel}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.put(`/pr/model/${data.id}`, data);
    toast.success("El modelo se editó correctamente.");
    return response.data; // Devuelve el modelo actualizado
  } catch (error) {
    toast.error(`Error al editar el modelo con ID ${data.id}: ${error}`);
    throw error;
  }
};

export const softDeleteModel = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.delete(`/pr/model/soft/${id}`);
    toast.success("El modelo se desactivó correctamente.");
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast.error(`Error al desactivar el modelo con ID ${id}: ${error}`);
    throw error;
  }
};

export const hardDeleteModel = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.delete(`/pr/model/hard/${id}`);
    toast.success("El modelo se eliminó correctamente.");
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast.error(`Error al eliminar el modelo con ID ${id}: ${error}`);
    throw error;
  }
};

export const recoverModel = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/model/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast.success("El modelo se reactivó correctamente.");
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast.error(`Error al recuperar el modelo con ID ${id}: ${error}`);
    throw error;
  }
};
