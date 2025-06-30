import {apiClient} from "../../axiosConfig";
import {IMachine} from "@/utils/interfaces";
import {toast} from "sonner";

export const getMachines = async ({
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
    const response = await apiClient.get("/pr/machine", {params}); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de máquinas
  } catch (error) {
    console.error("Error al obtener las máquinas:", error);
    throw error;
  }
};

export const getMachineById = async (id: number) => {
  try {
    const response = await apiClient.get(`/pr/machine/${id}`);
    return response.data; // Devuelve la máquina encontrada
  } catch (error) {
    console.error(`Error al obtener la máquina con ID ${id}:`, error);
    throw error;
  }
};

export const createMachine = async ({data}: {data: IMachine}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.post("/pr/machine/", data);
    toast.success("La máquina se creó correctamente.");
    return response.data; // Devuelve la máquina creada
  } catch (error) {
    toast.error(`Error al crear la máquina con ID ${data.id}: ${error}`);
    throw error;
  }
};

export const updateMachine = async ({data}: {data: IMachine}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.put(`/pr/machine/${data.id}`, data);
    toast.success("La máquina se editó correctamente.");
    return response.data; // Devuelve la máquina actualizada
  } catch (error) {
    toast.error(`Error al editar la máquina con ID ${data.id}: ${error}`);
    throw error;
  }
};

export const softDeleteMachine = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.delete(`/pr/machine/soft/${id}`);
    toast.success("La máquina se desactivó correctamente.");
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast.error(`Error al desactivar la máquina con ID ${id}: ${error}`);
    throw error;
  }
};
export const hardDeleteMachine = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.delete(`/pr/machine/hard/${id}`);
    toast.success("La máquina se eliminó correctamente.");
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast.error(`Error al eliminar la máquina con ID ${id}: ${error}`);
    throw error;
  }
};

export const recoverMachine = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/machine/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast.success("La máquina se reactivó correctamente.");
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast.error(`Error al recuperar la máquina con ID ${id}: ${error}`);
    throw error;
  }
};
