// Import Firebase dependencies
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue ,push, get , child } from "firebase/database";
import firebaseconfig from "../firebase/firebaseconfig";
// Initialize Firebase app

// Get a reference to the Realtime Database
const database = getDatabase(firebaseconfig);

// Function to fetch data from a specific path in the database
// Function to fetch data from a specific path in the database
export const fetchData = () => {
  return new Promise((resolve, reject) => {
    const dataRef = ref(database, "/"); // Replace with your actual database path

    // Listen for changes in the data
    onValue(
      dataRef,
      (snapshot) => {
        const data = snapshot.val();
        console.log("Realtime Database Data:", data);
        resolve(data); // Resolve the promise with the fetched data
      },
      (error) => {
        console.error("Error fetching data:", error);
        reject(error); // Reject the promise if there's an error
      }
    );
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
    get(child(ordersRef, "/"))
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