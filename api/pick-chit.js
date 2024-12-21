const fs = require('fs');

module.exports = async (req, res) => {
  const employeeId = req.query.id;

  if (!employeeId) {
    return res.status(400).send("Employee ID is required.");
  }

  // Load employee data from the local file
  let employees;
  try {
    employees = JSON.parse(fs.readFileSync('./employees.json')).Sheet1;
  } catch (error) {
    return res.status(500).send("Error loading employee data.");
  }

  // Find the employee by ID
  const employee = employees.find(e => e.IDs.toString() === employeeId);
  if (!employee) {
    return res.status(404).send("Employee not found.");
  }

  // Load chits data
  let chits;
  try {
    chits = JSON.parse(fs.readFileSync('./chits.json'));
  } catch (error) {
    return res.status(500).send("Error loading chits data.");
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
  fs.writeFileSync('./chits.json', JSON.stringify(chits, null, 2));

  res.json({ pickedChit: pickedChit['Employee Name'] }); // Send the name of the picked chit
};
