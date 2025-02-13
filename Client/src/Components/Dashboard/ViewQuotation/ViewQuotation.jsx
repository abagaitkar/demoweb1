import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";

import "jspdf-autotable";
import GeneratePDF from "../GeneratePDF/GeneratePDF";

const ViewQuotation = ({ onSubmit }) => {
  const [quotations, setQuotations] = useState([]);
  const [quotationDetails, setQuotationDetails] = useState([]);
  const [notesTerms, setNotesTerms] = useState([]);
  const [mergedData, setMergedData] = useState([]);
  const [filters, setFilters] = useState({
    QuotationRef: "",
    CustomerName: "",
    ProjectName: "",
    SalesEngineer: "",
    StartDate: "",
    EndDate: "",
  });

  // Fetch quotation master data
  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_APP_BASE_URL_PRODUCTION}/api/quotation_master`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setQuotations(data || []);
        console.log(data);
      })
      .catch((error) => console.error("Error fetching quotations:", error));
  }, []);

  // Fetch quotation details data
  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_APP_BASE_URL_PRODUCTION}/api/quotation_details`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => res.json())
      .then((data) => setQuotationDetails(data || []))
      .catch((error) =>
        console.error("Error fetching quotation details:", error)
      );
  }, []);

  useEffect(() => {
    fetch(
      `${
        import.meta.env.VITE_APP_BASE_URL_PRODUCTION
      }/api/get-latest-quotation`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => res.json())
      .then((data) => setNotesTerms(data || []))
      .catch((error) =>
        console.error("Error fetching quotation details:", error)
      );
  }, []);

  // Merge quotations with their details
  useEffect(() => {
    if (quotations.length > 0 && quotationDetails.length > 0) {
      const merged = quotations.map((quotation) => {
        const details = quotationDetails.filter(
          (detail) => detail.QuotationRef === quotation.QuotationRef
        );
        return { ...quotation, details };
      });

      setMergedData(merged.filter((q) => q.QuotationRef?.trim()));
    }
  }, [quotations, quotationDetails]);

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [id]: value }));
  };

  // Handle form submission for filtering
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(
      `${import.meta.env.VITE_APP_BASE_URL_PRODUCTION}/api/view_quotation`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      }
    )
      .then((res) => res.json())
      .then((data) =>
        setQuotations(data?.view_quotation?.selected_quotations || [])
      )
      .catch((error) =>
        console.error("Error fetching filtered quotations:", error)
      );
  };

  const gotoEdit = (Quotation) => {
    alert("Edit button clicked for Quotation ID: " + Quotation);
    localStorage.setItem("Quotation Details", Quotation);
    onSubmit();
  };

  const gotoDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this quotation?")) {
      fetch(
        `${import.meta.env.VITE_APP_BASE_URL_PRODUCTION}/api/quotation/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setQuotations((prev) => prev.filter((q) => q.QuotationRef !== id));
        })
        .catch((error) => console.error("Error deleting quotation:", error));
    }
  };

  // Download PDF

  const downloadPDF = (quotationData, notesTerms) => {
    const quotation = JSON.parse(quotationData);
    const notes = JSON.parse(notesTerms);
    GeneratePDF(quotation, notes);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">View Quotation</h1>
      <hr className="mb-4" />

      {/* Filter Form */}
      <div className="card p-4">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                id="QuotationRef"
                placeholder="Quotation Reference"
                value={filters.QuotationRef}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                id="CustomerName"
                placeholder="Customer Name"
                value={filters.CustomerName}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                id="ProjectName"
                placeholder="Project Name"
                value={filters.ProjectName}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          <div className="row g-3 mt-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                id="SalesEngineer"
                placeholder="Sales Engineer"
                value={filters.SalesEngineer}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="date"
                className="form-control"
                id="StartDate"
                value={filters.StartDate}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="date"
                className="form-control"
                id="EndDate"
                value={filters.EndDate}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          <div className="mt-4 d-flex gap-2">
            <button className="btn btn-primary" type="submit">
              View Quotation
            </button>
            <button className="btn btn-secondary" type="button">
              Print Table
            </button>
          </div>
        </form>
      </div>

      {/* Quotation Table */}
      <div className="table-responsive mt-5">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Quotation Ref</th>
              <th>Customer</th>
              <th>Project</th>
              <th>Sales Engineer</th>
              <th>Quotation Date</th>
              <th>FG Code</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Price</th>
              <th>Actions</th>
              <th>PDF</th>
            </tr>
          </thead>
          <tbody>
            {mergedData.length > 0 ? (
              mergedData.map((quotation) => (
                <React.Fragment key={quotation.QuotationRef}>
                  {quotation.details.length > 0 ? (
                    quotation.details.map((detail, index) => (
                      <tr key={`${quotation.QuotationRef}-${index}`}>
                        {index === 0 && (
                          <>
                            <td
                              rowSpan={quotation.details.length}
                              className="align-middle"
                            >
                              {quotation.QuotationRef}
                            </td>
                            <td
                              rowSpan={quotation.details.length}
                              className="align-middle"
                            >
                              {quotation.CustomerName}
                            </td>
                            <td
                              rowSpan={quotation.details.length}
                              className="align-middle"
                            >
                              {quotation.ProjectName}
                            </td>
                            <td
                              rowSpan={quotation.details.length}
                              className="align-middle"
                            >
                              {quotation.SalesEngineerName}
                            </td>
                            <td
                              rowSpan={quotation.details.length}
                              className="align-middle"
                            >
                              {quotation.CreatedDate}
                            </td>
                          </>
                        )}
                        <td>{detail.FGCode}</td>
                        <td>{detail.Quantity}</td>
                        <td>₹{detail.UnitPrice}</td>
                        <td>₹{detail.TotalPrice}</td>
                        {index === 0 && (
                          <>
                            <td
                              rowSpan={quotation.details.length}
                              className="align-middle d-flex gap-3"
                            >
                              <button
                                className="btn btn-success"
                                onClick={() =>
                                  gotoEdit(JSON.stringify(quotation))
                                }
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() =>
                                  gotoDelete(quotation.QuotationRef)
                                }
                              >
                                Delete
                              </button>
                            </td>
                            <td rowSpan={quotation.details.length}>
                              <button
                                className="btn btn-info text-light"
                                onClick={() =>
                                  downloadPDF(
                                    JSON.stringify(quotation),
                                    JSON.stringify(notesTerms)
                                  )
                                }
                              >
                                PDF
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr key={quotation.QuotationRef}>
                      <td>{quotation.QuotationRef}</td>
                      <td>{quotation.CustomerName}</td>
                      <td>{quotation.ProjectName}</td>
                      <td>{quotation.SalesEngineerName}</td>
                      <td>{quotation.CreatedDate}</td>
                      <td colSpan="4" className="text-center text-muted">
                        No details available
                      </td>
                      <td className="d-flex gap-3">
                        <button
                          className="btn btn-success"
                          onClick={() => gotoEdit(JSON.stringify(quotation))}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => gotoDelete(quotation.QuotationRef)}
                        >
                          Delete
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-info text-light"
                          onClick={() =>
                            downloadPDF(
                              JSON.stringify(quotation),
                              JSON.stringify(notesTerms)
                            )
                          }
                        >
                          PDF
                        </button>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center text-muted">
                  No quotations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewQuotation;
