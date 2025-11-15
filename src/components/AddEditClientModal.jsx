import React, { useState, useEffect } from 'react';

// Define API_URL directly in this file for the build environment
const API_URL = 'https://jsonplaceholder.typicode.com/users';

/**
 * Add/Edit Client Modal Component
 * (WEEK 5/6: Handling State and Forms in React)
 * Enhanced to support both creating new clients and editing existing ones
 */
const AddEditClientModal = ({ isOpen, onClose, onSave, clientToEdit = null }) => {
    // Determine if we're in edit mode
    const isEditMode = Boolean(clientToEdit);
    
    // This component manages its own form state
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '' });
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    // Reset form when modal opens OR when clientToEdit changes
    useEffect(() => {
        if (isOpen) {
            if (isEditMode) {
                // Pre-populate form with existing client data
                setFormData({
                    name: clientToEdit.name || '',
                    email: clientToEdit.email || '',
                    phone: clientToEdit.phone || '',
                    company: clientToEdit.company?.name || ''
                });
            } else {
                // Reset to empty form for adding new client
                setFormData({ name: '', email: '', phone: '', company: '' });
            }
            setErrors({});
            setIsSaving(false);
        }
    }, [isOpen, clientToEdit, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /**
     * (WEEK 6: Form Validation Logic)
     */
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required.';
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) newErrors.email = 'Please enter a valid email address.';
        
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
        if (!formData.company.trim()) newErrors.company = 'Company name is required.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSaving(true);
        
        const clientData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: { name: formData.company },
            username: formData.email.split('@')[0]
        };

        try {
            if (isEditMode) {
                // Check if this is a locally created client (ID > 10)
                // JSONPlaceholder only has users 1-10, anything above is local-only
                const isLocalClient = clientToEdit.id > 10;
                
                if (isLocalClient) {
                    // For local clients, skip API call and update state directly
                    // This prevents 500 errors from trying to update non-existent API resources
                    onSave({ ...clientData, id: clientToEdit.id });
                } else {
                    // For existing API clients (ID 1-10), make PUT request
                    const response = await fetch(`${API_URL}/${clientToEdit.id}`, {
                        method: 'PUT',
                        body: JSON.stringify(clientData),
                        headers: { 'Content-type': 'application/json; charset=UTF-8' },
                    });

                    if (!response.ok) throw new Error('Network response was not ok');

                    // Pass updated client data back to parent with the original ID
                    onSave({ ...clientData, id: clientToEdit.id });
                }
            } else {
                // CREATE new client with POST request
                const response = await fetch(API_URL, {
                    method: 'POST',
                    body: JSON.stringify(clientData),
                    headers: { 'Content-type': 'application/json; charset=UTF-8' },
                });

                if (!response.ok) throw new Error('Network response was not ok');

                const addedClient = await response.json();
                onSave({ ...clientData, id: addedClient.id });
            }
            
            onClose(); // Close modal on success

        } catch (error) {
            console.error(`Failed to ${isEditMode ? 'update' : 'add'} client:`, error);
            setErrors(prev => ({ ...prev, form: `Failed to ${isEditMode ? 'update' : 'save'} client. Please try again.` }));
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4 transform transition-all" 
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit}>
                    {/* Modal Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 p-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                            {isEditMode ? 'Edit Client' : 'Add New Client'}
                        </h3>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <i className="fas fa-times text-2xl"></i>
                        </button>
                    </div>
                    {/* Modal Body (Form) */}
                    <div className="p-6 space-y-4">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                            <input 
                                type="tel" 
                                id="phone" 
                                name="phone" 
                                value={formData.phone} 
                                onChange={handleChange} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>
                        {/* Company */}
                        <div>
                            <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company Name</label>
                            <input 
                                type="text" 
                                id="company" 
                                name="company" 
                                value={formData.company} 
                                onChange={handleChange} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                            />
                            {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
                        </div>
                        {errors.form && <p className="text-red-500 text-sm mt-2 text-center">{errors.form}</p>}
                    </div>
                    {/* Modal Footer (Form Buttons) */}
                    <div className="flex justify-end p-6 pt-4 border-t border-gray-200">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg mr-2 transition duration-300" 
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow transition duration-300 disabled:opacity-50" 
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    {isEditMode ? 'Updating...' : 'Saving...'}
                                </>
                            ) : (
                                isEditMode ? 'Update Client' : 'Save Client'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditClientModal;
