import {apiClient} from "../../axiosConfig";
import {IProcess} from "@/utils/interfaces";
import {toast} from "sonner";

export const getProcesses = async ({all}: {all?: boolean | null}) => {
  try {
    const params = {all};
    const response = await apiClient.get("/pr/process", {params}); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de procesos
  } catch (error) {
    console.error("Error al obtener los procesos:", error);
    throw error;
  }
};

export const getProcessById = async (id: number) => {
  try {
    const response = await apiClient.get(`/pr/process/${id}`);
    return response.data; // Devuelve el proceso encontrado
  } catch (error) {
    console.error(`Error al obtener el proceso con ID ${id}:`, error);
    throw error;
  }
};

export const createProcess = async ({data}: {data: IProcess}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.post("/pr/process/", data);
    toast.success("El proceso se creó correctamente.");
    return response.data; // Devuelve el proceso creado
  } catch (error) {
    toast.error(`Error al crear el proceso con ID ${data.id}: ${error}`);
    throw error;
  }
};

export const updateProcess = async ({data}: {data: IProcess}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.put(`/pr/process/${data.id}`, data);
    toast.success("El proceso se editó correctamente.");
    return response.data; // Devuelve el proceso actualizado
  } catch (error) {
    toast.error(`Error al editar el proceso con ID ${data.id}: ${error}`);
    throw error;
  }
};

export const deleteProcess = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.delete(`/pr/process/${id}`);
    toast.success("El proceso se eliminó correctamente.");
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast.error(`Error al eliminar el proceso con ID ${id}: ${error}`);
    throw error;
  }
};

export const recoverProcess = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/process/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast.success("El proceso se reactivó correctamente.");
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast.error(`Error al recuperar el proceso con ID ${id}: ${error}`);
    throw error;
  }
};
