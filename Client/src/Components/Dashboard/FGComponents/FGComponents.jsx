import React, { useEffect, useState } from "react";

const FGComponents = () => {
    const [quotationVals, setQuotationVals] = useState([]);
    const [quotationConf, setQuotationConf] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_APP_BASE_URL_PRODUCTION}/api/componentConfig`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .then((data) => {
                setQuotationConf(data || []);
            })
            .catch((error) => console.error("Error fetching component config:", error));
    }, []);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_APP_BASE_URL_PRODUCTION}/api/componentValues`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .then((data) => {
                setQuotationVals(data || []);
            })
            .catch((error) => console.error("Error fetching component values:", error));
    }, []);

    return (
        <>
            <h1 className="text-center mt-5">Manage Components</h1>
            <hr className="mb-5" />
            <div className="tableContainer">
                <table className="table table-bordered table-striped">
                    <thead className="table-light">
                        <tr>
                            <th className="w-25">Component Name</th>
                            <th className="w-50">Value Code</th>
                            <th className="w-50">Value Description</th>
                            <th className="w-25">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quotationConf.map((component) => {
                            // Filter values that belong to the current component
                            const relatedValues = quotationVals.filter(
                                (value) => value.ComponentID === component.ComponentID
                            );

                            return (
                                <React.Fragment key={component.ComponentID}>
                                    {/* First Row with Component Name */}
                                    <tr>
                                        <td className="fw-bold" rowSpan={relatedValues.length || 1}>{component.ComponentName}</td>
                                        {relatedValues.length > 0 ? (
                                            <>
                                                <td>{relatedValues[0].ValueCode}</td>
                                                <td>{relatedValues[0].ValueDescription}</td>
                                                <td>
                                                    <button className="btn btn-danger">Delete</button>
                                                </td>
                                            </>
                                        ) : (
                                            <td colSpan="3" className="text-center">No values available</td>
                                        )}
                                    </tr>

                                    {/* Remaining rows for other values */}
                                    {relatedValues.slice(1).map((value) => (
                                        <tr key={value.ValueID}>
                                            <td>{value.ValueCode}</td>
                                            <td>{value.ValueDescription}</td>
                                            <td>
                                                <button className="btn btn-danger">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default FGComponents;
