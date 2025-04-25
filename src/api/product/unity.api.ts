import { apiClient } from "../axiosConfig";
import { GeneralInterfaces } from "@/utils/interfaces";
import { toast } from "sonner";

export const getUnities = async () => {
  try {
    const response = await apiClient.get("/pr/unity"); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de unidades
  } catch (error) {
    console.error("Error al obtener las unidades:", error);
    throw error;
  }
};

export const getAllUnities = async () => {
  try {
    const response = await apiClient.get("/pr/unity/all"); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de unidades
  } catch (error) {
    console.error("Error al obtener las unidades:", error);
    throw error;
  }
};

export const getUnityById = async (id: number) => {
  try {
    const response = await apiClient.get(`/pr/unity/${id}`);
    return response.data; // Devuelve la unidad encontrada
  } catch (error) {
    console.error(`Error al obtener la unidad con ID ${id}:`, error);
    throw error;
  }
};

export const createUnity = async ({ data }: { data: GeneralInterfaces }) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.post("/pr/unity/", data);
    toast("La unidad se creó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve la unidad creada
  } catch (error) {
    toast(`Error al crear la unidad con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const updateUnity = async ({ data }: { data: GeneralInterfaces }) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.put(`/pr/unity/${data.id}`, data);
    toast("La unidad se editó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve la unidad actualizada
  } catch (error) {
    toast(`Error al editar la unidad con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const deleteUnity = async (id: number) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.delete(`/pr/unity/${id}`);
    toast("La unidad se eliminó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast(`Error al eliminar la unidad con ID ${id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const recoverUnity = async (id: number) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/unity/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast("La unidad se recuperó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast(`Error al recuperar la unidad con ID ${id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};
