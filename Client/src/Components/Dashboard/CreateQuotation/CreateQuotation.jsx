import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "../../../App.css";
import ProductCodeGenerator from "../ProductCodeGenerator/ProductCodeGenerator";

const CreateQuotation = () => {
  const [selectedValues, setSelectedValues] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [descriptions, setDescriptions] = useState([]); // Array to store multiple descriptions
  const [quotationRef, setQuotationRef] = useState([]);
  console.log(descriptions);

  const [formData, setFormData] = useState({
    CustomerName: "",
    ProjectName: "",
    ProjectLocation: "",
    salesEngineerName: "",
  });

  const [showModal, setShowModal] = useState(false);

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
      if (response.ok) {
        resetForm();
        setQuotationRef(data.quotationRef);
        localStorage.setItem("New QuotationRef Id", data.quotationId);
        setShowModal(true);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create quotation.");
    }
  };

  const gotoReview = async () => {
    alert("Quotation submitted for review.");
  };

  return (
    <div className="container">
      <h1 className="text-center mt-5 display-4">Create Quotation</h1>
      <hr className="mb-3" />
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
                placeholder={`Enter ${field.replace(/([A-Z])/g, " $1").trim()}`}
                required
              />
            </div>
          ))}
        </form>
      </div>
      <div className="button">
        <button
          type="submit"
          onClick={handleSubmit}
          className="btn btn-primary w-25 mt-3"
        >
          Next
        </button>
      </div>

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
            setDescription={
              (newDescription) =>
                setDescriptions((prev) => [...prev, newDescription]) // Append to array
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Multiple tables to display all descriptions */}
      <div className="tableContainer mt-4">
        {/* Displaying all descriptions inside a single table */}
        {descriptions.length > 0 && (
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

        <div className="mt-5">
          <div className="notes">
            <h4>A) Technical notes:</h4>
            <textarea
              className="w-100 p-2"
              name="technicalNotes"
              id="technicalNotes"
              style={{ height: "210px" }}
            >
              # SSV standard painting shall be as follows: a) For Forged valves
              – Parkarised / phosphate surface. b) For Cast Valves –
              Anti-corrosion Co-polymer paint in light grey /HR-Aluminum with a
              DFT of 25 microns (approximate). c) For any special painting,
              charges shall be extra based on the painting/surface finish
              preparation. Painting specification may be submitted to us to
              quote for the same. # We reserve the right to change the "Material
              form" of body/trims/other BOM quoted to other "Equivalent or
              Better Materials" in the event of an order , if required. # This
              bid is limited to materials, procedures and documentation
              described in the quotation itself. We reserve the right to change
              our quote should there be any additional requirements over and
              above the quoted. # We have quoted based on the information
              provided in the enquiry and its attachments. We reserve the right
              to revise our quote if any other specs which are not attached but
              asked to comply at later stage. # Process Conditions & Parameters
              mentioned in this offer are for reference only. Resposibility of
              selection of materials based on these process conditions and
              parameters shall be with EPC/Client only.
            </textarea>
          </div>
          <div className="terms mt-5">
            <h4>B) Commercial Terms: </h4>
            <div className="card p-3 shadow">
              <form>
                <div className="mb-3 d-flex">
                  <label for="pricebasis" className="form-label fs-5 me-2 w-25">
                    Price Basis:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="pricebasis"
                    value="Ex-works, Rabale-Navi Mumbai"
                  />
                </div>
                <div className="mb-3 d-flex">
                  <label for="gstno" className="form-label fs-5 me-2 w-25">
                    GST NO.:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="gstno"
                    value="(SANAND) - 24AAACS7348N1ZY"
                  />
                </div>
                <div className="mb-3 d-flex">
                  <label for="packing" className="form-label fs-5 me-2 w-25">
                    Packing:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="packing"
                    value="Road worthy"
                  />
                </div>
                <div className="mb-3 d-flex">
                  <label for="forwarding" className="form-label fs-5 me-2 w-25">
                    Packing & forwarding:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="packing&forwarding"
                    value="3% Extra for inland transport"
                  />
                </div>
                <div className="mb-3 d-flex">
                  <label
                    for="freightcharges"
                    className="form-label fs-5 me-2 w-25"
                  >
                    Freight charges:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="freightcharges"
                    value="at actual, to your account."
                  />
                </div>
                <div className="mb-3 d-flex">
                  <label
                    for="cddschedule"
                    className="form-label fs-5 me-2 w-25"
                  >
                    CDD / Del. Schedule:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="cddschedule"
                    value="16 to 18 weeks ex-mfg unit, after the receipt of approval on GAD / QAP (ITP)"
                  />
                </div>
                <div className="mb-3 d-flex">
                  <label for="payment" className="form-label fs-5 me-2 w-25">
                    Payment:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="payment"
                    value="30% advance and balance against Pro-forma Invoice before dispatch."
                  />
                </div>
              </form>
            </div>
          </div>
          <div className="terms mt-5">
            <h4>C) Technical notes:</h4>
            <textarea
              className="w-100 p-2"
              name="technicalNotes"
              id="technicalNotes"
              style={{ height: "300px" }}
            >
              * Taxes at actual. Presently 18% GST is applicable. HSN code for
              valves is 84818030 & for valve spares is 84819090 * Transit
              Insurance: Shall be at your scope. * Warranty: 12 months from the
              date of installation or 18 months from the date of dispatch,
              whichever earlier against manufacturing defects only shall be
              applicable. The warranty does not cover damage arising from
              inappropriate storage or handling or transport; incorrect
              installation or operation; inappropriate use; wrong operating
              media, chemical or electrical influence and natural wear,
              particularly of parts subject to wear. Our liability is limited
              only to damages of the supplied product. * Warranty for Deemed
              Exports: Our service backup is available only in India. For any
              service backup or Warranty or visits outside India, we shall
              charge to & fro Airfare, Visa Charges and Local lodging expenses
              extra. * Inspection: Third party inspection charges, if any shall
              will be to your account. * Cancellation /Modification of order: If
              order is cancelled or modified (qty reduced) during the
              contractual period, we reserve the option to charge cancellation
              fees as follows: a) After approval of GAD / manufacturing
              clearance within one week: 10% b) Within four weeks from
              manufacturing clearance – 15% c) After four weeks to contractual
              Delivery Date - 50% d) No cancellation is acceptable for SS Valves
              / Special valves after 4 weeks. FORMAT F-P-07-03 * Validity: 30
              days fro the date of commercial offer. ISSUE DATE 01.04.2017 *
              GIVEN PRICES ARE FOR TOTAL UNDIVIDED ORDER, IN CASE OF CHANGES IN
              QUANTITIES, WE RESERVE THE RIGHT TO REVISE PRICES ACCORDINGLY. REV
              02 Please revert if you have any queries on the above.
            </textarea>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-center m-3">
          <button className="btn btn-success p-2 mt-4" onClick={gotoReview}>
            Submit to Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuotation;
