import {apiClient} from "../axiosConfig";
import {IOrderDetail} from "@/utils/interfaces";
import {toast} from "sonner";

export const getOrderDetails = async () => {
  try {
    const response = await apiClient.get("/pr/order-detail"); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de detalles de pedido
  } catch (error) {
    console.error("Error al obtener los detalles de pedido:", error);
    throw error;
  }
};

export const getAllOrderDetails = async () => {
  try {
    const response = await apiClient.get("/pr/order-detail/all"); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de detalles de pedido
  } catch (error) {
    console.error("Error al obtener los detalles de pedido:", error);
    throw error;
  }
};

export const getOrderDetailById = async (id: number) => {
  try {
    const response = await apiClient.get(`/pr/order-detail/${id}`);
    return response.data; // Devuelve el detalle de pedido encontrado
  } catch (error) {
    console.error(`Error al obtener el detalle de pedido con ID ${id}:`, error);
    throw error;
  }
};

export const createOrderDetail = async ({data}: {data: IOrderDetail}) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.post("/pr/order-detail/", data);
    toast("El detalle de pedido se creó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el detalle de pedido creado
  } catch (error) {
    toast(`Error al crear el detalle de pedido con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const updateOrderDetail = async ({data}: {data: IOrderDetail}) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.put(`/pr/order-detail/${data.id}`, data);
    toast("El detalle de pedido se editó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el detalle de pedido actualizado
  } catch (error) {
    toast(`Error al editar el detalle de pedido con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const deleteOrderDetail = async (id: number) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.delete(`/pr/order-detail/${id}`);
    toast("El detalle de pedido se eliminó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast(`Error al eliminar el detalle de pedido con ID ${id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const recoverOrderDetail = async ({id}: {id: number}) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/order-detail/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast("El detalle de pedido se recuperó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast(`Error al recuperar el detalle de pedido con ID ${id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

//////////////////////////////////////////////////////////////////////////////////////////

export const getOrderDetails_date = async ({
  date,
  id_sector,
  id_process,
}: {
  date: string;
  id_sector?: number;
  id_process?: number;
}) => {
  try {
    const params = {
      date,
      id_sector,
      id_process,
    };
    const response = await apiClient.get("/pr/order-detail/date", {params}); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de detalles de pedido
  } catch (error) {
    console.error("Error al obtener los detalles de pedido:", error);
    throw error;
  }
};
