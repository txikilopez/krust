// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxj0Ob2lyPOXU-J3gPyNSupm54PO2rx4M",
  authDomain: "krust-confirmation-db.firebaseapp.com",
  databaseURL: "https://krust-confirmation-db.firebaseio.com",
  projectId: "krust-confirmation-db-c8eaa",
  storageBucket: "krust-confirmation-db.appspot.com",
  messagingSenderId: "668897923400",
  appId: "1:668897923400:web:6e859677454b11a7f5e37d",
  measurementId: "G-RG8009HYN0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

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

// Load saved data from Firebase
function loadData() {
  database.ref('playerAvailability').once('value', snapshot => {
    const savedData = snapshot.val() || {};

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
  });
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
  if (listItem.parentNode) {
    listItem.parentNode.removeChild(listItem);
  }

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

  saveData(name, option);

  yesCount.textContent = yesCounter;
  maybeCount.textContent = maybeCounter;
}

// Save data to Firebase
function saveData(name, status) {
  const updates = {};
  updates[`/playerAvailability/${name}`] = status;
  database.ref().update(updates);
}

// Handle form submission for adding extra players
document.getElementById('add-player-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const newPlayer = document.getElementById('new-player').value;
  const listItem = createPlayerListItem(newPlayer, 'Not Yet Replied');
  notRepliedList.appendChild(listItem);

  saveData(newPlayer, 'Not Yet Replied');
});

// Load the data when the page loads
window.onload = loadData;
