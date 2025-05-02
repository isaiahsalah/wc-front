import {apiClient} from "../axiosConfig";
import {IProduct} from "@/utils/interfaces";
import {toast} from "sonner";

export const getProducts = async () => {
  try {
    const response = await apiClient.get("/pr/product"); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de productos
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    throw error;
  }
};

export const getAllProducts = async () => {
  try {
    const response = await apiClient.get("/pr/product/all"); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de productos
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    throw error;
  }
};

export const getProductById = async (id: number) => {
  try {
    const response = await apiClient.get(`/pr/product/${id}`);
    return response.data; // Devuelve el producto encontrado
  } catch (error) {
    console.error(`Error al obtener el producto con ID ${id}:`, error);
    throw error;
  }
};

export const createProduct = async ({data}: {data: IProduct}) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.post("/pr/product/", data);
    toast("El producto se creó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el producto creado
  } catch (error) {
    toast(`Error al crear el producto con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const updateProduct = async ({data}: {data: IProduct}) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.put(`/pr/product/${data.id}`, data);
    toast("El producto se editó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el producto actualizado
  } catch (error) {
    toast(`Error al editar el producto con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const deleteProduct = async (id: number) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.delete(`/pr/product/${id}`);
    toast("El producto se eliminó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast(`Error al eliminar el producto con ID ${id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const recoverProduct = async (id: number) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/product/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast("El producto se recuperó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast(`Error al recuperar el producto con ID ${id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};
