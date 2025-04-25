import { apiClient } from "../axiosConfig";
import { GeneralInterfaces } from "@/utils/interfaces";
import { toast } from "sonner";

export const getProductions = async () => {
  try {
    const response = await apiClient.get("/pr/production"); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de producciones
  } catch (error) {
    console.error("Error al obtener las producciones:", error);
    throw error;
  }
};

export const getAllProductions = async () => {
  try {
    const response = await apiClient.get("/pr/production/all"); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de producciones
  } catch (error) {
    console.error("Error al obtener las producciones:", error);
    throw error;
  }
};

export const getProductionById = async (id: number) => {
  try {
    const response = await apiClient.get(`/pr/production/${id}`);
    return response.data; // Devuelve la producción encontrada
  } catch (error) {
    console.error(`Error al obtener la producción con ID ${id}:`, error);
    throw error;
  }
};

export const createProduction = async ({ data }: { data: GeneralInterfaces }) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.post("/pr/production/", data);
    toast("La producción se creó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve la producción creada
  } catch (error) {
    toast(`Error al crear la producción con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const updateProduction = async ({ data }: { data: GeneralInterfaces }) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.put(`/pr/production/${data.id}`, data);
    toast("La producción se editó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve la producción actualizada
  } catch (error) {
    toast(`Error al editar la producción con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const deleteProduction = async (id: number) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.delete(`/pr/production/${id}`);
    toast("La producción se eliminó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast(`Error al eliminar la producción con ID ${id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const recoverProduction = async (id: number) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/production/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast("La producción se recuperó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast(`Error al recuperar la producción con ID ${id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};
