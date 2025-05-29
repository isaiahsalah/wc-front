import {apiClient} from "../axiosConfig";
import {IProductionOrderDetail, IProductionOrder} from "@/utils/interfaces";
import {toast} from "sonner";

export const getOrders = async ({
  id_sector_process,
  all,
}: {
  id_sector_process?: number | null;
  all?: boolean;
}) => {
  try {
    const params = {
      id_sector_process,
      all,
    };
    const response = await apiClient.get("/pr/order", {params}); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de órdenes
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    throw error;
  }
};

export const getOrderById = async (id: number) => {
  try {
    const response = await apiClient.get(`/pr/order/${id}`);
    return response.data; // Devuelve la orden encontrada
  } catch (error) {
    console.error(`Error al obtener la orden con ID ${id}:`, error);
    throw error;
  }
};

export const createOrder = async ({data}: {data: IProductionOrder}) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.post("/pr/order/", data);
    toast.success("La orden se creó correctamente.");
    return response.data; // Devuelve la orden creada
  } catch (error) {
    toast.error(`Error al crear la orden con ID ${data.id}: ${error}`);
    throw error;
  }
};

export const updateOrder = async ({order}: {order: IProductionOrder}) => {
  if (!order.production_order_details?.length || order.production_order_details?.length <= 0) {
    return toast.warning("Selecciona al menos 1 producto");
  }
  if (order.init_date >= order.end_date) {
    return toast.warning("La fecha de inicio debe ser menor a la fecha de fin");
  }
  toast.info("Se está procesando la petición");

  try {
    const response = await apiClient.put(`/pr/order/${order.id}`, order);
    toast.success("La orden se editó correctamente.");
    return response.data; // Devuelve la orden actualizada
  } catch (error) {
    toast.error(`Error al editar la orden con ID ${order.id}: ${error}`);
    throw error;
  }
};

export const softDeleteOrder = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.delete(`/pr/order/soft/${id}`);
    toast.success("La orden se desactivó correctamente.");
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast.error(`Error al desactivar la orden con ID ${id}: ${error}`);
    throw error;
  }
};

export const hardDeleteOrder = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.delete(`/pr/order/hard/${id}`);
    toast.success("La orden se eliminó correctamente.");
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast.error(`Error al eliminar la orden con ID ${id}: ${error}`);
    throw error;
  }
};

export const recoverOrder = async (id: number) => {
  toast.info("Se está procesando la petición");
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/order/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast.success("La orden se recuperó correctamente.");
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast.error(`Error al recuperar la orden con ID ${id}: ${error}`);
    throw error;
  }
};

////////////////////////////////////////////////////////////////////////

export const createOrderWithDetails = async ({
  order,
  orderDetails,
}: {
  order: IProductionOrder;
  orderDetails: IProductionOrderDetail[];
}) => {
  if (orderDetails.length <= 0) {
    return toast.warning("Selecciona al menos 1 producto");
  }
  if (order.init_date >= order.end_date) {
    return toast.warning("La fecha de inicio debe ser menor a la fecha de fin");
  }

  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.post("/pr/order/details", {order, orderDetails});
    toast.success("La orden se creó correctamente.");
    return response.data; // Devuelve la orden creada
  } catch (error) {
    toast.error(`Error al crear la orden: ${error}`);
    throw error;
  }
};

export const updateOrderWithDetails = async ({order}: {order: IProductionOrder}) => {
  if (!order.production_order_details?.length || order.production_order_details?.length <= 0) {
    return toast.warning("Selecciona al menos 1 producto");
  }
  if (order.init_date >= order.end_date) {
    return toast.warning("La fecha de inicio debe ser menor a la fecha de fin");
  }
  toast.info("Se está procesando la petición");
  try {
    const response = await apiClient.put(`/pr/order/details/${order.id}`, order);
    toast.success("La orden se editó correctamente.");
    return response.data; // Devuelve la orden actualizada
  } catch (error) {
    toast.error(`Error al editar la orden con ID ${order.id}: ${error}`);
    throw error;
  }
};
