// import React, { useState } from "react";
// import { Modal, Button } from "react-bootstrap";
// import "../../../App.css";
// import ProductCodeGenerator from "../ProductCodeGenerator/ProductCodeGenerator";

// const CreateQuotation = () => {
//   const [selectedValues, setSelectedValues] = useState({});
//   const [quantity, setQuantity] = useState(1);
//   const [descriptions, setDescriptions] = useState([]); // Array to store multiple descriptions
//   const [quotationRef, setQuotationRef] = useState([]);
//   console.log(descriptions);

//   const [formData, setFormData] = useState({
//     CustomerName: "",
//     ProjectName: "",
//     ProjectLocation: "",
//     salesEngineerName: "",
//   });

//   const [vals, setVals] = useState({
//     pricebasis: "",
//     gstno: "",
//     packing: "",
//     forwarding: "",
//     freightcharges: "",
//     cddschedule: "",
//     payment: "",
//   });

//   // const [vals, setVals] = useState({
//   //   pricebasis: "Ex-works, Rabale-Navi Mumbai",
//   //   gstno: "(SANAND) - 24AAACS7348N1ZY",
//   //   packing: "Road worthy",
//   //   forwarding: "3% Extra for inland transport",
//   //   freightcharges: "at actual, to your account.",
//   //   cddschedule:
//   //     "16 to 18 weeks ex-mfg unit, after the receipt of approval on GAD / QAP (ITP)",
//   //   payment:
//   //     "30% advance and balance against Pro-forma Invoice before dispatch.",
//   // });

//   const [showModal, setShowModal] = useState(false);

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Reset form fields
//   const resetForm = () => {
//     setFormData({
//       CustomerName: "",
//       ProjectName: "",
//       ProjectLocation: "",
//       salesEngineerName: "",
//     });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_APP_BASE_URL_PRODUCTION}/api/create_quotation`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(formData),
//         }
//       );

//       const data = await response.json();
//       if (response.ok) {
//         resetForm();
//         setQuotationRef(data.quotationRef);
//         localStorage.setItem("New QuotationRef Id", data.quotationId);
//         setShowModal(true);
//       } else {
//         alert(`Error: ${data.error}`);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Failed to create quotation.");
//     }
//   };

//   const gotoReview = async () => {
//     alert("Quotation submitted for review.");
//   };

//   return (
//     <div className="container">
//       <h1 className="text-center mt-5 display-4">Create Quotation</h1>
//       <hr className="mb-3" />
//       <div className="card p-3 shadow">
//         <form>
//           {[
//             "CustomerName",
//             "ProjectName",
//             "salesEngineerName",
//             "ProjectLocation",
//           ].map((field, index) => (
//             <div key={index} className="mb-3 d-flex">
//               <label htmlFor={field} className="form-label fs-5 me-2 w-25">
//                 {field.replace(/([A-Z])/g, " $1").trim()}:
//               </label>
//               <input
//                 type="text"
//                 className="form-control w-50"
//                 id={field}
//                 name={field}
//                 value={formData[field]}
//                 onChange={handleChange}
//                 placeholder={`Enter ${field.replace(/([A-Z])/g, " $1").trim()}`}
//                 required
//               />
//             </div>
//           ))}
//         </form>
//       </div>
//       <div className="button">
//         <button
//           type="submit"
//           onClick={handleSubmit}
//           className="btn btn-primary w-25 mt-3"
//         >
//           Next
//         </button>
//       </div>

//       <Modal
//         show={showModal}
//         onHide={() => setShowModal(false)}
//         className="modal-fullscreen-xxl-down"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>
//             Generate FG Code <br />
//             QuotationRef: {quotationRef}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <ProductCodeGenerator
//             quotationRef={quotationRef}
//             selectedValues={selectedValues}
//             setSelectedValues={setSelectedValues}
//             quantity={quantity}
//             setQuantity={setQuantity}
//             setDescription={
//               (newDescription) =>
//                 setDescriptions((prev) => [...prev, newDescription]) // Append to array
//             }
//           />
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Multiple tables to display all descriptions */}
//       <div className="tableContainer mt-4">
//         {/* Displaying all descriptions inside a single table */}
//         {descriptions.length > 0 && (
//           <div className="tableContainer mt-4">
//             <table className="table table-bordered mt-3">
//               <thead>
//                 <tr>
//                   <th>TYPE OF VALVE</th>
//                   <th>SIZE</th>
//                   <th>CLASS</th>
//                   <th>END</th>
//                   <th>BODY MOC</th>
//                   <th>TRIM (OBTURATOR + SEAT RING +STEM)</th>
//                   <th>SEAT INSERT</th>
//                   <th>BODY SEAL/GLAND PACKING</th>
//                   <th>FASTENERS</th>
//                   <th>OPERATION</th>
//                   <th>SPECIAL REQUIREMENT</th>
//                   <th>Unit Price</th>
//                   <th>Total Price</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {descriptions.map((desc, index) => (
//                   <tr key={index}>
//                     {Object.values(desc).map((value, idx) => (
//                       <td key={idx}>{value}</td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         <div className="mt-5">
//           <div className="notes">
//             <h4>A) Technical notes:</h4>
//             <textarea
//               className="w-100 p-2"
//               name="technicalNotes"
//               id="technicalNotes"
//               style={{ height: "210px" }}
//               defaultValue={` # SSV standard painting shall be as follows: a) For Forged valves
//               – Parkarised / phosphate surface. b) For Cast Valves –
//               Anti-corrosion Co-polymer paint in light grey /HR-Aluminum with a
//               DFT of 25 microns (approximate). c) For any special painting,
//               charges shall be extra based on the painting/surface finish
//               preparation. Painting specification may be submitted to us to
//               quote for the same. # We reserve the right to change the "Material
//               form" of body/trims/other BOM quoted to other "Equivalent or
//               Better Materials" in the event of an order , if required. # This
//               bid is limited to materials, procedures and documentation
//               described in the quotation itself. We reserve the right to change
//               our quote should there be any additional requirements over and
//               above the quoted. # We have quoted based on the information
//               provided in the enquiry and its attachments. We reserve the right
//               to revise our quote if any other specs which are not attached but
//               asked to comply at later stage. # Process Conditions & Parameters
//               mentioned in this offer are for reference only. Resposibility of
//               selection of materials based on these process conditions and
//               parameters shall be with EPC/Client only.`}
//             />
//           </div>
//           <div className="terms mt-5">
//             <h4>B) Commercial Terms: </h4>
//             <div className="card p-3 shadow">
//               <form>
//                 <div className="mb-3 d-flex">
//                   <label
//                     htmlFor="pricebasis"
//                     className="form-label fs-5 me-2 w-25"
//                   >
//                     Price Basis:
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="pricebasis"
//                     value={vals.pricebasis}
//                     onChange={(e) =>
//                       setVals({ ...vals, pricebasis: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div className="mb-3 d-flex">
//                   <label htmlFor="gstno" className="form-label fs-5 me-2 w-25">
//                     GST NO.:
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="gstno"
//                     value={vals.gstno}
//                     onChange={(e) =>
//                       setVals({ ...vals, gstno: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div className="mb-3 d-flex">
//                   <label
//                     htmlFor="packing"
//                     className="form-label fs-5 me-2 w-25"
//                   >
//                     Packing:
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="packing"
//                     value={vals.packing}
//                     onChange={(e) =>
//                       setVals({ ...vals, packing: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div className="mb-3 d-flex">
//                   <label
//                     htmlFor="forwarding"
//                     className="form-label fs-5 me-2 w-25"
//                   >
//                     Packing & forwarding:
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="packing&forwarding"
//                     value={vals.forwarding}
//                     onChange={(e) =>
//                       setVals({ ...vals, forwarding: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div className="mb-3 d-flex">
//                   <label
//                     htmlFor="freightcharges"
//                     className="form-label fs-5 me-2 w-25"
//                   >
//                     Freight charges:
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="freightcharges"
//                     value={vals.freightcharges}
//                     onChange={(e) =>
//                       setVals({ ...vals, freightcharges: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div className="mb-3 d-flex">
//                   <label
//                     htmlFor="cddschedule"
//                     className="form-label fs-5 me-2 w-25"
//                   >
//                     CDD / Del. Schedule:
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="cddschedule"
//                     value={vals.cddschedule}
//                     onChange={(e) =>
//                       setVals({ ...vals, cddschedule: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div className="mb-3 d-flex">
//                   <label
//                     htmlFor="payment"
//                     className="form-label fs-5 me-2 w-25"
//                   >
//                     Payment:
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="payment"
//                     value={vals.payment}
//                     onChange={(e) =>
//                       setVals({ ...vals, payment: e.target.value })
//                     }
//                   />
//                 </div>
//               </form>
//             </div>
//           </div>
//           <div className="terms mt-5">
//             <h4>C) Technical notes:</h4>
//             <textarea
//               className="w-100 p-2"
//               name="technicalNotes"
//               id="technicalNotes"
//               style={{ height: "300px" }}
//               defaultValue={`* Taxes at actual. Presently 18% GST is applicable. HSN code for
//               valves is 84818030 & for valve spares is 84819090 * Transit
//               Insurance: Shall be at your scope. * Warranty: 12 months from the
//               date of installation or 18 months from the date of dispatch,
//               whichever earlier against manufacturing defects only shall be
//               applicable. The warranty does not cover damage arising from
//               inappropriate storage or handling or transport; incorrect
//               installation or operation; inappropriate use; wrong operating
//               media, chemical or electrical influence and natural wear,
//               particularly of parts subject to wear. Our liability is limited
//               only to damages of the supplied product. * Warranty for Deemed
//               Exports: Our service backup is available only in India. For any
//               service backup or Warranty or visits outside India, we shall
//               charge to & fro Airfare, Visa Charges and Local lodging expenses
//               extra. * Inspection: Third party inspection charges, if any shall
//               will be to your account. * Cancellation /Modification of order: If
//               order is cancelled or modified (qty reduced) during the
//               contractual period, we reserve the option to charge cancellation
//               fees as follows: a) After approval of GAD / manufacturing
//               clearance within one week: 10% b) Within four weeks from
//               manufacturing clearance – 15% c) After four weeks to contractual
//               Delivery Date - 50% d) No cancellation is acceptable for SS Valves
//               / Special valves after 4 weeks. FORMAT F-P-07-03 * Validity: 30
//               days fro the date of commercial offer. ISSUE DATE 01.04.2017 *
//               GIVEN PRICES ARE FOR TOTAL UNDIVIDED ORDER, IN CASE OF CHANGES IN
//               QUANTITIES, WE RESERVE THE RIGHT TO REVISE PRICES ACCORDINGLY. REV
//               02 Please revert if you have any queries on the above. `}
//             />
//           </div>
//         </div>

//         <div className="d-flex align-items-center justify-content-center m-3">
//           <button className="btn btn-success p-2 mt-4" onClick={gotoReview}>
//             Submit to Review
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateQuotation;
import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "../../../App.css";
import ProductCodeGenerator from "../ProductCodeGenerator/ProductCodeGenerator";

const CreateQuotation = () => {
  const [selectedValues, setSelectedValues] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [descriptions, setDescriptions] = useState([]);
  const [quotationRef, setQuotationRef] = useState(null);
  const [formData, setFormData] = useState({
    CustomerName: "",
    ProjectName: "",
    ProjectLocation: "",
    salesEngineerName: "",
  });
  const [vals, setVals] = useState({
    technicalNotes: "",
    priceBasis: "",
    gstNo: "",
    packing: "",
    forwarding: "",
    freightCharges: "",
    cddSchedule: "",
    payment: "",
    commercialTerms: "",
    quotationRef: null,
  });

  useEffect(() => {
    setVals((prev) => ({ ...prev, quotationRef }));
  }, [quotationRef]);

  useEffect(() => {
    const fetchLatestQuotation = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_APP_BASE_URL_PRODUCTION
          }/api/get-latest-quotation`
        );
        const data = await res.json();
        console.log("Fetched Data:", data); // Debugging
        if (data) {
          setVals(data); // Store all data
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchLatestQuotation();
  }, []);

  const saveQuotation = () => {
    console.log("Saving quotation:", vals);
    fetch(
      `${import.meta.env.VITE_APP_BASE_URL_PRODUCTION}/api/save-quotation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vals),
      }
    )
      .then((res) => res.json())
      .then(() => alert("Quotation saved successfully!"))
      .catch((err) => console.error("Error saving quotation:", err));
  };

  const saveDescription = () => {
    fetch(
      `${import.meta.env.VITE_APP_BASE_URL_PRODUCTION}/api/save-descriptions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(descriptions),
      }
    )
      .then((res) => res.json())
      .then(() => alert("Quotation saved successfully!"))
      .catch((err) => console.error("Error saving quotation:", err));
  };
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState(1);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({
      CustomerName: "",
      ProjectName: "",
      ProjectLocation: "",
      salesEngineerName: "",
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BASE_URL_PRODUCTION}/api/create_quotation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        resetForm();
        setQuotationRef(data.quotationRef);
        localStorage.setItem("New QuotationRef Id", data.quotationId);
        setActiveTab(2);
        setShowModal(true);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create quotation.");
    }
  };

  return (
    <div className="container">
      <h1 className="text-center mt-5 display-4">Create Quotation</h1>
      <hr className="mb-3" />

      {/* TAB 1: Quotation Form */}
      {activeTab === 1 && (
        <div className="card p-3 shadow">
          <form>
            {[
              "CustomerName",
              "ProjectName",
              "salesEngineerName",
              "ProjectLocation",
            ].map((field, index) => (
              <div key={index} className="mb-3 d-flex">
                <label htmlFor={field} className="form-label fs-5 me-2 w-25">
                  {field.replace(/([A-Z])/g, " $1").trim()}:
                </label>
                <input
                  type="text"
                  className="form-control w-50"
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={`Enter ${field
                    .replace(/([A-Z])/g, " $1")
                    .trim()}`}
                  required
                />
              </div>
            ))}
          </form>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary w-25 mt-3"
          >
            Submit
          </button>
        </div>
      )}

      {/* TAB 2: Product Code Generator */}
      {activeTab === 2 && quotationRef && (
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          className="modal-fullscreen-xxl-down"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Generate FG Code <br />
              QuotationRef: {quotationRef}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ProductCodeGenerator
              quotationRef={quotationRef}
              selectedValues={selectedValues}
              setSelectedValues={setSelectedValues}
              quantity={quantity}
              setQuantity={setQuantity}
              setDescription={(newDescription) =>
                setDescriptions((prev) => [...prev, newDescription])
              }
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button className="btn btn-primary" onClick={() => setActiveTab(3)}>
              Next
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Display descriptions table only if there are descriptions */}
      {activeTab === 2 && descriptions.length > 0 && (
        <div className="tableContainer mt-4">
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>TYPE OF VALVE</th>
                <th>SIZE</th>
                <th>CLASS</th>
                <th>END</th>
                <th>BODY MOC</th>
                <th>TRIM (OBTURATOR + SEAT RING +STEM)</th>
                <th>SEAT INSERT</th>
                <th>BODY SEAL/GLAND PACKING</th>
                <th>FASTENERS</th>
                <th>OPERATION</th>
                <th>SPECIAL REQUIREMENT</th>
                <th>Unit Price</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {descriptions.map((desc, index) => (
                <tr key={index}>
                  {Object.values(desc).map((value, idx) => (
                    <td key={idx}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: Commercial Terms */}
      {activeTab === 3 && (
        <div className="terms mt-5">
          <div className="notes">
            <h4>A) Technical notes:</h4>
            <textarea
              className="w-100 p-2"
              name="technicalNotes"
              id="technicalNotes"
              placeholder="Enter technical notes here..."
              value={vals.technicalNotes}
              onChange={(e) =>
                setVals({ ...vals, technicalNotes: e.target.value })
              }
              style={{ height: "210px" }}
            />
          </div>
          <div className="d-flex gap-3">
            <button
              className="btn btn-secondary mt-3"
              onClick={() => setActiveTab(2)}
            >
              Previous
            </button>
            <button
              className="btn btn-primary mt-3"
              onClick={() => setActiveTab(4)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: Technical Notes */}
      {activeTab === 4 && (
        <div className="terms mt-5">
          <h4>B) Commercial Terms: </h4>
          <div className="card p-3 shadow">
            <form>
              <div className="mb-3 d-flex">
                <label
                  htmlFor="pricebasis"
                  className="form-label fs-5 me-2 w-25"
                >
                  Price Basis:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="pricebasis"
                  name="priceBasis"
                  value={vals.priceBasis}
                  onChange={(e) =>
                    setVals({ ...vals, priceBasis: e.target.value })
                  }
                />
              </div>
              <div className="mb-3 d-flex">
                <label htmlFor="gstno" className="form-label fs-5 me-2 w-25">
                  GST NO.:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="gstno"
                  name="gstNo"
                  value={vals.gstNo}
                  onChange={(e) => setVals({ ...vals, gstNo: e.target.value })}
                />
              </div>
              <div className="mb-3 d-flex">
                <label htmlFor="packing" className="form-label fs-5 me-2 w-25">
                  Packing:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="packing"
                  name="packing"
                  value={vals.packing}
                  onChange={(e) =>
                    setVals({ ...vals, packing: e.target.value })
                  }
                />
              </div>
              <div className="mb-3 d-flex">
                <label
                  htmlFor="forwarding"
                  className="form-label fs-5 me-2 w-25"
                >
                  Packing & forwarding:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="packing&forwarding"
                  name="forwarding"
                  value={vals.forwarding}
                  onChange={(e) =>
                    setVals({ ...vals, forwarding: e.target.value })
                  }
                />
              </div>
              <div className="mb-3 d-flex">
                <label
                  htmlFor="freightcharges"
                  className="form-label fs-5 me-2 w-25"
                >
                  Freight charges:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="freightcharges"
                  name="freightCharges"
                  value={vals.freightCharges}
                  onChange={(e) =>
                    setVals({ ...vals, freightCharges: e.target.value })
                  }
                />
              </div>
              <div className="mb-3 d-flex">
                <label
                  htmlFor="cddSchedule"
                  className="form-label fs-5 me-2 w-25"
                >
                  CDD / Del. Schedule:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="cddschedule"
                  name="cddSchedule"
                  value={vals.cddSchedule}
                  onChange={(e) =>
                    setVals({ ...vals, cddSchedule: e.target.value })
                  }
                />
              </div>
              <div className="mb-3 d-flex">
                <label htmlFor="payment" className="form-label fs-5 me-2 w-25">
                  Payment:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="payment"
                  name="payment"
                  placeholder="Enter payment terms..."
                  value={vals.payment}
                  onChange={(e) =>
                    setVals({ ...vals, payment: e.target.value })
                  }
                />
              </div>
            </form>
          </div>

          <div className="d-flex gap-3">
            <button
              className="btn btn-secondary p-2 mt-4"
              onClick={() => setActiveTab(3)}
            >
              Previous
            </button>
            <button
              className="btn btn-primary p-2 mt-4"
              onClick={() => setActiveTab(5)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {activeTab === 5 && (
        <div className="terms mt-5">
          <div className="notes">
            <h4>A) Commercial Terms:</h4>
            <textarea
              className="w-100 p-2"
              name="commercialTerms" // Updated name
              id="commercialTerms" // Updated id
              value={vals.commercialTerms} // Use "value" instead of "values"
              onChange={(e) => {
                setVals({ ...vals, commercialTerms: e.target.value });
              }}
              style={{ height: "210px" }}
            />
          </div>
          <div className="d-flex gap-3">
            <button
              className="btn btn-primary mt-3"
              onClick={() => setActiveTab(4)}
            >
              Previous
            </button>
            <button
              className="btn btn-success mt-3"
              onClick={() => {
                saveQuotation();
                saveDescription();
              }}
            >
              Submit to Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQuotation;
