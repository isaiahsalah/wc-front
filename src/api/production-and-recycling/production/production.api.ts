import {apiClient} from "../../axiosConfig";
import {IProduction, IResponse} from "@/utils/interfaces";
import {toast} from "sonner";

export const getProductions = async ({
  init_date,
  end_date,
  id_sector_process,
  id_machine,
  all,
  page = 1,
  page_size = 50,
}: {
  init_date?: string | null;
  end_date?: string | null;
  id_sector_process?: number | null;
  id_machine?: number | null;
  all?: boolean;
  page?: number | null;
  page_size?: number | null;
}) => {
  try {
    const params = {
      init_date,
      end_date,
      id_sector_process,
      id_machine,
      all,
      page,
      page_size,
    };
    const response = await apiClient.get("/pr/production", {params}); // Cambia la URL según tu API
    const responsePaginated: IResponse = response.data;
    //console.log("production", response.data as IResponse);

    return responsePaginated; // Devuelve la lista de producciones
  } catch (error) {
    console.error("Error al obtener las producciones:", error);
    throw error;
  }
};

export const getProductionById = async (id: number) => {
  try {
    const response = await apiClient.get(`/pr/production/${id}`);
    return response.data; // Devuelve la producción encontrada
  } catch (error) {
    console.error(`Error al obtener la producción con ID ${id}:`, error);
    throw error;
  }
};

export const createProduction = async ({data}: {data: IProduction}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.post("/pr/production/", data);
    toast.success("La producción se creó correctamente.");
    return response.data; // Devuelve la producción creada
  } catch (error) {
    toast.error(`Error al crear la producción con ID ${data.id}: ${error}`);
    throw error;
  }
};

export const updateProduction = async ({data}: {data: IProduction}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.put(`/pr/production/${data.id}`, data);
    toast.success("La producción se editó correctamente.");
    return response.data; // Devuelve la producción actualizada
  } catch (error) {
    toast.error(`Error al editar la producción con ID ${data.id}: ${error}`);
    throw error;
  }
};

export const softDeleteProduction = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.delete(`/pr/production/soft/${id}`);
    toast.success("La producción se desactivó correctamente.");
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast.error(`Error al desactivar la producción con ID ${id}: ${error}`);
    throw error;
  }
};

export const hardDeleteProduction = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.delete(`/pr/production/hard/${id}`);
    toast.success("La producción se eliminó correctamente.");
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast.error(`Error al eliminar la producción con ID ${id}: ${error}`);
    throw error;
  }
};

export const recoverProduction = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/production/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast.success("La producción se reactivó correctamente.");
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast.error(`Error al recuperar la producción con ID ${id}: ${error}`);
    throw error;
  }
};

////////////////////////////////////////////////////////////////////////

export const createProductions = async ({productions}: {productions: IProduction[]}) => {
  toast("Se está procesando la petición");
  try {
    const body = {
      productions,
    };
    const response = await apiClient.post("/pr/production/bulk", body);
    toast("Las producciones se creó correctamente.");
    return response.data; // Devuelve la producción creada
  } catch (error) {
    toast(`Error al crear las ${productions.length} producciones: ${error}`);
    throw error;
  }
};
