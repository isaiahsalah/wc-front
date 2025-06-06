import {apiClient} from "../axiosConfig";
import {IFormula} from "@/utils/interfaces";
import {toast} from "sonner";

export const getFormulas = async ({
  id_sector,
  id_product,
  all,
}: {
  id_sector?: number | null;
  id_product?: number | null;
  all?: boolean | null;
}) => {
  try {
    const params = {
      id_sector,
      all,
      id_product,
    };
    const response = await apiClient.get("/pr/formula", {params}); // Cambia la URL según tu API
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

export const createFormula = async ({data}: {data: IFormula}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.post("/pr/formula/", data);
    toast.success("La fórmula se creó correctamente.");
    return response.data; // Devuelve la fórmula creada
  } catch (error) {
    toast.error(`Error al crear la fórmula con ID ${data.id}: ${error}`);
    throw error;
  }
};

export const updateFormula = async ({data}: {data: IFormula}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.put(`/pr/formula/${data.id}`, data);
    toast.success("La fórmula se editó correctamente.");
    return response.data; // Devuelve la fórmula actualizada
  } catch (error) {
    toast.error(`Error al editar la fórmula con ID ${data.id}: ${error}`);
    throw error;
  }
};

export const softDeleteFormula = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.delete(`/pr/formula/soft/${id}`);
    toast.success("La fórmula se desactivó correctamente.");
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast.error(`Error al desactivar la fórmula con ID ${id}: ${error}`);
    throw error;
  }
};

export const hardDeleteFormula = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.delete(`/pr/formula/hard/${id}`);
    toast.success("La fórmula se eliminó correctamente.");
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast.error(`Error al eliminar la fórmula con ID ${id}: ${error}`);
    throw error;
  }
};

export const recoverFormula = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/formula/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast.success("La fórmula se reactivó correctamente.");
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast.error(`Error al recuperar la fórmula con ID ${id}: ${error}`);
    throw error;
  }
};
