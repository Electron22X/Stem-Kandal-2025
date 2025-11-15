// Contact Form with Formspree (Free - No signup needed!)
const form = document.querySelector('form');

// Change form action to Formspree
form.action = 'https://formspree.io/f/YOUR_FORM_ID';
form.method = 'POST';

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    
    fetch('https://formspree.io/f/xanygled', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            alert('✅ Message sent successfully to chhitvirakyut@gmail.com!');
            form.reset();
        } else {
            alert('❌ Error sending message. Please try again.');
        }
    })
    .catch(error => {
        alert('❌ Error: ' + error.message);
    });
});