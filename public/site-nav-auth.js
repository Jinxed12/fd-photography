import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';

const greeting = document.querySelector('[data-nav-greeting]');
const accountToggle = document.querySelector('[data-account-toggle]');
const accountMenu = document.querySelector('[data-account-menu]');
const logoutButton = document.querySelector('[data-nav-logout]');
const status = document.querySelector('[data-nav-error]');
const nav = document.querySelector('.site-nav, #navbar');
const menuButton = document.querySelector('.burger');

function showError(message) {
  status.textContent = message;
  status.hidden = false;
}

function setAccountMenuOpen(isOpen) {
  accountMenu.hidden = !isOpen;
  accountToggle.setAttribute('aria-expanded', String(isOpen));
}

accountToggle.addEventListener('click', () => {
  setAccountMenuOpen(accountMenu.hidden);
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.nav-account')) setAccountMenuOpen(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !accountMenu.hidden) {
    setAccountMenuOpen(false);
    accountToggle.focus();
  }
});

let auth;
try {
  const configResponse = await fetch('/__/firebase/init.json');
  if (!configResponse.ok) throw new Error(`Firebase config request failed: ${configResponse.status}`);
  auth = getAuth(initializeApp(await configResponse.json()));
  onAuthStateChanged(auth, (user) => {
    greeting.textContent = `Hi, ${user?.displayName || user?.email || 'Guest Visitor (guest)'}`;
  }, (error) => {
    console.error('Unable to read Firebase authentication state:', error);
    showError('Account status unavailable.');
  });
} catch (error) {
  console.error('Unable to initialize Firebase navigation:', error);
  logoutButton.disabled = true;
  showError('Account services unavailable.');
}

logoutButton.addEventListener('click', async () => {
  if (!auth) return;

  logoutButton.disabled = true;
  status.hidden = true;
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Unable to log out:', error);
    showError('Unable to log out. Please try again.');
  } finally {
    logoutButton.disabled = false;
    setAccountMenuOpen(false);
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
});
