// Fetch all doctors from the backend API
function fetchDoctors() {
  fetch('/api/doctors')
    .then(response => response.json())
    .then(doctors => {
      renderTable(doctors);
    })
    .catch(error => {
      console.error('Error fetching doctors:', error);
    });
}


// Render version 2
function renderTable(doctors) {
  const tableBody = document.querySelector('#doctorTable');

  tableBody.innerHTML = '';

  const totalSalaryRow = document.createElement('tr');
  totalSalaryRow.totalSalary = 0; // Initialize total salary to 0

  doctors.forEach(doctor => {
    const row = document.createElement('tr');

    const numberCell = createTableCell(doctor.doctorNumber);
    row.appendChild(numberCell);
    numberCell.classList.add('doctor-number');

    const nameCell = createTableCell(doctor.name);
    row.appendChild(nameCell);
    nameCell.classList.add('name')

    const daysCell = createTableCell(doctor.daysWorked);
    row.appendChild(daysCell);
    daysCell.classList.add('days-worked')

    const salaryCell = createTableCell(doctor.salaryPerDay);
    row.appendChild(salaryCell);
    salaryCell.classList.add('salary-per-day')

    const totalSalaryCell = createTableCell(doctor.daysWorked * doctor.salaryPerDay);
    const totalSalary = doctor.daysWorked * doctor.salaryPerDay;
    row.appendChild(totalSalaryCell);
    salaryCell.classList.add('total-salary')

    const actionsCell = createActionsCell(doctor._id);
    row.appendChild(actionsCell);
    actionsCell.classList.add('actions')
    tableBody.appendChild(row);
   
    // Accumulate total salary for each row
    totalSalaryRow.totalSalary += totalSalary || 0;
 
  });

    const containerTable = document.querySelector('.total'); 
    containerTable.innerText = ""

     // Calculate the minimum and maximum total salary
     const totalSalaries = doctors.map(doctor => doctor.daysWorked * doctor.salaryPerDay);
     const minTotalSalary = Math.min(...totalSalaries);
     const maxTotalSalary = Math.max(...totalSalaries);
  
    // Create paragraph elements for total salary information
    const totalSalaryParagraph = document.createElement('p');
    totalSalaryParagraph.innerHTML = `Prestation Totale : <strong>${totalSalaryRow.totalSalary} Ariary</strong>`;

    const minTotalSalaryParagraph = document.createElement('p');
    minTotalSalaryParagraph.innerHTML = `Prestation minimale : <strong>${minTotalSalary} Ariary</strong>`;

    const maxTotalSalaryParagraph = document.createElement('p');
    maxTotalSalaryParagraph.innerHTML = `Prestation maximale : <strong>${maxTotalSalary} Ariary</strong>`;


    // Add cells to total salary row
    containerTable.appendChild(totalSalaryParagraph);
    containerTable.appendChild(minTotalSalaryParagraph);
    containerTable.appendChild(maxTotalSalaryParagraph);

    
}

function createTableCell(text) {
  const cell = document.createElement('td');
  cell.textContent = text;
  return cell;
}

function createActionsCell(doctorId) {
  const actionsCell = document.createElement('td');

  const editButton = createActionButton('Editer', 'edit-btn', doctorId);
  actionsCell.appendChild(editButton);

  const deleteButton = createActionButton('Supprimer', 'delete-btn', doctorId);
  actionsCell.appendChild(deleteButton);

  return actionsCell;
}

function createActionButton(label, className, doctorId) {
  const button = document.createElement('button');
  button.textContent = label;
  button.classList.add(className);
  button.dataset.id = doctorId;
  return button;
}



// Function to handle the edit button click
function handleEditClick(event) {
  const id = event.target.dataset.id;
  const row = event.target.closest('tr');

  // Find the cell elements within the row
  const doctorNumberCell = row.querySelector('.doctor-number');
  const nameCell = row.querySelector('.name');
  const daysWorkedCell = row.querySelector('.days-worked');
  const salaryPerDayCell = row.querySelector('.salary-per-day');
  const totalSalaryCell = row.querySelector('.total-salary');


  // Check if the cell elements exist
  if (doctorNumberCell && nameCell && daysWorkedCell && salaryPerDayCell && totalSalaryCell) {
    // Get the current values from the cells
    const doctorNumber = doctorNumberCell.textContent;
    const name = nameCell.textContent;
    const daysWorked = daysWorkedCell.textContent;
    const salaryPerDay = salaryPerDayCell.textContent;
    const totalSalary = totalSalaryCell.textContent;

    // Replace the cells with input fields for editing
    doctorNumberCell.innerHTML = `<input type="text" class="edit-input" value="${doctorNumber}">`;
    nameCell.innerHTML = `<input type="text" class="edit-input" value="${name}">`;
    daysWorkedCell.innerHTML = `<input type="number" class="edit-input" value="${daysWorked}">`;
    salaryPerDayCell.innerHTML = `<input type="number" class="edit-input" value="${salaryPerDay}">`;
    totalSalaryCell.innerHTML = `<input type="number" class="edit-input" value="${totalSalary}">`;

    // Create an "Update" button
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Modifier';
    updateButton.classList.add('update-btn');

    // Replace the "Edit" button with the "Update" button
    const actionsCell = row.querySelector('.actions');
    actionsCell.textContent = '';
    actionsCell.appendChild(updateButton);

    // Attach an event listener to the "Update" button
    updateButton.addEventListener('click', () => {
      // Get the updated values from the input fields
      const updatedDoctorNumber = doctorNumberCell.querySelector('.edit-input').value;
      const updatedName = nameCell.querySelector('.edit-input').value;
      const updatedDaysWorked = daysWorkedCell.querySelector('.edit-input').value;
      const updatedSalaryPerDay = salaryPerDayCell.querySelector('.edit-input').value;
      const updatedTotalSalary =  totalSalaryCell.querySelector('.edit-input').value;

      // Perform the update action using the updated values
      const updateData = {
        doctorNumber: updatedDoctorNumber,
        name: updatedName,
        daysWorked: parseInt(updatedDaysWorked),
        salaryPerDay: parseInt(updatedSalaryPerDay),
        
      };


      fetch(`/api/doctors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })
        .then(response => response.json())
        .then(updatedDoctor => {
          // Replace the input fields with the updated values
          doctorNumberCell.innerHTML = updatedDoctor.doctorNumber;
          nameCell.innerHTML = updatedDoctor.name;
          daysWorkedCell.innerHTML = updatedDoctor.daysWorked;
          salaryPerDayCell.innerHTML = updatedDoctor.salaryPerDay;
          totalSalaryCell.innerHTML = updatedDoctor.salaryPerDay * updatedDoctor.daysWorked;

          // Restore the "Edit" button
          actionsCell.textContent = '';
          actionsCell.innerHTML = `<button class="edit-btn" data-id="${id}">Edit</button>`;

          // Attach the event listener again to the new "Edit" button
          const editButton = actionsCell.querySelector('.edit-btn');
          editButton.addEventListener('click', handleEditClick);
          fetchDoctors();

          console.log('Row:', row);
          console.log('Actions cell:', actionsCell);
        })
        .catch(error => {
          console.error('Error updating doctor:', error);
        });
    });
  }
}



// Function to handle the form submission
function handleFormSubmit(event) {
  event.preventDefault();

  const numberInput = document.querySelector('#doctorNumber');
  const nameInput = document.querySelector('#doctorName');
  const daysInput = document.querySelector('#daysWorked');
  const salaryInput = document.querySelector('#salaryPerDay');

  const doctorNumber = numberInput.value.trim();
  const salaryPerDay = salaryInput.value.trim();
  const days = daysInput.value.trim();
  

  // Check if the entered values are numbers
  if (isNaN(doctorNumber) || isNaN(salaryPerDay|| isNaN(days))) {
    showAlert('S\'il vous plaît veuillez saisir un nombre pour le numéro, le nombre de jour et le taux journalier.');
    return;
  }

  const newDoctor = {
    doctorNumber: numberInput.value,
    name: nameInput.value,
    daysWorked: parseInt(daysInput.value),
    salaryPerDay: parseInt(salaryInput.value),
  };

  fetch('/api/doctors', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newDoctor),
  })
    .then(response => response.json())
    .then(() => {
      numberInput.value = '';
      nameInput.value = '';
      daysInput.value = '';
      salaryInput.value = '';
      fetchDoctors();
    })
    .catch(error => {
      console.error('Error adding doctor:', error);
    });
}

// Attach event listener to the form
document.querySelector('#addForm').addEventListener('submit', handleFormSubmit);


// Function to handle the delete button click
function handleDeleteClick(event) {
  const id = event.target.dataset.id;

  fetch(`/api/doctors/${id}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(() => {
      fetchDoctors();
    })
    .catch(error => {
      console.error('Error deleting doctor:', error);
    });
}

// Fetch doctors when the page loads
document.addEventListener('DOMContentLoaded', fetchDoctors);

// Attach event listeners to the form and buttons
// document.querySelector('#addForm').addEventListener('submit', handleFormSubmit);
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('edit-btn')) {
    handleEditClick(event);
  } else if (event.target.classList.contains('delete-btn')) {
    handleDeleteClick(event);
  }
});


// Function to display the custom alert
function showAlert(message) {
  const alertDiv = document.createElement('div');
  alertDiv.classList.add('alert');
  alertDiv.innerHTML = `
    <span>${message}</span>
    <span class="close-button">&times;</span>
  `;

  const closeButton = alertDiv.querySelector('.close-button');
  closeButton.addEventListener('click', () => {
    alertDiv.remove();
  });

  document.body.appendChild(alertDiv);

}

