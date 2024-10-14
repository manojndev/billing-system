import React, { useEffect, useState } from 'react';
import { fetchItems, addItem, updateItem, deleteItem } from '../../service/service';
import 'daisyui/dist/full.css';
import './style.css';

interface Item {
  id: string;
  name: string;
  price: number;
  customQuantity?: 'yes' | 'no';
  predefinedQuantities?: number[];
  unit?: string;
}

const ItemsPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [newItem, setNewItem] = useState<Item>({ id: '', name: '', price: 0, customQuantity: 'no', predefinedQuantities: [] });
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [pageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    setIsLoading(true);
    fetchItems(lastKey, pageSize)
      .then((data) => {
        setItems(lastKey ? [...items, ...data] : data);
        if (data.length > 0) {
          setLastKey(data[data.length - 1].id);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading items:', error);
        setIsLoading(false);
      });
  };

  const handleAddItem = () => {
    addItem(newItem)
      .then(() => {
        setShowModal(false);
        setNewItem({ id: '', name: '', price: 0, customQuantity: 'no', predefinedQuantities: [] });
        loadItems();
      })
      .catch((error) => {
        console.error('Error adding item:', error);
      });
  };

  const handleEditItem = () => {
    if (editItem) {
      updateItem(editItem.id, newItem)
        .then(() => {
          setShowModal(false);
          setEditItem(null);
          setNewItem({ id: '', name: '', price: 0, customQuantity: 'no', predefinedQuantities: [] });
          loadItems();
        })
        .catch((error) => {
          console.error('Error updating item:', error);
        });
    }
  };

  const handleDeleteItem = (id: string) => {
    deleteItem(id)
      .then(() => {
        loadItems();
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
      });
  };

  const openAddModal = () => {
    setNewItem({ id: '', name: '', price: 0, customQuantity: 'no', predefinedQuantities: [] });
    setEditItem(null);
    setShowModal(true);
  };

  const openEditModal = (item: Item) => {
    setEditItem(item);
    setNewItem(item);
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof Item) => {
    const value = field === 'price' ? parseFloat(e.target.value) : e.target.value;
    setNewItem({ ...newItem, [field]: value });
  };

  const handlePredefinedQuantityChange = (index: number, value: number) => {
    const updatedQuantities = [...(newItem.predefinedQuantities || [])];
    updatedQuantities[index] = value;
    setNewItem({ ...newItem, predefinedQuantities: updatedQuantities });
  };

  const addPredefinedQuantity = () => {
    setNewItem({
      ...newItem,
      predefinedQuantities: [...(newItem.predefinedQuantities || []), 0],
    });
  };

  const removePredefinedQuantity = (index: number) => {
    const updatedQuantities = [...(newItem.predefinedQuantities || [])];
    updatedQuantities.splice(index, 1);
    setNewItem({ ...newItem, predefinedQuantities: updatedQuantities });
  };

  return (
    <div className="container mx-auto p-4">
      <button onClick={openAddModal} className="btn btn-primary mb-4">Add Item</button>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Custom Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.customQuantity}</td>
              <td>
                <button onClick={() => openEditModal(item)} className="btn btn-sm btn-secondary">Edit</button>
                <button onClick={() => handleDeleteItem(item.id)} className="btn btn-sm btn-danger ml-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <button onClick={loadItems} className="btn btn-outline mt-5" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Load More'}
      </button>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{editItem ? 'Edit Item' : 'Add Item'}</h3>
            <input
              type="text"
              placeholder="Name"
              value={newItem.name}
              onChange={(e) => handleInputChange(e, 'name')}
              className="input input-bordered w-full mt-2"
            />
            <input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) => handleInputChange(e, 'price')}
              className="input input-bordered w-full mt-2"
            />
            <select
              value={newItem.customQuantity}
              onChange={(e) => handleInputChange(e, 'customQuantity')}
              className="select select-bordered w-full mt-2"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>

            {/* Dynamic input fields for predefined quantities */}
            <div className="mt-4">
              <label className="font-bold">Predefined Quantities</label>
              {newItem.predefinedQuantities?.map((quantity, index) => (
                <div key={index} className="flex items-center mt-2">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handlePredefinedQuantityChange(index, parseFloat(e.target.value))}
                    className="input input-bordered w-full"
                  />
                  <button onClick={() => removePredefinedQuantity(index)} className="btn btn-sm btn-error ml-2">Remove</button>
                </div>
              ))}
              <button onClick={addPredefinedQuantity} className="btn btn-sm btn-success mt-2">Add Quantity</button>
            </div>

            <div className="modal-action">
              <button onClick={editItem ? handleEditItem : handleAddItem} className="btn btn-primary">
                {editItem ? 'Update' : 'Add'}
              </button>
              <button onClick={() => setShowModal(false)} className="btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemsPage;
