'use strict';
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const { faker } = require('@faker-js/faker');

exports.setUser = () => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      const role = ['viewer', 'editor'];
      const userData = Array.from({ length: 100 }).map((d, i) => ({
        name: faker.internet.userName(),
        email: faker.internet.email(),
        role: role[i % role.length],
        password: faker.internet.password(),
      }));
      await User.insertMany(userData);
      console.log('set user data');
      resolve();
    })
  );
};

exports.clearUser = () => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      await User.deleteMany({});
      console.log('clear user data');
      resolve();
    })
  );
};
