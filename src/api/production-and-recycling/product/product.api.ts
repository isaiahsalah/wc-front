import {apiClient} from "../../axiosConfig";
import {IProduct} from "@/utils/interfaces";
import {toast} from "sonner";

export const getProducts = async ({
  id_sector_process,
  all,
}: {
  id_sector_process?: number | null;

  all?: boolean | null;
}) => {
  try {
    const params = {
      id_sector_process,
      all,
    };
    const response = await apiClient.get("/pr/product", {params}); // Cambia la URL según tu API
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
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.post("/pr/product/", data);
    toast.success("El producto se creó correctamente.");
    return response.data; // Devuelve el producto creado
  } catch (error) {
    toast.error(`Error al crear el producto con ID ${data.id}: ${error}`);
    throw error;
  }
};

export const updateProduct = async ({data}: {data: IProduct}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.put(`/pr/product/${data.id}`, data);
    toast.success("El producto se editó correctamente.");
    return response.data; // Devuelve el producto actualizado
  } catch (error) {
    toast.error(`Error al editar el producto con ID ${data.id}: ${error}`);
    throw error;
  }
};

export const softDeleteProduct = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.delete(`/pr/product/soft/${id}`);
    toast.success("El producto se desactivó correctamente.");
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast.error(`Error al desactivar el producto con ID ${id}: ${error}`);
    throw error;
  }
};

export const hardDeleteProduct = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.delete(`/pr/product/hard/${id}`);
    toast.success("El producto se eliminó correctamente.");
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast.error(`Error al eliminar el producto con ID ${id}: ${error}`);
    throw error;
  }
};

export const recoverProduct = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/product/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast.success("El producto se reactivó correctamente.");
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast.error(`Error al recuperar el producto con ID ${id}: ${error}`);
    throw error;
  }
};
