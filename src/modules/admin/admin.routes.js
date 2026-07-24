'use strict';

const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const rolesController = require('../roles/roles.controller');
const { authenticate } = require('../../middleware/authenticate');
const { requireRole } = require('../../middleware/requireRole');

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireRole('admin'));

// Reports
router.get('/reports', adminController.getReports);

// Dashboard stats (optional convenience endpoint)
router.get('/dashboard', adminController.getDashboardStats);

// Permissions
router.get('/permissions', adminController.getPermissions);

// Roles
router.get('/roles', adminController.getRoles);
router.post('/roles', adminController.createRole);
router.get('/roles/:roleId', adminController.getRoleById);
router.put('/roles/:roleId', adminController.updateRole);
router.delete('/roles/:roleId', adminController.deleteRole);

// Role permissions
router.get('/roles/:roleId/permissions', adminController.getRolePermissions);
router.post('/roles/:roleId/permissions', adminController.addPermissionToRole);
router.delete('/roles/:roleId/permissions/:permissionId', adminController.removePermissionFromRole);

// Serviceable pin codes
router.get('/serviceable-pin-codes', adminController.getServiceablePinCodes);
router.post('/serviceable-pin-codes', adminController.createServiceablePinCode);
router.put('/serviceable-pin-codes/:pinCodeId', adminController.updateServiceablePinCode);
router.delete('/serviceable-pin-codes/:pinCodeId', adminController.deleteServiceablePinCode);

module.exports = router;
