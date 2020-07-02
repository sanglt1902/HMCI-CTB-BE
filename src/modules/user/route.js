const express = require('express');
const { asyncMiddleware, accessPermissionMiddleware } = require('../../middlewares');
// const { READ_WRITE } = require('../common/scope');
const { createUser, loadUser, loadAllUsers, updateUser } = require('./controller');

const READ_WRITE = 1;

let router = express.Router();

router.get('/', asyncMiddleware(loadAllUsers));
router.get('/:userId', asyncMiddleware(loadUser));
router.post('/', accessPermissionMiddleware(READ_WRITE), express.json(), asyncMiddleware(createUser));
router.put('/:userId', accessPermissionMiddleware(READ_WRITE), express.json(), asyncMiddleware(updateUser));

module.exports = router;
