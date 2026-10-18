import { getFirebaseApp } from '/site-firebase.js';
import { addDoc, collection, getFirestore, serverTimestamp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

const forms = document.querySelectorAll('.contact-form');

for (const form of forms) {
  const submitButton = form.querySelector('[type="submit"]');
  const status = form.querySelector('[data-contact-status]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.hidden = false;
    status.textContent = 'Sending your message...';
    status.classList.remove('error');
    submitButton.disabled = true;

    try {
      const data = new FormData(form);
      const name = String(data.get('name')).trim();
      const email = String(data.get('email')).trim().toLowerCase();
      const message = String(data.get('message')).trim();
      const app = await getFirebaseApp();
      await addDoc(collection(getFirestore(app), 'contactMessages'), {
        name,
        email,
        message,
        createdAt: serverTimestamp(),
      });
      window.location.assign('/thank-you.html');
    } catch (error) {
      console.error('Unable to save contact message:', error);
      status.textContent = 'We could not send your message. Please try again later.';
      status.classList.add('error');
      submitButton.disabled = false;
    }
  });
}
