var express = require('express');
var router = express.Router();
let userModel = require('../schemas/user');

/* GET all users */
router.get('/', async function (req, res, next) {
  try {
    let users = await userModel.find({ isDeleted: false }).populate('role');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* GET a specific user by ID */
router.get('/:id', async function (req, res, next) {
  try {
    let user = await userModel.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* POST create a new user */
router.post('/', async function (req, res, next) {
  try {
    const newUser = new userModel(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* PUT update an existing user by ID */
router.put('/:id', async function (req, res, next) {
  try {
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* DELETE (Soft delete) a user by ID */
router.delete('/:id', async function (req, res, next) {
  try {
    const deletedUser = await userModel.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* POST /enable - Enable user account based on email and username */
router.post('/enable', async function (req, res, next) {
  try {
    const { email, username } = req.body;
    
    if (!email || !username) {
      return res.status(400).json({ message: "Email and username are required." });
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { email: email, username: username, isDeleted: false },
      { status: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User with matching email and username not found." });
    }

    res.status(200).json({ message: "User enabled successfully", user: updatedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* POST /disable - Disable user account based on email and username */
router.post('/disable', async function (req, res, next) {
  try {
    const { email, username } = req.body;
    
    if (!email || !username) {
      return res.status(400).json({ message: "Email and username are required." });
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { email: email, username: username, isDeleted: false },
      { status: false },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User with matching email and username not found." });
    }

    res.status(200).json({ message: "User disabled successfully", user: updatedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
