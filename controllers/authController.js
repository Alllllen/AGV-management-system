const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crud = require('./crudAction');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// exports.updateMe = catchAsync(async (req, res, next) => {
//   // 1) Create error if user POSTs password data
//   if (req.body.password || req.body.passwordConfirm) {
//     return next(
//       new AppError(
//         'This route is not for password updates. Please use /updateMyPassword.',
//         400
//       )
//     );
//   }

//   // 2) Filtered out unwanted fields names that are not allowed to be updated
//   const filteredBody = filterObj(req.body, 'name', 'email');
//   if (req.file) filteredBody.photo = req.file.filename;

//   // 3) Update user document
//   const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
//     new: true,
//     runValidators: true,
//   });

//   res.status(200).json({
//     status: 'success',
//     data: {
//       user: updatedUser,
//     },
//   });
// });
// Only for rendered pages, no errors!
// exports.isLoggedIn = async (req, res, next) => {
//   if (req.cookies.jwt) {
//     try {
//       // 1) verify token
//       const decoded = await promisify(jwt.verify)(
//         req.cookies.jwt,
//         process.env.JWT_SECRET
//       );

//       // 2) Check if user still exists
//       const currentUser = await User.findById(decoded.id);
//       if (!currentUser) {
//         return next();
//       }

//       // 3) Check if user changed password after the token was issued
//       // if (currentUser.changedPasswordAfter(decoded.iat)) {
//       //   return next();
//       // }

//       // THERE IS A LOGGED IN USER
//       req.user = currentUser;
//       res.locals.user = currentUser;
//       return next();
//     } catch (err) {
//       return next();
//     }
//   }
//   next();
// };

exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user._id;
  const me = await User.findById(req.params.id);
  res.status(200).json({ status: 'success', data: me });
});
exports.getAllUser = crud.getAll(User);

// exports.getUser = crud.getOne(User);
// exports.updateUser = crud.updateOne(User);

// exports.updatePassword = catchAsync(async (req, res, next) => {
//   // 1) Get user from collection
//   const user = await User.findById(req.user.id).select('+password');
//   console.log(user);
//   // 2) Check if POSTed current password is correct
//   if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
//     return next(new AppError('Your current password is wrong.', 401));
//   }

//   // 3) If so, update password
//   user.password = req.body.password;
//   user.passwordConfirm = req.body.passwordConfirm;
//   await user.save();
//   // User.findByIdAndUpdate will NOT work as intended!

//   // 4) Log user in, send JWT
//   createSendToken(200, user, req, res);
// });

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  //如果沒有token傳回來
  if (!token) {
    return next(new AppError('Not logged in!', 401));
  }
  //token是錯誤的
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('Token belong to the user is not exist', 401));
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  req.body.user = currentUser; //給post task 用 之後其他應該也會用到
  next();
});

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};
const createSendToken = (status, user, req, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  };
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(status).json({ status: 'success', token, user });
};

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });
  createSendToken(200, newUser, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Enter Email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect mail or password', 400));
  }

  createSendToken(200, user, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'logout', {});
  res.status(200).json({ status: 'success', message: 'logout' });
};
