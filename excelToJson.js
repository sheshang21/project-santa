const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// Function to convert Excel to JSON
function convertExcelToJson(excelFilePath) {
  try {
    // Read the Excel file
    const workbook = xlsx.readFile(excelFilePath);

    // Get the first sheet from the workbook
    const sheetName = workbook.SheetNames[0]; // Get the name of the first sheet
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet to JSON format
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    // Write the JSON data to a file
    const outputFile = path.join(__dirname, 'employees.json');
    fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 2));

    console.log(`Conversion successful! JSON data saved to ${outputFile}`);
  } catch (error) {
    console.error('Error converting Excel to JSON:', error.message);
  }
}

// Specify the path to your Excel file
const excelFilePath = path.join(__dirname, 'employees.xlsx'); // Change to the path of your Excel file

// Run the conversion
convertExcelToJson(excelFilePath);
