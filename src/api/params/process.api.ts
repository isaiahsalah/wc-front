import { apiClient } from "../axiosConfig";
import { ProcessInterfaces } from "@/utils/interfaces";
import { toast } from "sonner";

export const getProcesses = async () => {
  try {
    const response = await apiClient.get("/pr/process"); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de procesos
  } catch (error) {
    console.error("Error al obtener los procesos:", error);
    throw error;
  }
};

export const getAllProcesses = async () => {
  try {
    const response = await apiClient.get("/pr/process/all"); // Cambia la URL según tu API
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

export const createProcess = async ({ data }: { data: ProcessInterfaces }) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.post("/pr/process/", data);
    toast("El proceso se creó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el proceso creado
  } catch (error) {
    toast(`Error al crear el proceso con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const updateProcess = async ({ data }: { data: ProcessInterfaces }) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.put(`/pr/process/${data.id}`, data);
    toast("El proceso se editó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el proceso actualizado
  } catch (error) {
    toast(`Error al editar el proceso con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const deleteProcess = async (id: number) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.delete(`/pr/process/${id}`);
    toast("El proceso se eliminó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast(`Error al eliminar el proceso con ID ${id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const recoverProcess = async (id: number) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/process/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast("El proceso se recuperó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast(`Error al recuperar el proceso con ID ${id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};