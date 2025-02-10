import React, { useState } from 'react';

const EditComponents = () => {
    const data = localStorage.getItem('Quotation Details');
    const data1 = JSON.parse(data);
    const details = data1.details[0];

    // State to hold form values
    const [customerName, setCustomerName] = useState(data1.CustomerName);
    const [projectName, setProjectName] = useState(data1.ProjectName);
    const [projectLocation, setProjectLocation] = useState(data1.ProjectLocation);
    const [salesEngineerName, setSalesEngineerName] = useState(data1.SalesEngineerName);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare the updated data to be sent
        const updatedData = {
            QuotationRef: data1.QuotationRef,
            CustomerName: customerName,
            ProjectName: projectName,
            ProjectLocation: projectLocation,
            SalesEngineerName: salesEngineerName,
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL_PRODUCTION}/api/quotations/${data1.QuotationRef}`, {
                method: 'PUT', // Assuming you're updating the data
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                throw new Error('Error updating the data');
            }

            const result = await response.json();
            console.log('Data updated successfully:', result);

            // Optionally, redirect or show success message
            alert('Quotation updated successfully!');
        } catch (error) {
            console.error('Error updating data:', error);
            alert('Failed to update quotation!');
        }
    };

    return (
        <div className='container'>
            <h1 className="text-center">Edit Component for : {data1.QuotationRef}</h1>
            <hr className="mb-4" />

            <div className="formContainer card p-3 shadow mb-5 mt-3 w-75 mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="QuotationRef" className="form-label">Quotation Ref:</label>
                        <input type="text" className="form-control" id="quotationRef" disabled value={data1.QuotationRef} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="CustomerName" className="form-label">Customer Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="CustomerName"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="ProjectName" className="form-label">Project Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="ProjectName"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="ProjectLocation" className="form-label">Project Location:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="ProjectLocation"
                            value={projectLocation}
                            onChange={(e) => setProjectLocation(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="SalesEngineerName" className="form-label">Sales Engineer Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="SalesEngineerName"
                            value={salesEngineerName}
                            onChange={(e) => setSalesEngineerName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="FGCode" className="form-label">FG Code:</label>
                        <input type="text" className="form-control" id="FGCode" disabled value={details.FGCode || " "} />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default EditComponents;
