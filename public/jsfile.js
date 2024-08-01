// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxj0Ob2lyPOXU-J3gPyNSupm54PO2rx4M",
  authDomain: "krust-confirmation-db-c8eaa.firebaseapp.com",
  databaseURL: "https://krust-confirmation-db-c8eaa-default-rtdb.firebaseio.com/",
  projectId: "krust-confirmation-db-c8eaa",
  storageBucket: "krust-confirmation-db-c8eaa.appspot.com",
  messagingSenderId: "668897923400",
  appId: "1:668897923400:web:6e859677454b11a7f5e37d",
  measurementId: "G-RG8009HYN0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const fixedRoster = [
  'Jose S', 'Antonio', 'Seth B', 'Nathan F', 'David S', 'Christian P', 
  'Kerby', 'Issa', 'Georges', 'Joey', 'Gabe', 'JC', 'Elijah', 'Ana', 'Seb', 'Lucas', 'Eli'
];

const yesList = document.getElementById('yes-list');
const maybeList = document.getElementById('maybe-list');
const noList = document.getElementById('no-list');
const notRepliedList = document.getElementById('not-replied-list');

const yesCount = document.getElementById('yes-count');
const maybeCount = document.getElementById('maybe-count');
const totalCount = document.getElementById('total-count');

let yesCounter = 0;
let maybeCounter = 0;

// Load saved data from Firebase
function loadData() {
  database.ref('playerAvailability').once('value', (snapshot) => {
    const savedData = snapshot.val() || {};

    // Clear all lists
    yesList.innerHTML = '';
    maybeList.innerHTML = '';
    noList.innerHTML = '';
    notRepliedList.innerHTML = '';
    yesCounter = 0;
    maybeCounter = 0;

    Object.keys(savedData).forEach(name => {
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
    updateTotalCount();
  });
}

// Function to create a list item with availability options
function createPlayerListItem(name, status) {
  const listItem = document.createElement('li');
  listItem.textContent = name;

  const optionsDiv = document.createElement('div');
  optionsDiv.className = 'availability-options';

  ['Yes', 'No', 'Maybe'].forEach(option => {
    const button = document.createElement('button');
    button.textContent = option;
    button.className = 'availability-btn';
    button.addEventListener('click', () => {
      listItem.textContent = name;
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
  listItem.remove();
  if (option === 'Yes') {
    yesList.appendChild(listItem);
    yesCounter++;
  } else if (option === 'Maybe') {
    maybeList.appendChild(listItem);
    maybeCounter++;
  } else if (option === 'No') {
    noList.appendChild(listItem);
  }

  saveData(name, option);

  yesCount.textContent = yesCounter;
  maybeCount.textContent = maybeCounter;
  updateTotalCount();
}

// Function to update the total count
function updateTotalCount() {
  const total = yesCounter + maybeCounter;
  totalCount.textContent = `Coming to play: ${total} (${yesCounter} yes, ${maybeCounter} maybe)`;
}

// Save data to Firebase
function saveData(name, status) {
  const playerAvailabilityRef = database.ref('playerAvailability');
  playerAvailabilityRef.child(name).set(status);
}

// Handle form submission for adding extra players
document.getElementById('add-player-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const newPlayer = document.getElementById('new-player').value;
  const listItem = createPlayerListItem(newPlayer, 'Not Yet Replied');
  notRepliedList.appendChild(listItem);

  saveData(newPlayer, 'Not Yet Replied');
  document.getElementById('new-player').value = ''; // Clear the input field
});

// Handle reset button click
document.getElementById('reset-answers').addEventListener('click', function() {
  // Clear all lists
  yesList.innerHTML = '';
  maybeList.innerHTML = '';
  noList.innerHTML = '';
  notRepliedList.innerHTML = '';

  // Reset counters
  yesCounter = 0;
  maybeCounter = 0;

  yesCount.textContent = yesCounter;
  maybeCount.textContent = maybeCounter;
  updateTotalCount();

  // Update Firebase: reset all statuses to 'Not Yet Replied'
  const playerAvailabilityRef = database.ref('playerAvailability');
  playerAvailabilityRef.once('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const playerName = childSnapshot.key;
      if (!fixedRoster.includes(playerName)) {
        playerAvailabilityRef.child(playerName).remove(); // Remove extra players
      } else {
        playerAvailabilityRef.child(playerName).set('Not Yet Replied'); // Reset status
      }
    });

    // Reload the data to reflect changes
    loadData();
  });
});

// Load the data when the page loads
window.onload = loadData;
