import { Description } from "@radix-ui/react-dialog";
import { apiClient } from "./axiosConfig";
import { GeneralInterfaces } from "@/utils/interfaces";

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

export const createColor = async (
  {data}: {data:GeneralInterfaces}
 ) => {
  try {
    const response = await apiClient.post("/pr/color/", data);
    return response.data; // Devuelve el color creado
  } catch (error) {
    console.error("Error al crear el color:", error);
    throw error;
  }
};

export const updateColor = async (
 {data}: {data:GeneralInterfaces}
) => {
  try {
    const response = await apiClient.put(`/pr/color/${data.id}`, data );
    return response.data; // Devuelve el color actualizado
  } catch (error) {
    console.error(`Error al actualizar el color con ID ${data.id}:`, error);
    throw error;
  }
};

export const deleteColor = async (id: number) => {
  try {
    const response = await apiClient.delete(`/pr/color/${id}`);
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    console.error(`Error al eliminar el color con ID ${id}:`, error);
    throw error;
  }
};

export const recoverColor = async (id: number) => {
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/color/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    console.error(`Error al recuperar el color con ID ${id}:`, error);
    throw error;
  }
};