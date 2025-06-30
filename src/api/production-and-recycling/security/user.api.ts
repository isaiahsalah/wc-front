import {apiClient} from "../../axiosConfig";
import {IPermission, ISystemUser} from "@/utils/interfaces"; // Asegúrate de tener una interfaz IUser definida
import {isAxiosError} from "axios";
import {toast} from "sonner";

// Obtener usuarios
export const getUsers = async ({
  all,
  id_sector_process,
  type_screen,
  type_module,
  id_work_group,
}: {
  all?: boolean | null;
  id_sector_process?: number | null;
  type_module?: number | null;
  type_screen?: number | null;
  id_work_group?: number | null;
}) => {
  try {
    const params = {all, id_sector_process, type_module, type_screen, id_work_group};

    const response = await apiClient.get("/pr/user", {params}); // Cambia la URL según tu API

    return response.data; // Devuelve la lista de usuarios
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw error;
  }
};

// Obtener usuario por ID
export const getUserById = async ({
  id,
  id_sector_process,
  type_module,
}: {
  id: number;
  id_sector_process?: number | null;
  type_module?: number | null;
}) => {
  try {
    const params = {id_sector_process, type_module};
    const response = await apiClient.get(`/pr/user/${id}`, {params});
    return response.data; // Devuelve el usuario encontrado
  } catch (error) {
    console.error(`Error al obtener el usuario con ID ${id}:`, error);
    throw error;
  }
};

// Crear usuario
export const createUser = async ({data}: {data: ISystemUser}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.post("/pr/user/", data);
    toast.success("El usuario se creó correctamente.");
    return response.data; // Devuelve el usuario creado
  } catch (error) {
    let errorMessage = `Error al crear el usuario`;

    // Verificar si el error es un AxiosError
    if (isAxiosError(error)) {
      errorMessage = error.response?.data?.error || errorMessage;
    }

    toast.error(`${errorMessage}`);
    throw error;
  }
};

// Actualizar usuario
export const updateUser = async ({data}: {data: ISystemUser}) => {
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
export const softDeleteUser = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.delete(`/pr/user/soft/${id}`);
    toast.success("El usuario se desactivó correctamente.");
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    let errorMessage = `Error al desactivar el usuario con ID ${id}.`;

    // Verificar si el error es un AxiosError
    if (isAxiosError(error)) {
      errorMessage = error.response?.data?.error || errorMessage;
    }

    toast.error(`${errorMessage}`);
    throw error;
  }
};

export const hardDeleteUser = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.delete(`/pr/user/hard/${id}`);
    toast.success("El usuario se eliminó correctamente.");
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    let errorMessage = `Error desconocido al eliminar el usuario con ID ${id}.`;

    // Verificar si el error es un AxiosError
    if (isAxiosError(error)) {
      errorMessage = error.response?.data?.error || errorMessage;
    }

    toast.error(`${errorMessage}`);
    throw error;
  }
};

// Reactivar usuario
export const recoverUser = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/user/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast.success("El usuario se reactivó correctamente.");
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
  id_sector_process,
}: {
  userId: number;
  permissions: IPermission[];
  id_sector_process: number;
}) => {
  toast.info("Se está procesando la petición");

  permissions = permissions.filter((item) => item.type_degree !== 0);

  try {
    const body = {permissions, id_sector_process};
    const response = await apiClient.put(`/pr/user/permission/${userId}`, body);
    toast.success("El usuario se editó correctamente.");
    return response.data; // Devuelve el usuario actualizado
  } catch (error) {
    toast.error(`Error al editar el usuario con ID ${userId}: ${error}`);
    throw error;
  }
};
