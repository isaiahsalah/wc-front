import {apiClient} from "../axiosConfig";
import {ISectorProcess} from "@/utils/interfaces";
import {toast} from "sonner";

export const getSectorProcesses = async ({
  all,
  id_sector,
}: {
  all?: boolean | null;
  id_sector?: number | null;
}) => {
  try {
    const params = {all, id_sector};
    const response = await apiClient.get("/pr/sector_process", {params}); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de sectores
  } catch (error) {
    console.error("Error al obtener los sectores:", error);
    throw error;
  }
};

export const getSectorProcessById = async (id: number) => {
  try {
    const response = await apiClient.get(`/pr/sector_process/${id}`);
    return response.data; // Devuelve el sector encontrado
  } catch (error) {
    console.error(`Error al obtener el sector con ID ${id}:`, error);
    throw error;
  }
};

export const createSectorProcess = async ({data}: {data: ISectorProcess}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.post("/pr/sector_process/", data);
    toast.success("El sector se creó correctamente.");
    return response.data; // Devuelve el sector creado
  } catch (error) {
    toast.error(`Error al crear el sector con ID ${data.id}: ${error}`);
    throw error;
  }
};

export const updateSectorProcess = async ({data}: {data: ISectorProcess}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.put(`/pr/sector_process/${data.id}`, data);
    toast.success("El sector se editó correctamente.");
    return response.data; // Devuelve el sector actualizado
  } catch (error) {
    toast.error(`Error al editar el sector con ID ${data.id}: ${error}`);
    throw error;
  }
};

export const softDeleteSectorProcess = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.delete(`/pr/sector_process/soft/${id}`);
    toast.success("El proceso del sector se desactivó correctamente.");
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast.error(`Error al desactivar el proceso del sector con ID ${id}: ${error}`);
    throw error;
  }
};

export const hardDeleteSectorProcess = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.delete(`/pr/sector_process/hard/${id}`);
    toast.success("El proceso del sector se eliminó correctamente.");
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast.error(`Error al eliminar el proceso del sector con ID ${id}: ${error}`);
    throw error;
  }
};

export const recoverSectorProcess = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/sector_process/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast.success("El sector se reactivó correctamente.");
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast.error(`Error al recuperar el sector con ID ${id}: ${error}`);
    throw error;
  }
};
