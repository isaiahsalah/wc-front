import {apiClient} from "../axiosConfig";
import {IUnity} from "@/utils/interfaces";
import {toast} from "sonner";

export const getUnities = async ({all}: {all?: boolean | null}) => {
  try {
    const params = {all};
    const response = await apiClient.get("/pr/unity", {params}); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de unidades
  } catch (error) {
    console.error("Error al obtener las unidades:", error);
    throw error;
  }
};

export const getUnityById = async (id: number) => {
  try {
    const response = await apiClient.get(`/pr/unity/${id}`);
    return response.data; // Devuelve la unidad encontrada
  } catch (error) {
    console.error(`Error al obtener la unidad con ID ${id}:`, error);
    throw error;
  }
};

export const createUnity = async ({data}: {data: IUnity}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.post("/pr/unity/", data);
    toast.success("La unidad se creó correctamente.");
    return response.data; // Devuelve la unidad creada
  } catch (error) {
    toast.error(`Error al crear la unidad con ID ${data.id}: ${error}`);
    throw error;
  }
};

export const updateUnity = async ({data}: {data: IUnity}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.put(`/pr/unity/${data.id}`, data);
    toast.success("La unidad se editó correctamente.");
    return response.data; // Devuelve la unidad actualizada
  } catch (error) {
    toast.error(`Error al editar la unidad con ID ${data.id}: ${error}`);
    throw error;
  }
};

export const softDeleteUnit = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.delete(`/pr/unity/soft/${id}`);
    toast.success("La unidad se desactivó correctamente.");
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast.error(`Error al desactivar la unidad con ID ${id}: ${error}`);
    throw error;
  }
};

export const hardDeleteUnit = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.delete(`/pr/unity/hard/${id}`);
    toast.success("La unidad se eliminó correctamente.");
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast.error(`Error al eliminar la unidad con ID ${id}: ${error}`);
    throw error;
  }
};

export const recoverUnity = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/unity/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast.success("La unidad se recuperó correctamente.");
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast.error(`Error al recuperar la unidad con ID ${id}: ${error}`);
    throw error;
  }
};
