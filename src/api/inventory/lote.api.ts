import { apiClient } from "../axiosConfig";
import { LoteInterfaces } from "@/utils/interfaces";
import { toast } from "sonner";

export const getLotes = async () => {
  try {
    const response = await apiClient.get("/pr/lote"); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de lotes
  } catch (error) {
    console.error("Error al obtener los lotes:", error);
    throw error;
  }
};

export const getAllLotes = async () => {
  try {
    const response = await apiClient.get("/pr/lote/all"); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de lotes
  } catch (error) {
    console.error("Error al obtener los lotes:", error);
    throw error;
  }
};

export const getLoteById = async (id: number) => {
  try {
    const response = await apiClient.get(`/pr/lote/${id}`);
    return response.data; // Devuelve el lote encontrado
  } catch (error) {
    console.error(`Error al obtener el lote con ID ${id}:`, error);
    throw error;
  }
};

export const createLote = async ({ data }: { data: LoteInterfaces }) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.post("/pr/lote/", data);
    toast("El lote se creó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el lote creado
  } catch (error) {
    toast(`Error al crear el lote con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const updateLote = async ({ data }: { data: LoteInterfaces }) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.put(`/pr/lote/${data.id}`, data);
    toast("El lote se editó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el lote actualizado
  } catch (error) {
    toast(`Error al editar el lote con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const deleteLote = async (id: number) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.delete(`/pr/lote/${id}`);
    toast("El lote se eliminó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast(`Error al eliminar el lote con ID ${id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const recoverLote = async (id: number) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/lote/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast("El lote se recuperó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast(`Error al recuperar el lote con ID ${id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};