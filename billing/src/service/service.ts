// Import Firestore dependencies
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, query, limit, startAfter, orderBy, getDocs } from "firebase/firestore";
import firebaseconfig from "../firebase/firebaseconfig";
import {OrderItem , Order, Orders} from "../pages/adminorderspage/order.dto";
// Initialize Firebase app
const db = getFirestore(firebaseconfig);

// Function to fetch data from a specific path in the database
export const fetchData = () => {
  return new Promise((resolve, reject) => {
    const dataRef = doc(db, "/"); // Replace with your actual database path

    // Fetch data once without listening for changes
    getDoc(dataRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
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

// Function to insert an order into Firestore
export const insertOrder = (orderData: any) => {
  return new Promise((resolve, reject) => {
    const ordersRef = collection(db, "orders");
    setDoc(doc(ordersRef), orderData)
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

// Function to retrieve the total number of orders from Firestore
export const getOrderCount = () => {
  return new Promise<number>((resolve, reject) => {
    const ordersRef = collection(db, "orders");

    // Fetch order count once without listening for changes
    getDocs(ordersRef)
      .then((snapshot) => {
        const orderCount = snapshot.size;
        console.log("Total Orders Count:", orderCount);
        resolve(orderCount);
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
    let itemsQuery = query(collection(db, "items"), limit(pageSize));

    if (lastKey) {
      itemsQuery = query(collection(db, "items"), orderBy("id"), startAfter(lastKey), limit(pageSize));
    }

    // Fetch items once without listening for changes
    getDocs(itemsQuery)
      .then((snapshot) => {
        if (snapshot.empty) {
          resolve([]); // No items found
          return;
        }

        const items: any[] = [];
        snapshot.forEach((doc) => {
          const item = { id: doc.id, ...doc.data() };
          items.push(item);
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
    const itemsRef = collection(db, "items");

    getDocs(itemsRef)
      .then((snapshot) => {
        if (!snapshot.empty) {
          const items: any[] = [];
          snapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
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
  return setDoc(doc(collection(db, "items")), dataWithoutId);
};

// Update an existing item
export const updateItem = (id: string, itemData: any) => {
  if (id) {
    const { id: itemId, ...dataWithoutId } = itemData;
    return updateDoc(doc(db, `items/${id}`), dataWithoutId);
  }
  // Throw error if id is not provided
  return Promise.reject(new Error("Item ID is required"));
};

// Function to delete an item
export const deleteItem = (id: string) => {
  if (id) {
    return deleteDoc(doc(db, `items/${id}`));
  }
  return Promise.reject(new Error("Item ID is required"));
};

// Fetch orders section



export const fetchOrders = (limitValue = 40, startAfterKey: string | null = null): Promise<Orders> => {

  console.log("Fetching orders with limit:", limitValue, "startAfterKey:", startAfterKey);
  return new Promise((resolve, reject) => {
    let ordersQuery = query(collection(db, "orders"), limit(limitValue));
    if (startAfterKey) {
      ordersQuery = query(collection(db, "orders"), startAfter(startAfterKey), limit(limitValue));
    }

    getDocs(ordersQuery)
      .then((snapshot) => {
        console.log("snapshot:", snapshot);

        if (!snapshot.empty) {
          const orders: Orders = {};
          snapshot.forEach((doc) => {
            console.log("order:", doc);

            orders[doc.id] = doc.data() as Order;
          });
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



// Fetch all orders
export const fetchAllOrders = (): Promise<Orders> => {
  return new Promise((resolve, reject) => {
    const ordersQuery = query(collection(db, "orders"));

    getDocs(ordersQuery)
      .then((snapshot) => {
        console.log("snapshot:", snapshot.empty);
        if (!snapshot.empty) {
          const orders: Orders = {};
          snapshot.forEach((doc) => {
            orders[doc.id] = doc.data() as Order;
          });
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