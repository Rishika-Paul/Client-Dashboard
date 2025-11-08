import { useCallback, useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import ClientRow from './components/ClientRow.jsx';
import AddClientModal from './components/AddClientModal.jsx';
import ViewClientModal from './components/ViewClientModal.jsx';
import { API_URL } from './constants.js';

export default function App() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setClients(data);
    } catch (err) {
      console.error('Failed to load clients', err);
      setError(err.message ?? 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleViewClient = (client) => setSelectedClient(client);
  const handleCloseViewModal = () => setSelectedClient(null);

  const handleDeleteClient = (clientId) => {
    setClients((prev) => prev.filter((client) => client.id !== clientId));
  };

  const handleSaveClient = (newClient) => {
    setClients((prev) => [newClient, ...prev]);
  };

  let tableContent;
  if (isLoading) {
    tableContent = <LoadingSpinner />;
  } else if (error) {
    tableContent = <ErrorMessage message={error} />;
  } else {
    tableContent = (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.length > 0 ? (
              clients.map((client) => (
                <ClientRow
                  key={client.id}
                  client={client}
                  onView={handleViewClient}
                  onDelete={handleDeleteClient}
                />
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-500">
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen antialiased">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Client Directory</h2>
            <p className="text-sm text-gray-500">Manage client records, view details, and add new contacts.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow transition duration-300 ease-in-out transform hover:-translate-y-0.5"
          >
            <i className="fas fa-plus mr-2"></i>
            Add New Client
          </button>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {tableContent}
        </div>
      </main>

      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveClient}
      />

      <ViewClientModal
        client={selectedClient}
        onClose={handleCloseViewModal}
      />
    </div>
  );
}
