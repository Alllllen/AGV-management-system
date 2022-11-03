/* eslint-disable */
import '@babel/polyfill';
import axios from 'axios';

import { login, logout, regist } from './control/auth';
import { section, createTask } from './control/task';

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

// TaskCreate
const startFloors = document.getElementsByClassName('startFloor');
const endFloors = document.getElementsByClassName('endFloor');
const typeOfTasks = document.getElementsByClassName('typeOfTask');
const taskBtn = document.querySelector('.taskBtn');

//get which floor you want -> get blocks on floor -> get sections in block
section(startFloors, 'start');
section(endFloors, 'end');

//select which type of task is it
Array.prototype.forEach.call(typeOfTasks, (element) => {
  element.addEventListener('click', async () => {
    const btn = document.querySelector('.typeOfTaskBtn');
    btn.innerHTML = element.innerHTML;
  });
});

// when click submit button
taskBtn.addEventListener('click', async () => {
  const startSection = document.querySelector('.startSectionBtn').id;
  const endSection = document.querySelector('.endSectionBtn').id;
  const typeOfTask = document.querySelector('.typeOfTaskBtn').innerHTML;

  createTask(startSection, endSection);
});

//socket.io
