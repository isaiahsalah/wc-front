import {apiClient} from "../axiosConfig";
import {GroupInterfaces} from "@/utils/interfaces"; // Cambiar el nombre de la interfaz si es necesario
import {toast} from "sonner";

export const getGroups = async () => {
  try {
    const response = await apiClient.get("/pr/group"); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de grupos
  } catch (error) {
    console.error("Error al obtener los grupos:", error);
    throw error;
  }
};

export const getAllGroups = async () => {
  try {
    const response = await apiClient.get("/pr/group/all"); // Cambia la URL según tu API
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

export const createGroup = async ({data}: {data: GroupInterfaces}) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.post("/pr/group/", data);
    toast("El grupo se creó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el grupo creado
  } catch (error) {
    toast(`Error al crear el grupo con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const updateGroup = async ({data}: {data: GroupInterfaces}) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.put(`/pr/group/${data.id}`, data);
    toast("El grupo se editó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el grupo actualizado
  } catch (error) {
    toast(`Error al editar el grupo con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const deleteGroup = async (id: number) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.delete(`/pr/group/${id}`);
    toast("El grupo se eliminó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast(`Error al eliminar el grupo con ID ${id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const recoverGroup = async (id: number) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/group/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast("El grupo se recuperó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast(`Error al recuperar el grupo con ID ${id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};
