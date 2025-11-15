import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getDatabase, ref, onValue, set } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyD7b3lOtRYPZzsKONm5uU9dAMAyBhUeYXI",
  authDomain: "stem-yut.firebaseapp.com",
  databaseURL: "https://stem-yut-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "stem-yut",
  storageBucket: "stem-yut.firebasestorage.app",
  messagingSenderId: "1060598889654",
  appId: "1:1060598889654:web:c6e21d3c1fe681d463fa17",
  measurementId: "G-6K0TP7GQL4"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function loadPrice() {
  console.log('Loading price...');
  const priceRef = ref(database, 'price');
  
  onValue(priceRef, (snapshot) => {
    const data = snapshot.val();
    console.log('Data from Firebase:', data);
    
    if (data && data.price && data.discount !== undefined) {
      document.getElementById('priceText').textContent = '$' + parseFloat(data.price).toFixed(2);
      document.getElementById('discount').textContent = data.discount + '%';
      const newPrice = data.price * (1 - data.discount / 100);
      document.getElementById('newPrice').textContent = '$' + newPrice.toFixed(2);
      console.log('✓ Price updated!');
    } else {
      console.log('No valid data found');
    }
  }, (error) => {
    console.error('Error:', error);
  });
}

async function updatePrice(newPrice, newDiscount) {
  try {
    await set(ref(database, 'price'), {
      price: parseFloat(newPrice),
      discount: parseInt(newDiscount)
    });
    console.log('✓ Price updated in Firebase!');
    alert('Price updated!');
  } catch (error) {
    console.error('Error:', error);
  }
}

window.updatePrice = updatePrice;

// Load price when page is ready
setTimeout(() => {
  loadPrice();
}, 1000);