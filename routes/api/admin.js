const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

//Load User Model
const User = require('../../models/User');

// Registration Route
// router.post('/register', (req, res) => {
//   User.findOne({ email: req.body.email }).then(user => {
//     if (user) {
//       return res.status(400).json({ message: 'User Already Exist' });
//     } else {
//       const newUser = new User({
//         name: req.body.name,
//         email: req.body.email,
//         password: req.body.password
//       });

//       bcrypt.genSalt(10, (err, salt) => {
//         bcrypt.hash(newUser.password, salt, (err, hash) => {
//           if (err) throw err;
//           newUser.password = hash;
//           newUser
//             .save()
//             .then(user => {
//               res.json(user);
//             })
//             .catch(err => console.log(err));
//         });
//       });
//     }
//   });
// });

// Login Route
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ messsage: 'User Not Found' });
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = { id: user.id, name: user.name };

        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 28800 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        return res.status(400).json({ messsage: 'Password Incorrect' });
      }
    });
  });
});

module.exports = router;
