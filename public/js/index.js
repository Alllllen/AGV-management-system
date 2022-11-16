/* eslint-disable */
import '@babel/polyfill';

import { login, logout, regist } from './control/auth';
import { section, createTask, getTask } from './control/task';

// Auth
const registForm = document.querySelector('.registerForm');
const loginForm = document.querySelector('.loginForm');
const logOutBtn = document.querySelector('.logout');

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
    const name = document.getElementById('userName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    regist(name, email, password);
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
if (typeOfTasks)
  Array.prototype.forEach.call(typeOfTasks, (element) => {
    element.addEventListener('click', async () => {
      const btn = document.querySelector('.typeOfTaskBtn');
      btn.innerHTML = element.innerHTML;
    });
  });

// when click submit button
if (taskBtn)
  taskBtn.addEventListener('click', async () => {
    const startSection = document.querySelector('.startSectionBtn').id;
    const endSection = document.querySelector('.endSectionBtn').id;
    const typeOfTask = document.querySelector('.typeOfTaskBtn').innerHTML;

    createTask(startSection, endSection);
  });

//task hirtory
const taskRange = document.querySelector('.taskRangeSelect');
const taskFilter = document.querySelector('.taskFilterSelect');
const taskFilterWord = document.querySelector('.taskFilterWord');
const taskSearchBtn = document.querySelector('.taskSearchBtn');

if (taskSearchBtn)
  taskSearchBtn.addEventListener('click', async () => {
    const rangeBy = taskRange.options[taskRange.selectedIndex].innerHTML;
    const FilterBy = taskFilter.options[taskFilter.selectedIndex].innerHTML;
    getTask(rangeBy, FilterBy, taskFilterWord, 0);
  });
