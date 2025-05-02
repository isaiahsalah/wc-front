import {apiClient} from "../axiosConfig";
import {IModel} from "@/utils/interfaces";
import {toast} from "sonner";

export const getModels = async () => {
  try {
    const response = await apiClient.get("/pr/model"); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de modelos
  } catch (error) {
    console.error("Error al obtener los modelos:", error);
    throw error;
  }
};

export const getAllModels = async () => {
  try {
    const response = await apiClient.get("/pr/model/all"); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de modelos
  } catch (error) {
    console.error("Error al obtener los modelos:", error);
    throw error;
  }
};

export const getModelById = async (id: number) => {
  try {
    const response = await apiClient.get(`/pr/model/${id}`);
    return response.data; // Devuelve el modelo encontrado
  } catch (error) {
    console.error(`Error al obtener el modelo con ID ${id}:`, error);
    throw error;
  }
};

export const createModel = async ({data}: {data: IModel}) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.post("/pr/model/", data);
    toast("El modelo se creó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el modelo creado
  } catch (error) {
    toast(`Error al crear el modelo con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const updateModel = async ({data}: {data: IModel}) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.put(`/pr/model/${data.id}`, data);
    toast("El modelo se editó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el modelo actualizado
  } catch (error) {
    toast(`Error al editar el modelo con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const deleteModel = async (id: number) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.delete(`/pr/model/${id}`);
    toast("El modelo se eliminó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast(`Error al eliminar el modelo con ID ${id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const recoverModel = async (id: number) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/model/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast("El modelo se recuperó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast(`Error al recuperar el modelo con ID ${id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};
