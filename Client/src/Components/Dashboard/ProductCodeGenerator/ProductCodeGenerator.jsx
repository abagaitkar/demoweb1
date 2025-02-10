import React, { useEffect, useState } from "react";

const ProductCodeGenerator = ({
  quotationRef,
  selectedValues,
  setSelectedValues,
  quantity,
  setQuantity,
  setDescription, // this function should append to an array in the parent
}) => {
  const [componentConfig, setComponentConfig] = useState([]);
  const [componentValues, setComponentValues] = useState([]);
  // Local state to hold the current configuration's descriptions
  const [localDescription, setLocalDescription] = useState({});

  useEffect(() => {
    fetch(`${import.meta.env.VITE_APP_BASE_URL_PRODUCTION}/api/componentConfig`)
      .then((res) => res.json())
      .then((data) => setComponentConfig(data))
      .catch((error) =>
        console.error("Error fetching component config:", error)
      );

    fetch(`${import.meta.env.VITE_APP_BASE_URL_PRODUCTION}/api/componentValues`)
      .then((res) => res.json())
      .then((data) => setComponentValues(data))
      .catch((error) =>
        console.error("Error fetching component values:", error)
      );
  }, []);

  const handleSelectChange = (componentID, value) => {
    // Update the selected values for the parent
    setSelectedValues((prev) => ({ ...prev, [componentID]: value }));

    // Find the component value details
    const selectedComponent = componentValues.find(
      (item) => item.ValueID.toString() === value.toString()
    );

    if (selectedComponent) {
      // Update the local description state for the current configuration
      setLocalDescription((prev) => ({
        ...prev,
        [componentID]: selectedComponent.ValueDescription,
      }));
    } else {
      console.log("Component not found for ValueID:", value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const quotationId = localStorage.getItem("New QuotationRef Id") || "Main";

    const payload = { ...selectedValues, quantity: parseInt(quantity) };

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_APP_BASE_URL_PRODUCTION
        }/api/generate_code/${quotationId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to generate product code");

      const data = await response.json();
      alert(
        `Generated Code: ${data.FGCode}\nUnit Price: ₹${data.UnitPrice}\nTotal Price: ₹${data.TotalPrice}`
      );

      // Append price details to localDescription and update the parent's array
      const updatedDescription = {
        ...localDescription,
        UnitPrice: data.UnitPrice,
        TotalPrice: data.TotalPrice,
      };

      setDescription(updatedDescription);

      // Reset form values
      setSelectedValues({});
      setQuantity(1);
      setLocalDescription({});
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate product code. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Component Name</th>
                  <th className="w-50">Selected Value</th>
                </tr>
              </thead>
              <tbody>
                {componentConfig.map((component) => (
                  <tr key={component.ComponentID}>
                    <td>{component.ComponentName}</td>
                    <td>
                      <select
                        className="form-select"
                        onChange={(e) =>
                          handleSelectChange(
                            component.ComponentID,
                            e.target.value
                          )
                        }
                        value={selectedValues[component.ComponentID] || ""}
                      >
                        <option value="" disabled>
                          Select a value
                        </option>
                        {componentValues
                          .filter(
                            (value) =>
                              value.ComponentID === component.ComponentID
                          )
                          .map((value) => (
                            <option key={value.ValueID} value={value.ValueID}>
                              {value.ValueDescription}
                            </option>
                          ))}
                      </select>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td>Quantity</td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-success btn-lg">
              Create FG Code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCodeGenerator;
