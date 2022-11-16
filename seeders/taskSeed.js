'use strict';
const Task = require('./../models/taskModel');

const User = require('./../models/userModel');
const Section = require('./../models/foundations/sectionModel');
const catchAsync = require('./../utils/catchAsync');

exports.setTask = () => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      const users = await User.find({});
      const sections = await Section.find({});
      const taskData = Array.from({ length: 50 }).map((d, i) => ({
        user: users[Math.floor(Math.random() * 1000) % users.length],
        sectionStart:
          sections[Math.floor(Math.random() * 1000) % sections.length]['id'],
        sectionEnd:
          sections[Math.floor(Math.random() * 1000) % sections.length]['id'],
        createdAt: Date.now(),
      }));
      await Task.insertMany(taskData);
      console.log('set task data');
      resolve();
    })
  );
};

exports.clearTask = () => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      await Task.deleteMany({});
      console.log('clear Task data');
      resolve();
    })
  );
};
