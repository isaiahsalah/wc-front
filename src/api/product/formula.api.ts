import { apiClient } from "../axiosConfig";
import { GeneralInterfaces } from "@/utils/interfaces";
import { toast } from "sonner";

export const getFormulas = async () => {
  try {
    const response = await apiClient.get("/pr/formula"); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de fórmulas
  } catch (error) {
    console.error("Error al obtener las fórmulas:", error);
    throw error;
  }
};

export const getAllFormulas = async () => {
  try {
    const response = await apiClient.get("/pr/formula/all"); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de fórmulas
  } catch (error) {
    console.error("Error al obtener las fórmulas:", error);
    throw error;
  }
};

export const getFormulaById = async (id: number) => {
  try {
    const response = await apiClient.get(`/pr/formula/${id}`);
    return response.data; // Devuelve la fórmula encontrada
  } catch (error) {
    console.error(`Error al obtener la fórmula con ID ${id}:`, error);
    throw error;
  }
};

export const createFormula = async ({ data }: { data: GeneralInterfaces }) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.post("/pr/formula/", data);
    toast("La fórmula se creó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve la fórmula creada
  } catch (error) {
    toast(`Error al crear la fórmula con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const updateFormula = async ({ data }: { data: GeneralInterfaces }) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.put(`/pr/formula/${data.id}`, data);
    toast("La fórmula se editó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve la fórmula actualizada
  } catch (error) {
    toast(`Error al editar la fórmula con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const deleteFormula = async (id: number) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.delete(`/pr/formula/${id}`);
    toast("La fórmula se eliminó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast(`Error al eliminar la fórmula con ID ${id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const recoverFormula = async (id: number) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/formula/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast("La fórmula se recuperó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast(`Error al recuperar la fórmula con ID ${id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};
