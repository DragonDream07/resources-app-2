'use strict';

const adminService = require('./admin.service');

/**
 * GET /admin/reports
 * Returns aggregated cross-domain report data.
 */
async function getReports(req, res, next) {
  try {
    const { from, to, type } = req.query;
    const reports = await adminService.getReports({ from, to, type });
    return res.status(200).json({ success: true, data: reports });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /admin/dashboard
 * Returns aggregated dashboard stats.
 */
async function getDashboardStats(req, res, next) {
  try {
    const stats = await adminService.getDashboardStats();
    return res.status(200).json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /admin/permissions
 * Returns all available permissions.
 */
async function getPermissions(req, res, next) {
  try {
    const permissions = await adminService.getPermissions();
    return res.status(200).json({ success: true, data: permissions });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /admin/roles
 * Returns all roles.
 */
async function getRoles(req, res, next) {
  try {
    const roles = await adminService.getRoles();
    return res.status(200).json({ success: true, data: roles });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /admin/roles
 * Creates a new role.
 */
async function createRole(req, res, next) {
  try {
    const { name, description } = req.body;
    const role = await adminService.createRole({ name, description });
    return res.status(201).json({ success: true, data: role });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /admin/roles/:roleId
 * Returns a single role by id.
 */
async function getRoleById(req, res, next) {
  try {
    const { roleId } = req.params;
    const role = await adminService.getRoleById(roleId);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }
    return res.status(200).json({ success: true, data: role });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /admin/roles/:roleId
 * Updates an existing role.
 */
async function updateRole(req, res, next) {
  try {
    const { roleId } = req.params;
    const { name, description } = req.body;
    const role = await adminService.updateRole(roleId, { name, description });
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }
    return res.status(200).json({ success: true, data: role });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /admin/roles/:roleId
 * Deletes a role.
 */
async function deleteRole(req, res, next) {
  try {
    const { roleId } = req.params;
    await adminService.deleteRole(roleId);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

/**
 * GET /admin/roles/:roleId/permissions
 * Returns permissions for a given role.
 */
async function getRolePermissions(req, res, next) {
  try {
    const { roleId } = req.params;
    const permissions = await adminService.getRolePermissions(roleId);
    return res.status(200).json({ success: true, data: permissions });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /admin/roles/:roleId/permissions
 * Assigns a permission to a role.
 */
async function addPermissionToRole(req, res, next) {
  try {
    const { roleId } = req.params;
    const { permissionId } = req.body;
    const result = await adminService.addPermissionToRole(roleId, permissionId);
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /admin/roles/:roleId/permissions/:permissionId
 * Removes a permission from a role.
 */
async function removePermissionFromRole(req, res, next) {
  try {
    const { roleId, permissionId } = req.params;
    await adminService.removePermissionFromRole(roleId, permissionId);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

/**
 * GET /admin/serviceable-pin-codes
 * Returns all serviceable pin codes.
 */
async function getServiceablePinCodes(req, res, next) {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const result = await adminService.getServiceablePinCodes({ page: Number(page), limit: Number(limit), search });
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /admin/serviceable-pin-codes
 * Creates a new serviceable pin code entry.
 */
async function createServiceablePinCode(req, res, next) {
  try {
    const { pin_code, city, state, is_active } = req.body;
    const pinCode = await adminService.createServiceablePinCode({ pin_code, city, state, is_active });
    return res.status(201).json({ success: true, data: pinCode });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /admin/serviceable-pin-codes/:pinCodeId
 * Updates a serviceable pin code entry.
 */
async function updateServiceablePinCode(req, res, next) {
  try {
    const { pinCodeId } = req.params;
    const { pin_code, city, state, is_active } = req.body;
    const pinCode = await adminService.updateServiceablePinCode(pinCodeId, { pin_code, city, state, is_active });
    if (!pinCode) {
      return res.status(404).json({ success: false, message: 'Pin code not found' });
    }
    return res.status(200).json({ success: true, data: pinCode });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /admin/serviceable-pin-codes/:pinCodeId
 * Deletes a serviceable pin code entry.
 */
async function deleteServiceablePinCode(req, res, next) {
  try {
    const { pinCodeId } = req.params;
    await adminService.deleteServiceablePinCode(pinCodeId);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getReports,
  getDashboardStats,
  getPermissions,
  getRoles,
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
  getRolePermissions,
  addPermissionToRole,
  removePermissionFromRole,
  getServiceablePinCodes,
  createServiceablePinCode,
  updateServiceablePinCode,
  deleteServiceablePinCode,
};
