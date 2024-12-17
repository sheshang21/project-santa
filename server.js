const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// File paths for employees and chits data
const employeesFile = './employees.json';
const chitsFile = './chits.json';

// Load employee data from JSON
function loadEmployees() {
  try {
    const data = fs.readFileSync(employeesFile);
    const employees = JSON.parse(data);
    if (employees.Sheet1 && Array.isArray(employees.Sheet1)) {
      return employees.Sheet1;
    } else {
      throw new Error("Employee data is not in the expected format.");
    }
  } catch (error) {
    console.error("Error loading employee data:", error.message);
    return [];
  }
}

// Load chit data from JSON
function loadChits() {
  try {
    const data = fs.readFileSync(chitsFile);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading chits data:", error.message);
    return { picked_chits: [] };
  }
}

// Save updated chits data to JSON
function saveChits(chits) {
  fs.writeFileSync(chitsFile, JSON.stringify(chits, null, 2));
}

// Endpoint to pick a chit
app.get('/pick-chit', (req, res) => {
  const employeeId = req.query.id;

  if (!employeeId) {
    return res.status(400).send("Employee ID is required.");
  }

  const employees = loadEmployees(); // Load employees from JSON
  const chits = loadChits(); // Load chits data

  // Log the loaded employees
  console.log("Loaded employees:", employees);

  // Find the employee by ID
  const employee = employees.find(e => e.IDs.toString() === employeeId); // Match based on the "IDs" field
  if (!employee) {
    return res.status(404).send("Employee not found.");
  }

  // Check if the employee has already picked a chit
  if (chits.picked_chits.includes(employee.IDs)) {
    return res.status(400).send("You have already picked a chit.");
  }

  // Filter out the employee's own chit
  const availableChits = employees.filter(e => e.IDs !== employee.IDs);

  if (availableChits.length === 0) {
    return res.status(400).send("No chits left to pick.");
  }

  // Randomly pick a chit
  const pickedChit = availableChits[Math.floor(Math.random() * availableChits.length)];

  // Mark the employee as having picked a chit
  chits.picked_chits.push(employee.IDs);
  saveChits(chits);

  res.json({ pickedChit: pickedChit['Employee Name'] }); // Send the name of the picked chit
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
