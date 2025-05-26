import {apiClient} from "../axiosConfig";
import {IWorkGroup} from "@/utils/interfaces"; // Cambiar el nombre de la interfaz si es necesario
import {toast} from "sonner";

export const getGroups = async ({all}: {all?: boolean | null}) => {
  try {
    const params = {all};
    const response = await apiClient.get("/pr/group", {params}); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de grupos
  } catch (error) {
    console.error("Error al obtener los grupos:", error);
    throw error;
  }
};

export const getGroupById = async (id: number) => {
  try {
    const response = await apiClient.get(`/pr/group/${id}`);
    return response.data; // Devuelve el grupo encontrado
  } catch (error) {
    console.error(`Error al obtener el grupo con ID ${id}:`, error);
    throw error;
  }
};

export const createGroup = async ({data}: {data: IWorkGroup}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.post("/pr/group/", data);
    toast.success("El grupo se creó correctamente.");
    return response.data; // Devuelve el grupo creado
  } catch (error) {
    toast.error(`Error al crear el grupo con ID ${data.id}: ${error}`);
    throw error;
  }
};

export const updateGroup = async ({data}: {data: IWorkGroup}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.put(`/pr/group/${data.id}`, data);
    toast.success("El grupo se editó correctamente.");
    return response.data; // Devuelve el grupo actualizado
  } catch (error) {
    toast.error(`Error al editar el grupo con ID ${data.id}: ${error}`);
    throw error;
  }
};

export const deleteGroup = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.delete(`/pr/group/${id}`);
    toast.success("El grupo se eliminó correctamente.");
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast.error(`Error al eliminar el grupo con ID ${id}: ${error}`);
    throw error;
  }
};

export const recoverGroup = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/group/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast.success("El grupo se recuperó correctamente.");
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast.error(`Error al recuperar el grupo con ID ${id}: ${error}`);
    throw error;
  }
};
