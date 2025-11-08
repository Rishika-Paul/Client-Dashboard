import React, { useState } from 'react';
import { API_URL } from '../constants';

/**
 * Client Table Row Component
 */
const ClientRow = ({ client, onView, onEdit, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        // We ask for confirmation here
        // NOTE: In a real app, window.confirm is bad practice.
        // An intern would likely be asked to build a custom <ConfirmDeleteModal /> component.
        // For this project, it's fine.
        if (window.confirm('Are you sure you want to delete this client?')) {
            setIsDeleting(true);
            try {
                // (WEEK 6: API Integration)
                const response = await fetch(`${API_URL}/${client.id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Network response was not ok');
                
                onDelete(client.id); // Tell the parent component to remove this client
            } catch (error) {
                console.error('Failed to delete client:', error);
                setIsDeleting(false);
            }
        }
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowGrap">
                <div className="text-sm font-medium text-gray-900">{client.name}</div>
                <div className="text-xs text-gray-500">@{client.username}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{client.email}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{client.phone.split(' ')[0]}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{client.company.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                    onClick={() => onView(client)} 
                    className="text-blue-600 hover:text-blue-900 mr-3" 
                    title="View Details"
                >
                    <i className="fas fa-eye"></i> View
                </button>
                <button 
                    onClick={() => onEdit(client)} 
                    className="text-green-600 hover:text-green-900 mr-3" 
                    title="Edit Client"
                >
                    <i className="fas fa-edit"></i> Edit
                </button>
                <button 
                    onClick={handleDelete} 
                    className="text-red-600 hover:text-red-900 disabled:opacity-50" 
                    title="Delete Client"
                    disabled={isDeleting}
                >
                    {isDeleting ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-trash"></i> Delete</>}
                </button>
            </td>
        </tr>
    );
};

export default ClientRow;
