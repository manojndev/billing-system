import React, { useEffect, useState } from 'react';
import { fetchItems, addItem, updateItem, deleteItem, fetchAllItems } from '../../service/service';
import 'daisyui/dist/full.css';
import './style.css';

interface Item {
  id: string;
  name: string;
  priceExcludingTax: number | '';
  priceIncludingTax?: number | '';
  customQuantity?: 'yes' | 'no';
  predefinedQuantities?: number[];
  unit?: string;
  taxPercentage?: number | '';
}

const ItemsPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [newItem, setNewItem] = useState<Item>({ id: '', name: '', priceExcludingTax: '', customQuantity: 'no', predefinedQuantities: [], unit: 'unit', taxPercentage: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceIncludingTax, setPriceIncludingTax] = useState<number | ''>('');

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  useEffect(() => {
    calculatePriceIncludingTax(newItem);
  }, [newItem.priceExcludingTax, newItem.taxPercentage]);

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
    if (!newItem.name || newItem.priceExcludingTax === '') {
      alert('Name and Price Excluding Tax are mandatory fields.');
      return;
    }
    setIsActionLoading(true);
    addItem(newItem)
      .then(() => {
        setShowModal(false);
        setNewItem({ id: '', name: '', priceExcludingTax: '', customQuantity: 'no', predefinedQuantities: [], unit: 'unit', taxPercentage: '' });
        loadItems();
        setIsActionLoading(false);
      })
      .catch((error) => {
        console.error('Error adding item:', error);
        setIsActionLoading(false);
      });
  };

  const handleEditItem = () => {
    if (editItem && (!newItem.name || newItem.priceExcludingTax === '')) {
      alert('Name and Price Excluding Tax are mandatory fields.');
      return;
    }
    if (editItem) {
      setIsActionLoading(true);
      console.log('Edit Item:', newItem);
      updateItem(editItem.id, newItem)
        .then(() => {
          setShowModal(false);
          setEditItem(null);
          setNewItem({ id: '', name: '', priceExcludingTax: '', customQuantity: 'no', predefinedQuantities: [], unit: 'unit', taxPercentage: '' });
          loadItems();
          setIsActionLoading(false);
        })
        .catch((error) => {
          console.error('Error updating item:', error);
          setIsActionLoading(false);
        });
    }
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setIsActionLoading(true);
      deleteItem(id)
        .then(() => {
          loadItems();
          setIsActionLoading(false);
        })
        .catch((error) => {
          console.error('Error deleting item:', error);
          setIsActionLoading(false);
        });
    }
  };

  const openAddModal = () => {
    setNewItem({ id: '', name: '', priceExcludingTax: '', customQuantity: 'no', predefinedQuantities: [], unit: 'unit', taxPercentage: '' });
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
    let value: any = e.target.value;
    if (field === 'priceExcludingTax' || field === 'taxPercentage') {
      value = value === '' ? '' : parseFloat(value);
      if (field === 'taxPercentage' && (value < 0 || value > 99)) {
        alert('Tax Percentage must be between 0 and 99.');
        return;
      }
    }
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

  const calculatePriceIncludingTax = (item: Item) => {
    if (item.priceExcludingTax !== '' && item.taxPercentage !== '') {
      const priceIncludingTax = item.priceExcludingTax * (1 + (item.taxPercentage || 0) / 100);
      return Math.round(priceIncludingTax * 100) / 100;
    }
    return '';
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
      <button onClick={openAddModal} className={`btn btn-primary mb-4 ${isActionLoading ? 'btn-loading' : ''}`}>Add Item</button>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price Excluding Tax</th>
            <th>Tax Percentage</th>
            <th>Price Including Tax</th>
            <th>Custom Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="text-center">
                <span className="loading loading-spinner loading-lg"></span>
              </td>
            </tr>
          ) : (
            filteredItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.priceExcludingTax}</td>
                <td>{item.taxPercentage}</td>
                <td>{calculatePriceIncludingTax(item)}</td>
                <td>{item.customQuantity}</td>
                <td>
                  <button onClick={() => openEditModal(item)} className={`btn btn-sm btn-secondary ${isActionLoading ? 'btn-loading' : ''}`}>Edit</button>
                  <button onClick={() => handleDeleteItem(item.id)} className={`btn btn-sm btn-danger ml-2 ${isActionLoading ? 'btn-loading' : ''}`}>Delete</button>
                </td>
              </tr>
            ))
          )}
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
            <label className="block mt-2">Price Excluding Tax</label>
            <input
              type="number"
              placeholder="Price Excluding Tax"
              value={newItem.priceExcludingTax}
              onChange={(e) => handleInputChange(e, 'priceExcludingTax')}
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
            <select
              value={newItem.unit}
              onChange={(e) => handleInputChange(e, 'unit')}
              className="select select-bordered w-full mt-2"
            >
              <option value="unit">Unit</option>
              <option value="kg">Kg</option>
              <option value="g">g</option>
            </select>
            <label className="block mt-2">Tax Percentage</label>
            <input
              type="number"
              placeholder="Tax Percentage"
              value={newItem.taxPercentage}
              onChange={(e) => handleInputChange(e, 'taxPercentage')}
              className="input input-bordered w-full mt-2"
              min="0"
              max="99"
            />
            {priceIncludingTax !== '' && (
              <div className="mt-2">
                <label className="block">Price Including Tax: {calculatePriceIncludingTax(newItem)}</label>
              </div>
            )}

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
              <button onClick={editItem ? handleEditItem : handleAddItem} className={`btn btn-primary ${isActionLoading ? 'btn-loading' : ''}`}>
                {isActionLoading ? <span className="spinner"></span> : (editItem ? 'Update' : 'Add')}
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