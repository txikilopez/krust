const fixedRoster = [
  'Jose S', 'Antonio T', 'Seth B', 'Nathan F', 'Christian P', 
  'Kerby', 'Issa', 'Georges', 'Joey', 'Gabe', 'JC'
];

const yesList = document.getElementById('yes-list');
const maybeList = document.getElementById('maybe-list');
const noList = document.getElementById('no-list');
const notRepliedList = document.getElementById('not-replied-list');

const yesCount = document.getElementById('yes-count');
const maybeCount = document.getElementById('maybe-count');

let yesCounter = 0;
let maybeCounter = 0;

// Load saved data from Local Storage
function loadData() {
  const savedData = JSON.parse(localStorage.getItem('playerAvailability')) || {};

  fixedRoster.forEach(name => {
    const status = savedData[name] || 'Not Yet Replied';
    const listItem = createPlayerListItem(name, status);
    if (status === 'Yes') {
      yesList.appendChild(listItem);
      yesCounter++;
    } else if (status === 'Maybe') {
      maybeList.appendChild(listItem);
      maybeCounter++;
    } else if (status === 'No') {
      noList.appendChild(listItem);
    } else {
      notRepliedList.appendChild(listItem);
    }
  });

  yesCount.textContent = yesCounter;
  maybeCount.textContent = maybeCounter;
}

// Function to create a list item with availability options
function createPlayerListItem(name, status) {
  const listItem = document.createElement('li');
  listItem.textContent = `${name} - ${status}`;

  const optionsDiv = document.createElement('div');
  optionsDiv.className = 'availability-options';

  ['Yes', 'No', 'Maybe'].forEach(option => {
    const button = document.createElement('button');
    button.textContent = option;
    button.className = 'availability-btn';
    button.addEventListener('click', () => {
      listItem.textContent = `${name} - ${option}`;
      listItem.appendChild(optionsDiv);
      updateList(name, option, listItem);
    });
    optionsDiv.appendChild(button);
  });

  listItem.appendChild(optionsDiv);
  return listItem;
}

// Function to update the list and counters based on availability
function updateList(name, option, listItem) {
  // Remove the item from all lists
  yesList.removeChild(listItem);
  maybeList.removeChild(listItem);
  noList.removeChild(listItem);
  notRepliedList.removeChild(listItem);

  // Add the item to the correct list
  if (option === 'Yes') {
    yesList.appendChild(listItem);
    yesCounter++;
  } else if (option === 'Maybe') {
    maybeList.appendChild(listItem);
    maybeCounter++;
  } else if (option === 'No') {
    noList.appendChild(listItem);
  } else {
    notRepliedList.appendChild(listItem);
  }

  // Save the data and update the counters
  saveData(name, option);
  yesCount.textContent = yesCounter;
  maybeCount.textContent = maybeCounter;
}

// Save data to Local Storage
function saveData(name, status) {
  const savedData = JSON.parse(localStorage.getItem('playerAvailability')) || {};
  savedData[name] = status;
  localStorage.setItem('playerAvailability', JSON.stringify(savedData));
}

// Handle form submission for adding extra players
document.getElementById('add-player-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const newPlayer = document.getElementById('new-player').value;
  const listItem = createPlayerListItem(newPlayer, 'Not Yet Replied');
  notRepliedList.appendChild(listItem);

  saveData(newPlayer, 'Not Yet Replied');
});

// Function to reset all answers and move players back to "Not Yet Replied"
function resetAnswers() {
  localStorage.removeItem('playerAvailability');
  yesList.innerHTML = '';
  maybeList.innerHTML = '';
  noList.innerHTML = '';
  notRepliedList.innerHTML = '';
  yesCounter = 0;
  maybeCounter = 0;
  yesCount.textContent = yesCounter;
  maybeCount.textContent = maybeCounter;
  loadData();
}

// Add reset button
const resetButton = document.createElement('button');
resetButton.textContent = 'Reset All Answers';
resetButton.addEventListener('click', resetAnswers);
document.body.appendChild(resetButton);

// Load the data when the page loads
window.onload = loadData;
