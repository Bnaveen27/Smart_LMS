const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

router.get('/', roleController.getAllRoles);
router.get('/permissions', roleController.getAllPermissions);
router.post('/permissions/update', roleController.updateRolePermissions);
router.put('/permissions', roleController.updateRolePermissions);
router.post('/assign', roleController.assignRole);
router.get('/user/:id', roleController.getUserRoles);
router.post('/seed', roleController.seedRoles);

module.exports = router;
