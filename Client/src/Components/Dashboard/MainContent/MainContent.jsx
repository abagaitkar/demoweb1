import React, { useEffect, useRef, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';


const MainContent = () => {
    const [quotationCount, setQuotationCount] = useState(0)
    const [quotationAmount, setQuotationAmount] = useState(0)
    const [averageQuotationAmount, setAverageQuotationAmount] = useState(0)
    const [monthlyQuotation, setMonthlyQuotation] = useState({
        months: [],
        counts: []
    })
    const [quotationBySalesEngineer, setQuotationBySalesEngineer] = useState({
        sales_engineer: [],
        counts: []
    })
    const [monthlyRevenueTrends, setMonthlyRevenueTrends] = useState({
        month: [],
        revenue: []
    })

    const [componentConfig, setComponentConfig] = useState([]);
    const [recentQuotations, setRecentQuotations] = useState([]);


    // Initializing form data state
    const [formData, setFormData] = useState({
        quotationRef: '',
        customerName: '',
        projectName: '',
        SalesEngineerName: '',
        startDate: '',
        endDate: '',
    });

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();

        // Rename local formData to avoid conflict
        const formDataToSubmit = {
            QuotationRef: formData.quotationRef,
            CustomerName: formData.customerName,
            ProjectName: formData.projectName,
            SalesEngineerName: formData.SalesEngineerName,
            StartDate: formData.startDate,
            EndDate: formData.endDate,
        };

        fetch(`${import.meta.env.VITE_APP_BASE_URL_PRODUCTION}/api/filterData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataToSubmit), // Use the correct variable
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Filtered data:", data);
                // Handle the filtered data here
            })
            .catch((error) => {
                console.error("Error fetching filtered data:", error);
            });
    };

    // This API for Data Count
    useEffect(() => {
        return () => {
            fetch(`${import.meta.env.VITE_APP_BASE_URL_PRODUCTION}/api/quotation_master`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data1) => {
                    setQuotationCount(data1.length)
                    // console.log(object);
                })
                .catch((error) => {
                    console.error("Error fetching Quotation Master data:", error);
                });
        };
    }, []);


    // This API for Quotation Details
    useEffect(() => {
        fetch(`${import.meta.env.VITE_APP_BASE_URL_PRODUCTION}/api/quotation_details`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data1) => {
                // Sum up all TotalPrice values
                const totalPriceSum = data1.reduce((sum, item) => {
                    return sum + (item.TotalPrice || 0); // Ensure TotalPrice exists, default to 0 if not
                }, 0);

                const averageTotalPriceSum = totalPriceSum / data1.length;
                setQuotationAmount(totalPriceSum); // Store the total sum
                setAverageQuotationAmount(Math.floor(averageTotalPriceSum)); // Store the total sum

            })
            .catch((error) => {
                console.error("Error fetching Quotation Master data:", error);
            });
    }, []);


    // This API for Monthly Quotation
    useEffect(() => {
        return () => {
            fetch(`${import.meta.env.VITE_APP_BASE_URL_PRODUCTION}/api/monthly-quotations`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data1) => {
                    const months = data1.map(item => item.month); // Extract months
                    const counts = data1.map(item => item.count); // Extract counts

                    setMonthlyQuotation({
                        months: months,
                        counts: counts
                    })
                })
                .catch((error) => {
                    console.error("Error fetching Quotation Master data:", error);
                });
        };
    }, []);


    // This API for Quotations by Sales Engineer
    useEffect(() => {
        fetch(`${import.meta.env.VITE_APP_BASE_URL_PRODUCTION}/api/quotations-by-sales-engineer`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data1) => {
                const sales_engineer = data1.map(item => item.sales_engineer); // Extract sales engineers
                const counts = data1.map(item => item.count); // Extract counts

                setQuotationBySalesEngineer({
                    sales_engineer: sales_engineer,
                    counts: counts
                });
            })
            .catch((error) => {
                console.error("Error fetching Quotation Master data:", error);
            });
    }, []); // Empty dependency array ensures this runs once when the component mounts

    // API for Monthly Revenue
    useEffect(() => {
        fetch(`${import.meta.env.VITE_APP_BASE_URL_PRODUCTION}/api/monthly-revenue-trends`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                const months = data.map((item) => item.month); // Extract month
                const revenues = data.map((item) => item.revenue); // Extract revenue

                setMonthlyRevenueTrends({
                    month: months,
                    revenue: revenues,
                });
            })
            .catch((error) => {
                console.error("Error fetching Monthly Revenue Trends:", error);
            });
    }, []);


    // API for Component Config
    useEffect(() => {
        fetch(`${import.meta.env.VITE_APP_BASE_URL_PRODUCTION}/api/component-usage-breakdown`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                const formattedData = data.map((item, index) => ({
                    id: index,
                    value: item.count,
                    label: item.component,
                }));

                setComponentConfig(formattedData);
            })
            .catch((error) => {
                console.error("Error fetching Component Usage Breakdown:", error);
            });
    }, []);


    // API for Recent Quotations
    useEffect(() => {
        fetch(`${import.meta.env.VITE_APP_BASE_URL_PRODUCTION}/api/recent-quotations`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setRecentQuotations(data);
            })
            .catch((error) => {
                console.error("Error fetching Component Usage Breakdown:", error);
            });
    }, []);



    return (
        <>
            <h1 className='display-5 text-center'>Dashboard</h1>
            <hr />
            <div className="container mt-3">
                {/* Form Div */}
                <div className="formDiv mt-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <div className="col-12 col-md-6 mb-3 mb-md-0">
                                <label htmlFor="quotationRef" className="form-label fs-5">Quotation Ref: </label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm p-2 fs-6 text-dark shadow-sm bg-body-tertiary rounded"
                                    id="quotationRef"
                                    name="quotationRef"
                                    value={formData.quotationRef}
                                    onChange={handleChange}
                                    placeholder="Enter Quotation Ref"
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <label htmlFor="customerName" className="form-label fs-5">Customer Name: </label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm p-2 fs-6 text-dark shadow-sm bg-body-tertiary rounded"
                                    id="customerName"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    placeholder="Enter Customer Name"
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-12 col-md-6 mb-3 mb-md-0">
                                <label htmlFor="projectName" className="form-label fs-5">Project Name: </label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm p-2 fs-6 text-dark shadow-sm bg-body-tertiary rounded"
                                    id="projectName"
                                    name="projectName"
                                    value={formData.projectName}
                                    onChange={handleChange}
                                    placeholder="Enter Project Name"
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <label htmlFor="SalesEngineerName" className="form-label fs-5">Sales Engineer: </label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm p-2 fs-6 text-dark shadow-sm bg-body-tertiary rounded"
                                    id="SalesEngineerName"
                                    name="SalesEngineerName"
                                    value={formData.SalesEngineerName}
                                    onChange={handleChange}
                                    placeholder="Enter Sales Engineer Name"
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-12 col-md-6 mb-3 mb-md-0">
                                <label htmlFor="startDate" className="form-label fs-5">Start Date: </label>
                                <input
                                    type="date"
                                    className="form-control form-control-sm p-2 fs-6 text-dark shadow-sm bg-body-tertiary rounded"
                                    id="startDate"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <label htmlFor="endDate" className="form-label fs-5">End Date: </label>
                                <input
                                    type="date"
                                    className="form-control form-control-sm p-2 fs-6 text-dark shadow-sm bg-body-tertiary rounded"
                                    id="endDate"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="d-flex align-items-center justify-content-center mt-5">
                            <button type="submit" className="btn btn-primary w-25">View</button>
                        </div>
                    </form>
                </div>

                {/* Details Cards */}
                <div className="smallCards mt-5">
                    <div className="row text-center">
                        <div className="col-12 col-sm-4 mb-3 mb-sm-0">
                            <div className="card p-1 border border-primary">
                                <div className="card-body">
                                    <h5 className="card-title">Total Quotation</h5>
                                    <p className="card-text h4">{quotationCount}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-4 mb-3 mb-sm-0">
                            <div className="card p-1 border border-primary">
                                <div className="card-body">
                                    <h5 className="card-title">Total Quoted Amount</h5>
                                    <p className="card-text h4">₹{quotationAmount}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-4">
                            <div className="card p-1 border border-primary">
                                <div className="card-body">
                                    <h5 className="card-title">Average Quoted Amount</h5>
                                    <p className="card-text h4">₹{averageQuotationAmount}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analytics Charts */}
                <div className="charts mt-5">
                    <div className="row d-flex align-items-center justify-content-around">
                        {/* Bar Chart */}
                        <div className="col-12 col-md-5 mb-4 mb-md-0">
                            <BarChart
                                xAxis={[{ id: "barCategories", data: monthlyQuotation.months, scaleType: "band" }]}
                                series={[{ data: monthlyQuotation.counts }]}
                                width={500}
                                height={300}
                            />
                        </div>

                        {/* Pie Chart */}
                        <div className="col-12 col-md-7 mb-4 mb-md-0">
                            <PieChart
                                series={[{
                                    data: quotationBySalesEngineer.sales_engineer.map((engineer, index) => ({
                                        id: index,
                                        value: quotationBySalesEngineer.counts[index],
                                        label: engineer
                                    })),
                                    innerRadius: 0,
                                    outerRadius: 130,
                                    cx: 150,
                                    cy: 150,
                                }]}
                                width={700}
                                height={300}
                            />
                        </div>
                    </div>

                    <hr />

                    <div className="row">
                        <div className="col-12 col-md-5 mb-4 mb-md-0">
                            <LineChart
                                xAxis={[{ data: monthlyRevenueTrends.month, scaleType: "point" }]}
                                series={[{ data: monthlyRevenueTrends.revenue, label: "Revenue" }]}
                                width={500}
                                height={300}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <PieChart
                                series={[{
                                    data: componentConfig,
                                    innerRadius: 50,
                                    outerRadius: 120,
                                    paddingAngle: 2,
                                    cornerRadius: 3,
                                    cx: 150,
                                    cy: 150,
                                    labelPosition: "outside",
                                    labelStyle: { fontSize: 12, fill: "black" },
                                }]}
                                width={720}
                                height={350}
                            />
                        </div>
                    </div>
                </div>

                {/* Recent Quotations */}
                <div className="tableContainer mt-5">
                    <h1 className="text-center m-5 display-5 fw-normal">Recent Quotations</h1>
                    <div className="table-responsive">
                        <table className="table table-striped mt-5 mb-5">
                            <thead>
                                <tr>
                                    <th scope="col">Quotation ID</th>
                                    <th scope="col">Customer Name</th>
                                    <th scope="col">Project Name</th>
                                    <th scope="col">Quotation Ref</th>
                                    <th scope="col">Created Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentQuotations.length > 0 ? (
                                    recentQuotations.map((quotation, index) => (
                                        <tr key={quotation.QuotationId}>
                                            <td>{quotation.QuotationId}</td>
                                            <td>{quotation.CustomerName}</td>
                                            <td>{quotation.ProjectName}</td>
                                            <td>{quotation.QuotationRef}</td>
                                            <td>{quotation.CreatedDate}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5">No data available</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </>
    );
}

export default MainContent;
