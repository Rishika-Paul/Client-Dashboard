import React, { useState, useEffect } from 'react';
// import { API_URL } from '../constants'; // Removed this import

// Define API_URL directly in this file for the build environment
const API_URL = 'https://jsonplaceholder.typicode.com/users';

/**
 * Add Client Modal Component
 * (WEEK 5/6: Handling State and Forms in React)
 */
const AddClientModal = ({ isOpen, onClose, onSave }) => {
    // This component manages its own form state
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '' });
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({ name: '', email: '', phone: '', company: '' });
            setErrors({});
            setIsSaving(false);
        }
    }, [isOpen]);

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
        
        const newClientData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: { name: formData.company },
            username: formData.email.split('@')[0]
        };

        try {
            // (WEEK 6: API Integration)
            const response = await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify(newClientData),
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const addedClient = await response.json();
            onSave({ ...newClientData, id: addedClient.id }); // Pass new client data up to App
            onClose(); // Close modal on success

        } catch (error) {
            console.error('Failed to add client:', error);
            setErrors(prev => ({ ...prev, form: 'Failed to save client. Please try again.' }));
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
                        <h3 className="text-xl font-semibold text-gray-800">Add New Client</h3>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <i className="fas fa-times text-2xl"></i>
                        </button>
                    </div>
                    {/* Modal Body (Form) */}
                    <div className="p-6 space-y-4">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>
                        {/* Company */}
                        <div>
                            <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company Name</label>
                            <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
                        </div>
                        {errors.form && <p className="text-red-500 text-sm mt-2 text-center">{errors.form}</p>}
                    </div>
                    {/* Modal Footer (Form Buttons) */}
                    <div className="flex justify-end p-6 pt-4 border-t border-gray-200">
                        <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg mr-2 transition duration-300" disabled={isSaving}>
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow transition duration-300 disabled:opacity-50" disabled={isSaving}>
                            {isSaving ? <><i className="fas fa-spinner fa-spin mr-2"></i>Saving...</> : 'Save Client'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddClientModal;



