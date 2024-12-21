document.getElementById('openChitButton').addEventListener('click', function() {
  const employeeId = prompt('Please enter your employee ID:'); // Prompt for ID
  
  if (employeeId) {
    // Update the URL to your Vercel backend API
    fetch(`https://project-santa-nq1bq1a1o-sheshangs-projects.vercel.app/api/pick-chit?id=${encodeURIComponent(employeeId)}`)
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

