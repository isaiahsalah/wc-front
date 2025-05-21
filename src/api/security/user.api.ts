import {apiClient} from "../axiosConfig";
import {IPermission, IUser} from "@/utils/interfaces"; // Asegúrate de tener una interfaz IUser definida
import {toast} from "sonner";

// Obtener usuarios
export const getUsers = async ({all}: {all?: boolean | null}) => {
  try {
    const params = {all};

    const response = await apiClient.get("/pr/user", {params}); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de usuarios
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw error;
  }
};

// Obtener usuario por ID
export const getUserById = async (id: number) => {
  try {
    const response = await apiClient.get(`/pr/user/${id}`);
    return response.data; // Devuelve el usuario encontrado
  } catch (error) {
    console.error(`Error al obtener el usuario con ID ${id}:`, error);
    throw error;
  }
};

// Crear usuario
export const createUser = async ({data}: {data: IUser}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.post("/pr/user/", data);
    toast.success("El usuario se creó correctamente.");
    return response.data; // Devuelve el usuario creado
  } catch (error) {
    toast.error(`Error al crear el usuario: ${error}`);
    throw error;
  }
};

// Actualizar usuario
export const updateUser = async ({data}: {data: IUser}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.put(`/pr/user/${data.id}`, data);
    toast.success("El usuario se editó correctamente.");
    return response.data; // Devuelve el usuario actualizado
  } catch (error) {
    toast.error(`Error al editar el usuario con ID ${data.id}: ${error}`);
    throw error;
  }
};

// Eliminar usuario
export const deleteUser = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.delete(`/pr/user/${id}`);
    toast.success("El usuario se eliminó correctamente.");
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast.error(`Error al eliminar el usuario con ID ${id}: ${error}`);
    throw error;
  }
};

// Recuperar usuario
export const recoverUser = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/user/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast.success("El usuario se recuperó correctamente.");
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast.error(`Error al recuperar el usuario con ID ${id}: ${error}`);
    throw error;
  }
};

///////////////////////////////////////////////////////////////////////////////////

// Actualizar usuario
export const updateUserPermissions = async ({
  userId,
  permissions,
}: {
  userId: number;
  permissions: IPermission[];
}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.put(`/pr/user/permission/${userId}`, {permissions});
    toast.success("El usuario se editó correctamente.");
    return response.data; // Devuelve el usuario actualizado
  } catch (error) {
    toast.error(`Error al editar el usuario con ID ${userId}: ${error}`);
    throw error;
  }
};
