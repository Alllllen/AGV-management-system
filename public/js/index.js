/* eslint-disable */
import '@babel/polyfill';
import { login, logout, regist } from './auth';

// DOM ELEMENTS
const registForm = document.querySelector('.registerForm');
const loginForm = document.querySelector('.loginForm');
const logOutBtn = document.querySelector('.logout');

// Auth
if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (registForm)
  registForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    regist(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

//socket.io
