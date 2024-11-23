import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Adjust the base URL as needed
});

export const fetchData = async (): Promise<any> => {
  try {
    const response = await api.get('/fetch-data');
    console.log('Fetched Data:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const insertOrder = async (orderData: any): Promise<any> => {
  try {
    const response = await api.post('/insert-order', orderData);
    console.log('Order inserted successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error inserting order:', error);
    throw error;
  }
};

export const getOrderCount = async (): Promise<any> => {
  try {
    const response = await api.get('/order-count');
    console.log('Total Orders Count:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching order count:', error);
    throw error;
  }
};

export const fetchItems = async (lastKey: any, pageSize: any): Promise<any> => {
  try {
    const response = await api.get('/fetch-items', {
      params: { lastKey, pageSize },
    });
    console.log('Fetched items:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

export const fetchAllItems = async (): Promise<any> => {
  try {
    const response = await api.get('/fetch-all-items');
    console.log('Fetched items:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

export const addItem = async (itemData: any): Promise<any> => {
  try {
    const response = await api.post('/add-item', itemData);
    return response.data;
  } catch (error: any) {
    console.error('Error adding item:', error);
    throw error;
  }
};

export const updateItem = async (id: any, itemData: any): Promise<any> => {
  try {
    console.log('Item Data:', itemData);
    const response = await api.put(`/update-item/${id}`, itemData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating item:', error);
    throw error;
  }
};

export const deleteItem = async (id: any): Promise<any> => {
  try {
    const response = await api.delete(`/delete-item/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

export const fetchOrders = async (limitValue: any = 40, startAfterKey: any = null): Promise<any> => {
  try {
    const response = await api.get('/fetch-orders', {
      params: { limitValue, startAfterKey },
    });
    console.log('Fetched Orders:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const fetchAllOrders = async (): Promise<any> => {
  try {
    const response = await api.get('/fetch-all-orders');
    console.log('Fetched Orders:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Store management functions
export const fetchStores = async (): Promise<any> => {
  try {
    const response = await api.get('/stores');
    console.log('Fetched stores:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching stores:', error);
    throw error;
  }
};

export const addStore = async (storeData: { store_name: string; location: string; address: string }): Promise<any> => {
  try {
    const response = await api.post('/add_store', storeData);
    console.log('Store added successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error adding store:', error);
    throw error;
  }
};

export const updateStore = async (store_id: string, storeData: { store_name: string; location: string; address: string }): Promise<any> => {
  try {
    const response = await api.put(`/update_store/${store_id}`, storeData);
    console.log('Store updated successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating store:', error);
    throw error;
  }
};

export const deleteStore = async (store_id: string): Promise<any> => {
  try {
    const response = await api.delete(`/delete_store/${store_id}`);
    console.log('Store deleted successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting store:', error);
    throw error;
  }
};