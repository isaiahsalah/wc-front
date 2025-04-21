


import {apiClient} from "./axiosConfig";

export const getColors = async () => {
  try {
    const response = await apiClient.get("/pr/color"); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de colores
  } catch (error) {
    console.error("Error al obtener los colores:", error);
    throw error;
  }
};

export const getColorById = async (id: string) => {
    try {
      const response = await apiClient.get(`/pr/color/${id}`);
      return response.data; // Devuelve el color encontrado
    } catch (error) {
      console.error(`Error al obtener el color con ID ${id}:`, error);
      throw error;
    }
  };

  export const createColor = async (name: string, hexCode: string) => {
    try {
      const response = await apiClient.post("/pr/color/", { name, hexCode });
      return response.data; // Devuelve el color creado
    } catch (error) {
      console.error("Error al crear el color:", error);
      throw error;
    }
  };

  export const updateColor = async (id: string, name: string, hexCode: string) => {
    try {
      const response = await apiClient.put(`/pr/color/${id}`, { name, hexCode });
      return response.data; // Devuelve el color actualizado
    } catch (error) {
      console.error(`Error al actualizar el color con ID ${id}:`, error);
      throw error;
    }
  };

  export const deleteColor = async (id: string) => {
    try {
      const response = await apiClient.delete(`/pr/color/${id}`);
      return response.data; // Devuelve el mensaje de éxito
    } catch (error) {
      console.error(`Error al eliminar el color con ID ${id}:`, error);
      throw error;
    }
  };