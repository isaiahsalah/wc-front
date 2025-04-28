import { apiClient } from "../axiosConfig";
import { SectorInterfaces } from "@/utils/interfaces";
import { toast } from "sonner";

export const getSectors = async () => {
  try {
    const response = await apiClient.get("/pr/sector"); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de sectores
  } catch (error) {
    console.error("Error al obtener los sectores:", error);
    throw error;
  }
};

export const getAllSectors = async () => {
  try {
    const response = await apiClient.get("/pr/sector/all"); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de sectores
  } catch (error) {
    console.error("Error al obtener los sectores:", error);
    throw error;
  }
};

export const getSectorById = async (id: number) => {
  try {
    const response = await apiClient.get(`/pr/sector/${id}`);
    return response.data; // Devuelve el sector encontrado
  } catch (error) {
    console.error(`Error al obtener el sector con ID ${id}:`, error);
    throw error;
  }
};

export const createSector = async ({ data }: { data: SectorInterfaces }) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.post("/pr/sector/", data);
    toast("El sector se creó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el sector creado
  } catch (error) {
    toast(`Error al crear el sector con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const updateSector = async ({ data }: { data: SectorInterfaces }) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.put(`/pr/sector/${data.id}`, data);
    toast("El sector se editó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el sector actualizado
  } catch (error) {
    toast(`Error al editar el sector con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const deleteSector = async (id: number) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.delete(`/pr/sector/${id}`);
    toast("El sector se eliminó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast(`Error al eliminar el sector con ID ${id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const recoverSector = async (id: number) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/sector/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast("El sector se recuperó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast(`Error al recuperar el sector con ID ${id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};