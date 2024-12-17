document.getElementById('openChitButton').addEventListener('click', function() {
  const employeeId = prompt('Please enter your employee ID:'); // Prompt for ID
  
  if (employeeId) {
    // Send ID to backend and process the result
    fetch(`http://localhost:3000/pick-chit?id=${encodeURIComponent(employeeId)}`)
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text); });
        }
        return response.json();
      })
      .then(data => {
        document.getElementById('chitResult').innerHTML = `You picked: ${data.pickedChit}`;
      })
      .catch(error => {
        document.getElementById('chitResult').innerHTML = `Error: ${error.message}`;
      });
  }
});
