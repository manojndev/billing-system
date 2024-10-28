// Import Firebase dependencies
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, get, update, remove, query, limitToFirst, startAfter, orderByKey, child } from "firebase/database";
import firebaseconfig from "../firebase/firebaseconfig";

// Initialize Firebase app
const database = getDatabase(firebaseconfig);

// Function to fetch data from a specific path in the database
export const fetchData = () => {
  return new Promise((resolve, reject) => {
    const dataRef = ref(database, "/"); // Replace with your actual database path

    // Fetch data once without listening for changes
    get(dataRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log("Fetched Data:", data);
          resolve(data); // Resolve the promise with the fetched data
        } else {
          resolve(null); // No data found, resolve with null
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        reject(error); // Reject the promise if there's an error
      });
  });
};

// Function to insert an order into the Firebase Realtime Database
export const insertOrder = (orderData: any) => {
  return new Promise((resolve, reject) => {
    const ordersRef = ref(database, "orders");
    push(ordersRef, orderData)
      .then(() => {
        console.log("Order inserted successfully:", orderData);
        resolve(orderData); // Resolve the promise if the insertion is successful
      })
      .catch((error) => {
        console.error("Error inserting order:", error);
        reject(error); // Reject the promise if there's an error
      });
  });
};

// Function to retrieve the total number of orders from Firebase
export const getOrderCount = () => {
  return new Promise<number>((resolve, reject) => {
    const ordersRef = ref(database, "orders");

    // Fetch order count once without listening for changes
    get(ordersRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const orderCount = snapshot.size;
          console.log("Total Orders Count:", orderCount);
          resolve(orderCount);
        } else {
          resolve(0); // No orders found, resolve with 0
        }
      })
      .catch((error) => {
        console.error("Error fetching order count:", error);
        reject(error);
      });
  });
};

// Function to fetch items with pagination
export const fetchItems = (lastKey: string | null, pageSize: number) => {
  return new Promise<any[]>((resolve, reject) => {
    let itemsQuery = query(ref(database, "items"), limitToFirst(pageSize));

    if (lastKey) {
      itemsQuery = query(ref(database, "items"), startAfter(lastKey), limitToFirst(pageSize));
    }

    // Fetch items once without listening for changes
    get(itemsQuery)
      .then((snapshot) => {
        if (!snapshot.exists()) {
          resolve([]); // No items found
          return;
        }

        const items: any[] = [];
        snapshot.forEach((childSnapshot) => {
          const key = childSnapshot.key;
          if (key) {
            const item = { id: String(key), ...childSnapshot.val() };
            items.push(item);
          }
        });

        console.log("Fetched items:", items); // Improved logging for debugging
        resolve(items);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        reject(error);
      });
  });
};

// Function to fetch all items
export const fetchAllItems = () => {
  return new Promise<any[]>((resolve, reject) => {
    const itemsRef = ref(database, "items");

    get(itemsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const items: any[] = [];
          snapshot.forEach((childSnapshot) => {
            items.push({ id: String(childSnapshot.key), ...childSnapshot.val() });
          });
          resolve(items);
        } else {
          resolve([]); // No items found, resolve with an empty array
        }
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        reject(error);
      });
  });
};

// Add a new item
export const addItem = (itemData: any) => {
  const { id, ...dataWithoutId } = itemData;
  return push(ref(database, "items"), dataWithoutId);
};

// Update an existing item
export const updateItem = (id: string, itemData: any) => {
  if (id) {
    const { id: itemId, ...dataWithoutId } = itemData;
    return update(ref(database, `items/${id}`), dataWithoutId);
  }
  // Throw error if id is not provided
  return Promise.reject(new Error("Item ID is required"));
};

// Function to delete an item
export const deleteItem = (id: string) => {
  if (id) {
    return remove(ref(database, `items/${id}`));
  }
  return Promise.reject(new Error("Item ID is required"));
};



////fetch orders section



interface OrderItem {
  customQuantity: string;
  id: string;
  name: string;
  price: number;
  qty: number;
  taxPercentage: number;
  unit: string;
}

interface Order {
  date: string;
  items: OrderItem[];
  orderNumber: number;
  totalAmount: string;
}

interface Orders {
  [key: string]: Order;
}

export const fetchOrders = (limit = 40, startAfterKey: string | null = null): Promise<Orders> => {
  return new Promise((resolve, reject) => {
    let ordersQuery = query(ref(database, "orders"), orderByKey(), limitToFirst(limit));
    if (startAfterKey) {
      ordersQuery = query(ref(database, "orders"), orderByKey(), startAfter(startAfterKey), limitToFirst(limit));
    }

    get(ordersQuery)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const orders = snapshot.val() as Orders;
          console.log("Fetched Orders:", orders);
          resolve(orders);
        } else {
          resolve({}); // No orders found
        }
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        reject(error);
      });
  });
};

////fetch orders section

export const fetchAllOrders = (): Promise<Orders> => {
  return new Promise((resolve, reject) => {
    const ordersQuery = query(ref(database, "orders"), orderByKey());

    get(ordersQuery)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const orders = snapshot.val() as Orders;
          console.log("Fetched Orders:", orders);
          resolve(orders);
        } else {
          resolve({}); // No orders found
        }
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        reject(error);
      });
  });
};