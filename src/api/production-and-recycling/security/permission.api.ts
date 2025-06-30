import {apiClient} from "../axiosConfig";
import {IPermission} from "@/utils/interfaces"; // Asegúrate de tener una interfaz IPermission definida
import {toast} from "sonner";

// Obtener permisos
export const getPermissions = async () => {
  try {
    const response = await apiClient.get("/pr/permission"); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de permisos
  } catch (error) {
    console.error("Error al obtener los permisos:", error);
    throw error;
  }
};

// Obtener permiso por ID
export const getPermissionById = async (id: number) => {
  try {
    const response = await apiClient.get(`/pr/permission/${id}`);
    return response.data; // Devuelve el permiso encontrado
  } catch (error) {
    console.error(`Error al obtener el permiso con ID ${id}:`, error);
    throw error;
  }
};

// Crear permiso
export const createPermission = async ({data}: {data: IPermission}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.post("/pr/permission/", data);
    toast.success("El permiso se creó correctamente.");
    return response.data; // Devuelve el permiso creado
  } catch (error) {
    toast.error(`Error al crear el permiso: ${error}`);
    throw error;
  }
};

// Actualizar permiso
export const updatePermission = async ({data}: {data: IPermission}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.put(`/pr/permission/${data.id}`, data);
    toast.success("El permiso se editó correctamente.");
    return response.data; // Devuelve el permiso actualizado
  } catch (error) {
    toast.error(`Error al editar el permiso con ID ${data.id}: ${error}`);
    throw error;
  }
};
/*
// Eliminar permiso
export const deletePermission = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.delete(`/pr/permission/${id}`);
    toast.success("El permiso se eliminó correctamente.");
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast.error(`Error al eliminar el permiso con ID ${id}: ${error}`);
    throw error;
  }
};

// Reactivar permiso
export const recoverPermission = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/permission/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast.success("El permiso se reactivó correctamente.");
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast.error(`Error al recuperar el permiso con ID ${id}: ${error}`);
    throw error;
  }
};
*/
