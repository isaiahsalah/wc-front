import {apiClient} from "../../axiosConfig";
import {IProductionOrderDetail} from "@/utils/interfaces";
import {toast} from "sonner";

export const getOrderDetails = async ({
  all,
  date,
  id_sector_process,
  id_machine,
  id_work_group,
}: {
  date: string | null;
  id_sector_process?: number | null;
  id_machine?: number | null;
  all?: boolean | null;
  id_work_group: number | null;
}) => {
  try {
    const params = {
      all,
      date,
      id_sector_process,
      id_machine,
      id_work_group,
    };
    const response = await apiClient.get("/pr/order_detail", {params}); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de detalles de pedido
  } catch (error) {
    console.error("Error al obtener los detalles de pedido:", error);
    throw error;
  }
};

export const getOrderDetailById = async (id: number) => {
  try {
    const response = await apiClient.get(`/pr/order_detail/${id}`);
    return response.data; // Devuelve el detalle de pedido encontrado
  } catch (error) {
    console.error(`Error al obtener el detalle de pedido con ID ${id}:`, error);
    throw error;
  }
};

export const createOrderDetail = async ({data}: {data: IProductionOrderDetail}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.post("/pr/order_detail/", data);
    toast.success("El detalle de pedido se creó correctamente.");
    return response.data; // Devuelve el detalle de pedido creado
  } catch (error) {
    toast.error(`Error al crear el detalle de pedido con ID ${data.id}: ${error}`);
    throw error;
  }
};

export const updateOrderDetail = async ({data}: {data: IProductionOrderDetail}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.put(`/pr/order_detail/${data.id}`, data);
    toast.success("El detalle de pedido se editó correctamente.");
    return response.data; // Devuelve el detalle de pedido actualizado
  } catch (error) {
    toast.error(`Error al editar el detalle de pedido con ID ${data.id}: ${error}`);
    throw error;
  }
};

export const deleteOrderDetail = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.delete(`/pr/order_detail/${id}`);
    toast.success("El detalle de pedido se eliminó correctamente.");
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast.error(`Error al eliminar el detalle de pedido con ID ${id}: ${error}`);
    throw error;
  }
};

export const recoverOrderDetail = async ({id}: {id: number}) => {
  toast.info("Se está procesando la petición");
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/order_detail/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast.success("El detalle de pedido se reactivó correctamente.");
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast.error(`Error al recuperar el detalle de pedido con ID ${id}: ${error}`);
    throw error;
  }
};
