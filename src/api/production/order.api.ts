import {apiClient} from "../axiosConfig";
import {IOrderDetail, IOrder} from "@/utils/interfaces";
import {toast} from "sonner";

export const getOrders = async () => {
  try {
    const response = await apiClient.get("/pr/order"); // Cambia la URL según tu API
    return response.data; // Devuelve la lista de órdenes
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const response = await apiClient.get("/pr/order/all"); // Cambia la URL según tu API
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

export const createOrder = async ({data}: {data: IOrder}) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.post("/pr/order/", data);
    toast("La orden se creó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve la orden creada
  } catch (error) {
    toast(`Error al crear la orden con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const updateOrder = async ({data}: {data: IOrder}) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.put(`/pr/order/${data.id}`, data);
    toast("La orden se editó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve la orden actualizada
  } catch (error) {
    toast(`Error al editar la orden con ID ${data.id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const deleteOrder = async (id: number) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.delete(`/pr/order/${id}`);
    toast("La orden se eliminó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el mensaje de éxito
  } catch (error) {
    toast(`Error al eliminar la orden con ID ${id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

export const recoverOrder = async (id: number) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    // Realiza una solicitud PATCH o PUT al endpoint correspondiente
    const response = await apiClient.patch(`/pr/order/${id}`, {
      deletedAt: null, // Cambia el campo `deletedAt` a null para recuperar el dato
    });

    toast("La orden se recuperó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve el dato actualizado o el mensaje de éxito
  } catch (error) {
    toast(`Error al recuperar la orden con ID ${id}: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};

////////////////////////////////////////////////////////////////////////

export const createOrderWithDetail = async ({
  order,
  orderDetails,
}: {
  order: IOrder;
  orderDetails: IOrderDetail[];
}) => {
  toast("Se está procesando la petición", {
    action: {
      label: "OK",
      onClick: () => console.log("Undo"),
    },
  });
  try {
    const response = await apiClient.post("/pr/order/withdetails", {order, orderDetails});
    toast("La orden se creó correctamente.", {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    return response.data; // Devuelve la orden creada
  } catch (error) {
    toast(`Error al crear la orden: ${error}`, {
      action: {
        label: "OK",
        onClick: () => console.log("Undo"),
      },
    });
    throw error;
  }
};
