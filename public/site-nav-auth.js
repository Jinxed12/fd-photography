import { getFirebaseApp } from '/site-firebase.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';

const guestLinks = document.querySelectorAll('[data-auth-guest]');
const userAccount = document.querySelector('[data-auth-user]');
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

function setUser(user) {
  guestLinks.forEach((link) => { link.hidden = Boolean(user); });
  userAccount.hidden = !user;
  status.hidden = true;
  if (user) {
    greeting.textContent = `Hi, ${user.displayName || user.email || 'Guest Visitor'}`;
    setAccountMenuOpen(false);
  }
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
  auth = getAuth(await getFirebaseApp());
  onAuthStateChanged(auth, (user) => {
    setUser(user);
  }, (error) => {
    console.error('Unable to read Firebase authentication state:', error);
    showError('Account status unavailable.');
  });
} catch (error) {
  console.error('Unable to initialize Firebase navigation:', error);
  guestLinks.forEach((link) => { link.hidden = false; });
  userAccount.hidden = true;
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
