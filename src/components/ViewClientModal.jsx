import React from 'react';

/**
 * View Client Modal Component
 * (WEEK 5: Building React Components)
 */
const ViewClientModal = ({ client, onClose }) => {
    if (!client) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4 transform transition-all" 
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-gray-200 p-4">
                    <h3 className="text-xl font-semibold text-gray-800">Details for {client.name}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <i className="fas fa-times text-2xl"></i>
                    </button>
                </div>
                {/* Modal Body */}
                <div className="p-6 space-y-3">
                    <p><strong>Username:</strong> {client.username}</p>
                    <p><strong>Email:</strong> {client.email}</p>
                    <p><strong>Phone:</strong> {client.phone}</p>
                    <p><strong>Website:</strong> <a href={`http://${client.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{client.website}</a></p>
                    <p><strong>Company:</strong> {client.company.name}</p>
                    <p><strong>Address:</strong> {`${client.address.street}, ${client.address.suite}, ${client.address.city}, ${client.address.zipcode}`}</p>
                </div>
                {/* Modal Footer */}
                <div className="flex justify-end p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                    <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-300">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewClientModal;
