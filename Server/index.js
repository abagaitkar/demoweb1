const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db/connection");
const moment = require("moment/moment");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5174",
  credentials: true, // Allow cookies & authentication headers
  methods: "GET,POST,PUT,DELETE,OPTIONS", // Allowed HTTP methods
  allowedHeaders:
    "Origin, X-Requested-With, Content-Type, Accept, Authorization", // Allowed headers
};

app.use(cors(corsOptions)); // Apply CORS
app.options("*", cors(corsOptions)); // Handle preflight requests
app.use(bodyParser.json());

// Middleware to parse JSON
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Node.js and SQLite3 setup is running!");
});

// Route to Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  if (username === "shilpa.p" && password === "kalpan@123") {
    res.json({ success: true, message: "Login successful" });
  } else {
    res.json({ success: false, message: "Invalid username or password" });
  }
});

// Route to fetch Component Config
app.get("/api/componentConfig", (req, res) => {
  const query = "SELECT * FROM ComponentConfig";
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching product codes:", err.message);
      return res.status(500).send("Error fetching product codes");
    }
    res.json(rows);
  });
});

// Route to fetch Component Values
app.get("/api/componentValues", (req, res) => {
  const query = "SELECT * FROM ComponentValues";
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching product codes:", err.message);
      return res.status(500).send("Error fetching product codes");
    }
    res.json(rows);
  });
});

// Route to fetch Quotation Master all Data
app.get("/api/quotation_master", (req, res) => {
  const query = "SELECT * FROM quotation_master";
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching product codes:", err.message);
      return res.status(500).send("Error fetching product codes");
    }
    res.json(rows);
  });
});

// API to fetch the Quotation Details
app.get("/api/quotation_details", (req, res) => {
  const query = "SELECT * FROM quotation_details"; // Replace with your table name
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching product codes:", err.message);
      return res.status(500).send("Error fetching product codes");
    }
    res.json(rows);
  });
});

// API for filter the Data
app.post("/api/filterData", (req, res) => {
  // Log the request body to see what filters are being sent
  console.log("Received filters:", req.body);

  const filters = {
    QuotationRef: req.body.QuotationRef || "",
    CustomerName: req.body.CustomerName || "",
    ProjectName: req.body.ProjectName || "",
    SalesEngineerName: req.body.SalesEngineerName || "",
    StartDate: req.body.StartDate || "",
    EndDate: req.body.EndDate || "",
  };

  // Start with the base query
  let query = `SELECT * FROM quotation_master WHERE 1=1`;
  const queryParams = [];

  // Apply filters to the query
  if (filters.QuotationRef) {
    query += ` AND QuotationRef LIKE ?`;
    queryParams.push(`%${filters.QuotationRef}%`);
  }
  if (filters.CustomerName) {
    query += ` AND CustomerName LIKE ?`;
    queryParams.push(`%${filters.CustomerName}%`);
  }
  if (filters.ProjectName) {
    query += ` AND ProjectName LIKE ?`;
    queryParams.push(`%${filters.ProjectName}%`);
  }
  if (filters.SalesEngineerName) {
    query += ` AND SalesEngineer LIKE ?`;
    queryParams.push(`%${filters.SalesEngineerName}%`);
  }
  if (filters.StartDate) {
    query += ` AND CreatedDate >= ?`;
    queryParams.push(filters.StartDate);
  }
  if (filters.EndDate) {
    query += ` AND CreatedDate <= ?`;
    queryParams.push(filters.EndDate);
  }

  // Log the final query and parameters to check if they're correct
  console.log("Final query:", query);
  console.log("Query parameters:", queryParams);

  // Execute the query with the parameters
  db.all(query, queryParams, (err, rows) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ message: "Error applying filters", error: err });
    } else {
      // Return the filtered data
      res.status(200).json({ message: "Filtered data retrieved", data: rows });
    }
  });
});

// Route to get monthly quotations
app.get("/api/monthly-quotations", (req, res) => {
  getMonthlyQuotations()
    .then((data) => res.json(data))
    .catch((err) =>
      res
        .status(500)
        .json({ error: "Error fetching monthly quotations", details: err })
    );
});

const getMonthlyQuotations = () => {
  return new Promise((resolve, reject) => {
    const query = `
            SELECT strftime('%Y-%m', CreatedDate) AS month, COUNT(QuotationId) AS count
            FROM quotation_master
            GROUP BY month
            ORDER BY month
        `;

    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("Error executing query:", err);
        return reject(err);
      }

      const result = rows.map((row) => ({
        month: row.month,
        count: row.count,
      }));

      resolve(result);
    });
  });
};

//This Route is for Quotations by Sales Engineer
app.get("/api/quotations-by-sales-engineer", (req, res) => {
  const query = `
        SELECT SalesEngineerName, COUNT(QuotationId) AS count
        FROM quotation_master
        GROUP BY SalesEngineerName
    `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching quotations by sales engineer:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Format the result
    const result = rows.map((row) => ({
      sales_engineer: row.SalesEngineerName,
      count: row.count,
    }));

    res.json(result); // Send the response
  });
});

// Route to get monthly revenue trends
app.get("/api/monthly-revenue-trends", (req, res) => {
  const query = `
        SELECT strftime('%Y-%m', quotation_master.CreatedDate) AS month,
               SUM(quotation_details.TotalPrice) AS revenue
        FROM quotation_master
        JOIN quotation_details ON quotation_master.QuotationId = quotation_details.QuotationId
        GROUP BY month
        ORDER BY month;
    `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Database error" });
    }

    const revenueTrends = rows.map((row) => ({
      month: row.month,
      revenue: row.revenue,
    }));

    res.json(revenueTrends);
  });
});

// API Route to Get Component Usage Breakdown
app.get("/api/component-usage-breakdown", (req, res) => {
  const query = `
        SELECT ComponentConfig.ComponentName AS component,
               COUNT(ComponentValues.ComponentID) AS count
        FROM ComponentConfig
        JOIN ComponentValues ON ComponentConfig.ComponentID = ComponentValues.ComponentID
        GROUP BY ComponentConfig.ComponentName;
    `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    const breakdown = rows.map((row) => ({
      component: row.component,
      count: row.count,
    }));

    res.json(breakdown);
  });
});

// API to fetch recent quotations
app.get("/api/recent-quotations", (req, res) => {
  const query = `
        SELECT * FROM quotation_master
        ORDER BY CreatedDate DESC
        LIMIT 10
    `;

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// API to fetch All Quotation data
app.get("/api/quotations", (req, res) => {
  const {
    QuotationRef,
    CustomerName,
    ProjectName,
    SalesEngineer,
    StartDate,
    EndDate,
  } = req.query;

  // Start with the base query
  let query = "SELECT * FROM quotation_master WHERE 1=1";

  // Apply filters dynamically
  if (QuotationRef) query += ` AND QuotationRef LIKE '%${QuotationRef}%'`;
  if (CustomerName) query += ` AND CustomerName LIKE '%${CustomerName}%'`;
  if (ProjectName) query += ` AND ProjectName LIKE '%${ProjectName}%'`;
  if (SalesEngineer)
    query += ` AND SalesEngineerName LIKE '%${SalesEngineer}%'`;
  if (StartDate) query += ` AND CreatedDate >= '${StartDate}'`;
  if (EndDate) query += ` AND CreatedDate <= '${EndDate}'`;

  // Execute the query
  db.all(query, (err, rows) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Failed to fetch quotations" });
    }

    // Send the result back as JSON
    res.json({ quotations: rows });
  });
});

app.post("/api/view_quotation", (req, res) => {
  // Default filters
  const filters = {
    QuotationRef: req.body.QuotationRef || "",
    CustomerName: req.body.CustomerName || "",
    ProjectName: req.body.ProjectName || "",
    SalesEngineer: req.body.SalesEngineer || "",
    StartDate: req.body.StartDate || "",
    EndDate: req.body.EndDate || "",
  };

  // Base query
  let query = "SELECT * FROM quotation_master WHERE 1=1"; // Default query to fetch all records

  // Array to hold filter parameters for binding
  const params = [];

  // Apply filters
  if (filters.QuotationRef) {
    query += " AND QuotationRef LIKE ?";
    params.push(`%${filters.QuotationRef}%`);
  }
  if (filters.CustomerName) {
    query += " AND CustomerName LIKE ?";
    params.push(`%${filters.CustomerName}%`);
  }
  if (filters.ProjectName) {
    query += " AND ProjectName LIKE ?";
    params.push(`%${filters.ProjectName}%`);
  }
  if (filters.SalesEngineer) {
    query += " AND SalesEngineerName LIKE ?";
    params.push(`%${filters.SalesEngineer}%`);
  }
  if (filters.StartDate) {
    query += " AND CreatedDate >= ?";
    params.push(filters.StartDate);
  }
  if (filters.EndDate) {
    query += " AND CreatedDate <= ?";
    params.push(filters.EndDate);
  }

  // Execute the query with parameters
  db.all(query, params, (err, rows) => {
    if (err) {
      // return res.status(500).send('Database error');
      console.log(err);
    }

    // Render the response with the filtered data
    res.json({
      view_quotation: {
        filters: filters,
        selected_quotations: rows, // Send the filtered data
      },
    });
  });
});

// Generate Code
const generateQuotationRef = (quotationId) => {
  const currentYear = new Date().getFullYear();
  const formattedId = String(quotationId).padStart(5, "0"); // Format ID to 5 digits
  return `SAL-QTN-${currentYear}-${formattedId}`;
};

// For Create a Quotation
app.post("/api/create_quotation", (req, res) => {
  const { CustomerName, ProjectName, ProjectLocation, salesEngineerName } =
    req.body;
  console.log(req.body);

  // Insert the quotation data into the database
  const query = `INSERT INTO quotation_master (CustomerName, ProjectName, ProjectLocation, SalesEngineerName)
                   VALUES (?, ?, ?, ?)`;

  db.run(
    query,
    [CustomerName, ProjectName, ProjectLocation, salesEngineerName],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const quotationId = this.lastID; // Get the last inserted ID
      const quotationRef = generateQuotationRef(quotationId);
      // console.log("Ths is Quotation id", quotationId);

      // Update the QuotationRef for the newly created quotation
      db.run(
        `UPDATE quotation_master SET QuotationRef = ? WHERE QuotationId = ?`,
        [quotationRef, quotationId],
        (err) => {
          if (err) {
            // return res.status(500).json({ error: err.message });
            console.log(err);
          }
          // Send response with the quotation reference and other relevant data
          res.status(201).json({
            message: "Quotation created successfully!",
            quotationRef: quotationRef,
            quotationId: quotationId, // Optional, if you want to return the id as well
            CustomerName: CustomerName,
            ProjectName: ProjectName,
            ProjectLocation: ProjectLocation,
            salesEngineerName: salesEngineerName,
          });
        }
      );
    }
  );
});

// This code is not working properly

app.post("/api/generate_code/:quotationId", async (req, res) => {
  const { quotationId } = req.params;
  const selections = req.body;
  const quantity = parseInt(selections.quantity) || 1;
  // console.log("This is Selections in nodejs api", selections);

  try {
    // Fetch all component values from the database
    const getComponentValues = async () => {
      return new Promise((resolve, reject) => {
        db.all("SELECT * FROM ComponentValues", [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    };

    const componentValues = await getComponentValues();
    // console.log(componentValues);
    if (!componentValues.length) {
      return res.status(404).json({ error: "No component values found" });
    }

    // Fetch quotation details
    const getQuotationDetails = async (quotationId) => {
      return new Promise((resolve, reject) => {
        db.get(
          "SELECT * FROM quotation_master WHERE QuotationId = ?",
          [quotationId],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });
    };

    const quotation = await getQuotationDetails(quotationId);
    // console.log("This is Quotation", quotation);
    if (!quotation) {
      return res.status(404).json({ error: "Quotation not found" });
    }

    let codes = [];
    let selectedPairs = [];

    // Process selected values
    for (const [key, valueId] of Object.entries(selections)) {
      if (key === "quantity") continue;
      // console.log("this is ValueId", valueId);

      const value = componentValues.find((val) => val.ValueID == valueId);
      // console.log("This is Value", value);
      if (!value) {
        return res.status(400).json({ error: `Invalid selection for ${key}` });
      }

      codes.push(value.ValueCode);
      // console.log("Value Code", value);
      selectedPairs.push([parseInt(key), parseInt(value.ValueID)]);
      // console.log("This", selectedPairs.push([parseInt(key), parseInt(value.ValueID)]));
      // console.log("This", parseInt(key), parseInt(value.ValueID));
    }

    const finalCode = codes.join("");
    // console.log(selectedPairs);

    // const getCombinationIds = async () => {
    //     try {
    //         if (selectedPairs.length === 0) {
    //             console.error("Error: No selectedPairs available!");
    //             return [];
    //         }

    //         // Generate placeholders dynamically
    //         const placeholders = selectedPairs.map(() => "?").join(", ");
    //         if (!placeholders) {
    //             console.error("Error: Invalid placeholders for SQL query.");
    //             return [];
    //         }

    //         // Extract component IDs and value IDs
    //         const componentIds = selectedPairs.map(p => p[0]);
    //         const valueIds = selectedPairs.map(p => p[1]);
    //         const params = [...componentIds, ...valueIds];

    //         // Debugging logs
    //         // console.log("🔹 Component IDs:", componentIds);
    //         // console.log("🔹 Value IDs:", valueIds);
    //         // console.log("🔹 Query Parameters:", params);

    //         // Ensure the placeholders and params count match
    //         const totalPlaceholders = placeholders.split(",").length * 2;
    //         if (params.length !== totalPlaceholders) {
    //             console.error("🚨 Parameter count mismatch! Expected:", totalPlaceholders, "Got:", params.length);
    //             return [];
    //         }

    //         // SQL Query (Avoiding potential syntax issues)
    //         const query = `
    //             SELECT CombinationID
    //             FROM PricingCombinationDetails
    //             WHERE ComponentID IN (${placeholders})
    //             AND ValueID IN (${placeholders})
    //         `;

    //         // console.log("🚀 Executing Query:", query);

    //         // Execute query and return results
    //         return await new Promise((resolve, reject) => {
    //             db.all(query, params, (err, rows) => {
    //                 if (err) {
    //                     console.error("❌ SQL Execution Error:", err);
    //                     return reject(err);
    //                 }
    //                 console.log("✅ Query Results:", rows);
    //                 resolve(rows);
    //             });
    //         });

    //     } catch (error) {
    //         console.error("🔥 Error fetching CombinationIDs:", error);
    //         throw error;
    //     }
    // };

    // const combinationIds = await getCombinationIds();
    // // console.log("This is combination Ids", combinationIds);
    // if (!combinationIds.length) {
    //     return res.status(404).json({ error: "No matching pricing combination found" });
    // }

    let price = null;

    // // Find correct pricing
    // for (const { CombinationID } of combinationIds) {
    //     const totalPairs = await new Promise((resolve, reject) => {
    //         db.get(`SELECT COUNT(*) as count FROM PricingCombinationDetails WHERE CombinationID = ?`, [CombinationID], (err, row) => {
    //             if (err) reject(err);
    //             else resolve(row);
    //         });
    //     });

    //     const matches = await new Promise((resolve, reject) => {
    //         db.get(
    //             `SELECT COUNT(*) as count
    //              FROM PricingCombinationDetails
    //              WHERE CombinationID = ?
    //              AND ComponentID IN (${selectedPairs.map(() => "?").join(",")})
    //              AND ValueID IN (${selectedPairs.map(() => "?").join(",")})`,
    //             [CombinationID, ...selectedPairs.map(p => p[0]), ...selectedPairs.map(p => p[1])],
    //             (err, row) => {
    //                 if (err) reject(err);
    //                 else resolve(row);
    //             }
    //         );
    //     });

    //     if (matches.count === totalPairs.count) {
    //         const priceEntry = await new Promise((resolve, reject) => {
    //             db.get(`SELECT Price FROM PricingDetails WHERE CombinationID = ?`, [CombinationID], (err, row) => {
    //                 if (err) reject(err);
    //                 else resolve(row);
    //             });
    //         });

    //         if (priceEntry) {
    //             price = priceEntry.Price;
    //             break;
    //         }
    //     }
    // }

    if (!price) price = 1000;
    const totalPrice = price * quantity;

    let randLetter =
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
      String.fromCharCode(65 + Math.floor(Math.random() * 26));

    // Insert into QuotationDetails
    const insertQuotationDetails = async () => {
      return new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO quotation_details (QuotationId, FGCode, Quantity, UnitPrice, TotalPrice, QuotationRef) 
                     VALUES (?, ?, ?, ?, ?, ?)`,
          [
            quotationId,
            finalCode + randLetter,
            quantity,
            price,
            totalPrice,
            quotation.QuotationRef,
          ],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    };

    await insertQuotationDetails();

    res.json({
      message: "Code generated successfully",
      FGCode: finalCode + randLetter,
      UnitPrice: price,
      TotalPrice: totalPrice,
    });
    console.log("Code generated successfully", finalCode, price, totalPrice);
  } catch (error) {
    console.error("Error generating code:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// This is the Put Request for Update the Quotation

app.put("/api/quotations/:quotationRef", (req, res) => {
  const { quotationRef } = req.params;
  const { CustomerName, ProjectName, ProjectLocation, SalesEngineerName } =
    req.body;

  // Update quotation in the database
  const sql = `
        UPDATE quotation_master
        SET CustomerName = ?, ProjectName = ?, ProjectLocation = ?, SalesEngineerName = ?
        WHERE QuotationRef = ?
    `;
  const params = [
    CustomerName,
    ProjectName,
    ProjectLocation,
    SalesEngineerName,
    quotationRef,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ message: "Error updating the quotation", error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    res.status(200).json({ message: "Quotation updated successfully" });
  });
});

// Delete Quotation API Route

app.delete("/api/quotation/:id", (req, res) => {
  const { id } = req.params;

  // Delete from quotation_details first (to maintain foreign key integrity)
  db.run(
    "DELETE FROM quotation_master WHERE QuotationRef = ?",
    [id],
    function (err) {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to delete quotation details" });
      }

      // Then delete from quotation_master
      db.run(
        "DELETE FROM quotation_master WHERE QuotationRef = ?",
        [id],
        function (err) {
          if (err) {
            return res
              .status(500)
              .json({ error: "Failed to delete quotation" });
          }

          if (this.changes === 0) {
            return res.status(404).json({ error: "Quotation not found" });
          }

          res.json({ message: "Quotation deleted successfully!" });
        }
      );
    }
  );
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
