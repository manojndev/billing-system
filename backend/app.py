import firebase_admin
from firebase_admin import credentials, db
from fastapi import FastAPI, HTTPException
import uvicorn
# Initialize Firebase Admin SDK
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://selvambroilserspos-default-rtdb.firebaseio.com"  # Replace with your actual database URL
})

app = FastAPI()

# Fetch data from a specific path
@app.get("/fetch-data")
async def fetch_data():
    try:
        ref = db.reference("/")
        data = ref.get()
        if data is None:
            return {"message": "No data found"}
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Insert an order into the database
@app.post("/insert-order")
async def insert_order(order_data: dict):
    try:
        orders_ref = db.reference("orders")
        new_order_ref = orders_ref.push(order_data)
        return {"message": "Order inserted successfully", "order_id": new_order_ref.key}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Retrieve the total number of orders
@app.get("/order-count")
async def get_order_count():
    try:
        orders_ref = db.reference("orders")
        orders = orders_ref.get()
        order_count = len(orders) if orders else 0
        return {"total_orders": order_count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Fetch paginated items
@app.get("/fetch-items")
async def fetch_items(last_key: str = None, page_size: int = 10):
    try:
        items_ref = db.reference("items")
        query_ref = items_ref.order_by_key().limit_to_first(page_size)
        if last_key:
            query_ref = items_ref.order_by_key().start_after(last_key).limit_to_first(page_size)
        
        items_snapshot = query_ref.get()
        items = [{"id": key, **val} for key, val in items_snapshot.items()] if items_snapshot else []
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Fetch all items
@app.get("/fetch-all-items")
async def fetch_all_items():
    try:
        items_ref = db.reference("items")
        items_snapshot = items_ref.get()
        items = [{"id": key, **val} for key, val in items_snapshot.items()] if items_snapshot else []
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Add a new item
@app.post("/add-item")
async def add_item(item_data: dict):
    try:
        items_ref = db.reference("items")
        new_item_ref = items_ref.push(item_data)
        return {"message": "Item added successfully", "item_id": new_item_ref.key}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Update an existing item
@app.put("/update-item/{item_id}")
async def update_item(item_id: str, item_data: dict):
    try:
        if not item_id:
            raise HTTPException(status_code=400, detail="Item ID is required")
        
        item_ref = db.reference(f"items/{item_id}")
        item_ref.update(item_data)
        return {"message": "Item updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Delete an item
@app.delete("/delete-item/{item_id}")
async def delete_item(item_id: str):
    try:
        if not item_id:
            raise HTTPException(status_code=400, detail="Item ID is required")
        
        item_ref = db.reference(f"items/{item_id}")
        item_ref.delete()
        return {"message": "Item deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)