const db = require('../client');

const ROLES_TABLE = 'roles';
const USER_ROLES_TABLE = 'user_roles';

async function findRoleById(id) {
  return db(ROLES_TABLE).where({ id }).first();
}

async function findRoleByName(name) {
  return db(ROLES_TABLE).where({ name }).first();
}

async function findAllRoles() {
  return db(ROLES_TABLE).select('*');
}

async function createRole(data) {
  const [id] = await db(ROLES_TABLE).insert(data);
  return findRoleById(id);
}

async function assignRoleToUser(userId, roleId) {
  return db(USER_ROLES_TABLE)
    .insert({ user_id: userId, role_id: roleId })
    .onConflict(['user_id', 'role_id'])
    .ignore();
}

async function removeRoleFromUser(userId, roleId) {
  return db(USER_ROLES_TABLE).where({ user_id: userId, role_id: roleId }).delete();
}

async function findRolesForUser(userId) {
  return db(USER_ROLES_TABLE)
    .join(ROLES_TABLE, `${USER_ROLES_TABLE}.role_id`, `${ROLES_TABLE}.id`)
    .where(`${USER_ROLES_TABLE}.user_id`, userId)
    .select(`${ROLES_TABLE}.*`);
}

async function findUsersForRole(roleId) {
  return db(USER_ROLES_TABLE)
    .where({ role_id: roleId })
    .select('user_id');
}

async function removeAllRolesFromUser(userId) {
  return db(USER_ROLES_TABLE).where({ user_id: userId }).delete();
}

module.exports = {
  findRoleById,
  findRoleByName,
  findAllRoles,
  createRole,
  assignRoleToUser,
  removeRoleFromUser,
  findRolesForUser,
  findUsersForRole,
  removeAllRolesFromUser,
};
