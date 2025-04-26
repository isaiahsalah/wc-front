import { apiClient } from "../axiosConfig";
import { ColorInterfaces } from "@/utils/interfaces";
import { toast } from "sonner";

export const getColors = async () => {
  try {
    const response = await apiClient.get("/pr/color"); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de colores
  } catch (error) {
    console.error("Error al obtener los colores:", error);
    throw error;
  }
};

export const getAllColors = async () => {
  try {
    const response = await apiClient.get("/pr/color/all"); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de colores
  } catch (error) {
    console.error("Error al obtener los colores:", error);
    throw error;
  }
};

export const getColorById = async (id: number) => {
  try {
    const response = await apiClient.get(`/pr/color/${id}`);
    return response.data; // Devuelve el color encontrado
  } catch (error) {
    console.error(`Error al obtener el color con ID ${id}:`, error);
    throw error;
  }
};

export const createColor = async ({ data }: { data: ColorInterfaces }) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.post("/pr/color/", data);
    toast("El color se creó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el color creado
  } catch (error) {
    toast(`Error al crear el color con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const updateColor = async ({ data }: { data: ColorInterfaces }) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.put(`/pr/color/${data.id}`, data);
    toast("El color se editó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el color actualizado
  } catch (error) {
    toast(`Error al editar el color con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const deleteColor = async (id: number) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.delete(`/pr/color/${id}`);
    toast("El color se eliminó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast(`Error al eliminar el color con ID ${id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const recoverColor = async (id: number) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/color/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast("El color se recuperó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast(`Error al recuperar el color con ID ${id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};
