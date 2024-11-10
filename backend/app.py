import firebase_admin
from firebase_admin import credentials, firestore
from fastapi import FastAPI, HTTPException
import uvicorn
from pydantic import BaseModel
from typing import List, Dict, Optional, Union
from fastapi.middleware.cors import CORSMiddleware

# Initialize Firebase Admin SDK
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

app = FastAPI()

# Allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class OrderItem(BaseModel):
    name: Optional[str] = None
    priceExcludingTax: Optional[Union[float, str]] = None
    price_including_tax: Optional[Union[float, str]] = None
    customQuantity: Optional[str] = None  # 'yes' or 'no'
    predefinedQuantities	: Optional[List[int]] = None
    unit: Optional[str] = None
    taxPercentage	: Optional[Union[float, str]] = None
    
class Item(BaseModel):
    custom_quantity: Optional[str] = None
    customQuantity: Optional[str] = None
    id: Optional[str] = None
    name: Optional[str] = None
    predefined_quantities: Optional[List[str]] = None
    predefinedQuantities: Optional[List[str]] = None
    price_excluding_tax: Optional[float] = None
    price_including_tax: Optional[float] = None
    priceExcludingTax: Optional[float] = None
    qty: Optional[int] = None
    tax_percentage: Optional[float] = None
    taxPercentage: Optional[str] = None
    unit: Optional[str] = None

class Order(BaseModel):
    date: Optional[str] = None
    items: Optional[List[Item]] = None
    orderNumber: Optional[int] = None
    totalAmount: Optional[str] = None

class Orders(BaseModel):
    orders: Dict[str, Order]

@app.get("/fetch-data")
async def fetch_data():
    try:
        doc_ref = db.collection("your_collection").document("your_document")
        doc = doc_ref.get()
        if doc.exists:
            return doc.to_dict()
        else:
            return None
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/insert-order")
async def insert_order(order_data: Order):
    try:
        orders_ref = db.collection("orders")
        orders_ref.add(order_data.dict())
        return order_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/order-count")
async def get_order_count():
    try:
        orders_ref = db.collection("orders")
        count_query = orders_ref.count()
        snapshot = count_query.get()
        print(snapshot[0][0].value)
        return snapshot[0][0].value
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/fetch-items")
async def fetch_items(last_key: Optional[str] = None, page_size: int = 10):
    try:
        items_ref = db.collection("items")
        if last_key:
            query = items_ref.order_by("id").start_after({ "id": last_key }).limit(page_size)
        else:
            query = items_ref.limit(page_size)
        snapshot = query.get()
        items = [{"id": doc.id, **doc.to_dict()} for doc in snapshot]
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/fetch-all-items")
async def fetch_all_items():#
    try:
        items_ref = db.collection("items")
        snapshot = items_ref.get()
        items = [{"id": doc.id, **doc.to_dict()} for doc in snapshot]
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/add-item")
async def add_item(item_data: OrderItem):
    try:
        items_ref = db.collection("items")
        items_ref.add(item_data.dict())
        return item_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/update-item/{id}")
async def update_item(id: str, item_data: OrderItem):
    try:
        print(item_data.dict())

        item_ref = db.collection("items").document(id)
        item_ref.update(item_data.dict())
        return item_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/delete-item/{id}")
async def delete_item(id: str):
    try:
        item_ref = db.collection("items").document(id)
        item_ref.delete()
        return {"message": "Item deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/fetch-orders")
async def fetch_orders(limit_value: int = 40, start_after_key: Optional[str] = None):
    try:
        orders_ref = db.collection("orders")
        if start_after_key:
            query = orders_ref.start_after({ "id": start_after_key }).limit(limit_value)
        else:
            query = orders_ref.limit(limit_value)
        snapshot = query.get()
        orders = {doc.id: doc.to_dict() for doc in snapshot}
        return orders
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/fetch-all-orders")
async def fetch_all_orders():
    try:
        orders_ref = db.collection("orders")
        snapshot = orders_ref.get()
        orders = {doc.id: doc.to_dict() for doc in snapshot}
        return orders
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)