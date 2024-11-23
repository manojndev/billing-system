import React, { useEffect, useState } from 'react';
import { fetchStores, addStore, updateStore, deleteStore } from '../../service/service';
import 'daisyui/dist/full.css';
import './style.css';

interface Store {
  store_id: string;
  store_name: string;
  location: string;
  address: string;
}

const StoresPage: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editStore, setEditStore] = useState<Store | null>(null);
  const [newStore, setNewStore] = useState<Store>({ store_id: '', store_name: '', location: '', address: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadStores();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  const loadStores = () => {
    setIsLoading(true);
    fetchStores()
      .then((data) => {
        setStores(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading stores:', error);
        setIsLoading(false);
      });
  };

  const handleAddStore = () => {
    if (!newStore.store_name || !newStore.location || !newStore.address) {
      alert('Store Name, Location, and Address are mandatory fields.');
      return;
    }
    setIsActionLoading(true);
    addStore(newStore)
      .then(() => {
        setShowModal(false);
        setNewStore({ store_id: '', store_name: '', location: '', address: '' });
        loadStores();
        setIsActionLoading(false);
      })
      .catch((error) => {
        console.error('Error adding store:', error);
        setIsActionLoading(false);
      });
  };

  const handleEditStore = () => {
    if (editStore && (!newStore.store_name || !newStore.location || !newStore.address)) {
      alert('Store Name, Location, and Address are mandatory fields.');
      return;
    }
    if (editStore) {
      setIsActionLoading(true);
      updateStore(editStore.store_id, newStore)
        .then(() => {
          setShowModal(false);
          setEditStore(null);
          setNewStore({ store_id: '', store_name: '', location: '', address: '' });
          loadStores();
          setIsActionLoading(false);
        })
        .catch((error) => {
          console.error('Error updating store:', error);
          setIsActionLoading(false);
        });
    }
  };

  const handleDeleteStore = (store_id: string) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      setIsActionLoading(true);
      deleteStore(store_id)
        .then(() => {
          loadStores();
          setIsActionLoading(false);
        })
        .catch((error) => {
          console.error('Error deleting store:', error);
          setIsActionLoading(false);
        });
    }
  };

  const openAddModal = () => {
    setNewStore({ store_id: '', store_name: '', location: '', address: '' });
    setEditStore(null);
    setShowModal(true);
  };

  const openEditModal = (store: Store) => {
    setEditStore(store);
    setNewStore(store);
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Store) => {
    const value = e.target.value;
    setNewStore({ ...newStore, [field]: value });
  };

  const filteredStores = stores.filter(store => store.store_name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="container mx-auto p-4">
      <input
        type="text"
        placeholder="Search stores..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="input input-bordered w-full mb-4"
      />
      <button onClick={openAddModal} className={`btn btn-primary mb-4 ${isActionLoading ? 'btn-loading' : ''}`}>Add Store</button>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Location</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={4} className="text-center">
                <span className="loading loading-spinner loading-lg"></span>
              </td>
            </tr>
          ) : (
            filteredStores.map((store) => (
              <tr key={store.store_id}>
                <td>{store.store_name}</td>
                <td>{store.location}</td>
                <td>{store.address}</td>
                <td>
                  <button onClick={() => openEditModal(store)} className={`btn btn-sm btn-secondary ${isActionLoading ? 'btn-loading' : ''}`}>Edit</button>
                  <button onClick={() => handleDeleteStore(store.store_id)} className={`btn btn-sm btn-danger ml-2 ${isActionLoading ? 'btn-loading' : ''}`}>Delete</button>
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
            <h3 className="font-bold text-lg">{editStore ? 'Edit Store' : 'Add Store'}</h3>
            <label className="block mt-2">Store Name</label>
            <input
              type="text"
              placeholder="Store Name"
              value={newStore.store_name}
              onChange={(e) => handleInputChange(e, 'store_name')}
              className="input input-bordered w-full mt-2"
            />
            <label className="block mt-2">Location</label>
            <input
              type="text"
              placeholder="Location"
              value={newStore.location}
              onChange={(e) => handleInputChange(e, 'location')}
              className="input input-bordered w-full mt-2"
            />
            <label className="block mt-2">Address</label>
            <input
              type="text"
              placeholder="Address"
              value={newStore.address}
              onChange={(e) => handleInputChange(e, 'address')}
              className="input input-bordered w-full mt-2"
            />
            <div className="modal-action">
              <button onClick={editStore ? handleEditStore : handleAddStore} className={`btn btn-primary ${isActionLoading ? 'btn-loading' : ''}`}>
                {isActionLoading ? <span className="spinner"></span> : (editStore ? 'Update' : 'Add')}
              </button>
              <button onClick={() => setShowModal(false)} className="btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoresPage;