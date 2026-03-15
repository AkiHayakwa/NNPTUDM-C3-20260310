var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/role');
let userModel = require('../schemas/user');

/* GET all roles */
router.get('/', async function (req, res, next) {
    try {
        let roles = await roleModel.find({ isDeleted: false });
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/* GET a specific role by ID */
router.get('/:id', async function (req, res, next) {
    try {
        let role = await roleModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }
        res.status(200).json(role);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/* GET all users by role ID */
router.get('/:id/users', async function (req, res, next) {
    try {
        // Check if role exists
        const role = await roleModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        // Find users with this role id
        let users = await userModel.find({ role: req.params.id, isDeleted: false }).populate('role');
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/* POST create a new role */
router.post('/', async function (req, res, next) {
    try {
        const newRole = new roleModel(req.body);
        const savedRole = await newRole.save();
        res.status(201).json(savedRole);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/* PUT update an existing role by ID */
router.put('/:id', async function (req, res, next) {
    try {
        const updatedRole = await roleModel.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedRole) {
            return res.status(404).json({ message: "Role not found" });
        }
        res.status(200).json(updatedRole);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/* DELETE (Soft delete) a role by ID */
router.delete('/:id', async function (req, res, next) {
    try {
        const deletedRole = await roleModel.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!deletedRole) {
            return res.status(404).json({ message: "Role not found" });
        }
        res.status(200).json({ message: "Role deleted successfully", role: deletedRole });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
