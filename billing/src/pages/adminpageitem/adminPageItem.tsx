import React, { useEffect, useState } from 'react';
import { fetchItems, addItem, updateItem, deleteItem, fetchAllItems } from '../../service/service';
import 'daisyui/dist/full.css';
import './style.css';

interface Item {
  id: string;
  name: string;
  price: number;
  customQuantity?: 'yes' | 'no';
  predefinedQuantities?: number[];
  unit?: string;
  taxPercentage?: number;
}

const ItemsPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [newItem, setNewItem] = useState<Item>({ id: '', name: '', price: 0, customQuantity: 'no', predefinedQuantities: [], unit: '', taxPercentage: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  const loadItems = () => {
    setIsLoading(true);
    console.log("fresh load");
    fetchAllItems()
      .then((data) => {
        console.log('Items:', data);
        setItems(data);
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
        setNewItem({ id: '', name: '', price: 0, customQuantity: 'no', predefinedQuantities: [], unit: '', taxPercentage: 0 });
        loadItems();
      })
      .catch((error) => {
        console.error('Error adding item:', error);
      });
  };

  const handleEditItem = () => {
    if (editItem) {
      console.log('Edit Item:', newItem);
      updateItem(editItem.id, newItem)
        .then(() => {
          setShowModal(false);
          setEditItem(null);
          setNewItem({ id: '', name: '', price: 0, customQuantity: 'no', predefinedQuantities: [], unit: '', taxPercentage: 0 });
          loadItems();
        })
        .catch((error) => {
          console.error('Error updating item:', error);
        });
    }
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem(id)
        .then(() => {
          loadItems();
        })
        .catch((error) => {
          console.error('Error deleting item:', error);
        });
    }
  };

  const openAddModal = () => {
    setNewItem({ id: '', name: '', price: 0, customQuantity: 'no', predefinedQuantities: [], unit: '', taxPercentage: 0 });
    setEditItem(null);
    setShowModal(true);
  };

  const openEditModal = (item: Item) => {
    console.log('Edit Item change:', item);
    setEditItem(item);
    setNewItem(item);
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof Item) => {
    const value = field === 'price' || field === 'taxPercentage' ? parseFloat(e.target.value) : e.target.value;
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

  const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="container mx-auto p-4">
      <input
        type="text"
        placeholder="Search items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="input input-bordered w-full mb-4"
      />
      <button onClick={openAddModal} className="btn btn-primary mb-4">Add Item</button>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price Including Tax</th>
            <th>Custom Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
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

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{editItem ? 'Edit Item' : 'Add Item'}</h3>
            <label className="block mt-2">Name</label>
            <input
              type="text"
              placeholder="Name"
              value={newItem.name}
              onChange={(e) => handleInputChange(e, 'name')}
              className="input input-bordered w-full mt-2"
            />
            <label className="block mt-2">Price Including Tax</label>
            <input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) => handleInputChange(e, 'price')}
              className="input input-bordered w-full mt-2"
            />
            <label className="block mt-2">Custom Quantity</label>
            <select
              value={newItem.customQuantity}
              onChange={(e) => handleInputChange(e, 'customQuantity')}
              className="select select-bordered w-full mt-2"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
            <label className="block mt-2">Unit</label>
            <input
              type="text"
              placeholder="Unit"
              value={newItem.unit}
              onChange={(e) => handleInputChange(e, 'unit')}
              className="input input-bordered w-full mt-2"
            />
            <label className="block mt-2">Tax Percentage</label>
            <input
              type="number"
              placeholder="Tax Percentage"
              value={newItem.taxPercentage}
              onChange={(e) => handleInputChange(e, 'taxPercentage')}
              className="input input-bordered w-full mt-2"
            />

            {/* Dynamic input fields for predefined quantities */}
            {newItem.customQuantity === 'yes' && (
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
            )}

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