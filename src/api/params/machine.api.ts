import {apiClient} from "../axiosConfig";
import {IMachine} from "@/utils/interfaces";
import {toast} from "sonner";

export const getMachines = async () => {
  try {
    const response = await apiClient.get("/pr/machine"); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de máquinas
  } catch (error) {
    console.error("Error al obtener las máquinas:", error);
    throw error;
  }
};

export const getAllMachines = async () => {
  try {
    const response = await apiClient.get("/pr/machine/all"); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de máquinas
  } catch (error) {
    console.error("Error al obtener las máquinas:", error);
    throw error;
  }
};

export const getMachineById = async (id: number) => {
  try {
    const response = await apiClient.get(`/pr/machine/${id}`);
    return response.data; // Devuelve la máquina encontrada
  } catch (error) {
    console.error(`Error al obtener la máquina con ID ${id}:`, error);
    throw error;
  }
};

export const createMachine = async ({data}: {data: IMachine}) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.post("/pr/machine/", data);
    toast("La máquina se creó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve la máquina creada
  } catch (error) {
    toast(`Error al crear la máquina con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const updateMachine = async ({data}: {data: IMachine}) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.put(`/pr/machine/${data.id}`, data);
    toast("La máquina se editó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve la máquina actualizada
  } catch (error) {
    toast(`Error al editar la máquina con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const deleteMachine = async (id: number) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.delete(`/pr/machine/${id}`);
    toast("La máquina se eliminó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast(`Error al eliminar la máquina con ID ${id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const recoverMachine = async (id: number) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/machine/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast("La máquina se recuperó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast(`Error al recuperar la máquina con ID ${id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};
