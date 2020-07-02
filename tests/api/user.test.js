'use strict';

const ms = require('ms');
const request = require('supertest');
const HttpStatus = require('@tiendq/http-status');
const app = require('../../src/app/app');
const config = require('../../src/config');
const { READ_WRITE } = require('../../src/modules/common/scope');
const { generateAccessToken } = require('../../src/modules/common/utils');
const { getDbConnection, setupUserDb, teardownUserDb } = require('../db');

beforeAll(() => {
  return getDbConnection().then(setupUserDb);
});

afterAll( () => {
  return getDbConnection().then(teardownUserDb);
});

describe('GET /users/:userId', () => {
  test('requests without token should return 401 error', async () => {
    await request(app)
      .get('/v1/users/0123456789abcdef01234567')
      .expect(HttpStatus.Unauthorized);
  });

  test('should return 404 error for non-existent user', async () => {
    let token = await generateAccessToken('0123456789abcdef01234567');

    await request(app)
      .get('/v1/users/0123456789abcdef01234567')
      .set('Authorization', 'Bearer ' + token)
      .expect(HttpStatus.NotFound);
  });

  test('should return a user with valid ID', async () => {
    let token = await generateAccessToken('a00000000000000000000000');

    let response = await request(app)
      .get('/v1/users/a00000000000000000000000')
      .set('Authorization', 'Bearer ' + token)
      .expect(HttpStatus.OK);

    expect(response.body.id).toBe('a00000000000000000000000');
  });

  test('should return a user with default token', async () => {
    let token = await generateAccessToken(config.defaultUserId);

    let response = await request(app)
      .get('/v1/users/a00000000000000000000000')
      .set('Authorization', 'Bearer ' + token)
      .expect(HttpStatus.OK);

    expect(response.body.id).toBe('a00000000000000000000000');
  });
});

describe('GET /users?field=value...', () => {
  test('should return an error if no filter specified', async () => {
    let token = await generateAccessToken('a00000000000000000000000');

    let response = await request(app)
      .get('/v1/users')
      .set('Authorization', 'Bearer ' + token)
      .expect(HttpStatus.BadRequest);

    expect(response.body.error).toBeDefined();
  });

  test('should return an empty user list (not found)', async () => {
    let token = await generateAccessToken('a00000000000000000000000');

    let response = await request(app)
      .get('/v1/users')
      .query({ email: 'nothing@test.com' })
      .set('Authorization', 'Bearer ' + token)
      .expect(HttpStatus.OK);

    expect(response.body.data.contents).toHaveLength(0);
  });

  test('should return a list contains one user', async () => {
    let token = await generateAccessToken('a00000000000000000000000');

    let response = await request(app)
      .get('/v1/users')
      .query({ email: 'tiendq@gmail.com' })
      .set('Authorization', 'Bearer ' + token)
      .expect(HttpStatus.OK);

    expect(response.body.data.contents).toHaveLength(1);
  });

  test('should return a list contains two users', async () => {
    let token = await generateAccessToken('a00000000000000000000000');

    let response = await request(app)
      .get('/v1/users')
      .query({ 'provider.name': 'Google' })
      .set('Authorization', 'Bearer ' + token)
      .expect(HttpStatus.OK);

    expect(response.body.data.contents).toHaveLength(2);
  });
});

describe('POST /users', () => {
  test('should create a new user', async () => {
    let defaultToken = await generateAccessToken(config.defaultUserId, READ_WRITE, ms('1y'));
    // console.log(defaultToken);

    let user = {
      name: 'Lucky Luke',
      email: 'lucky@test.com'
    };

    let response = await request(app)
      .post('/v1/users')
      .send(user)
      .set('Authorization', 'Bearer ' + defaultToken)
      .expect(201);

    expect(response.body.id).toBeDefined();

    let userId = response.body.id;
    let userToken = await generateAccessToken(userId, READ_WRITE);

    response = await request(app)
      .get('/v1/users/' + userId)
      .set('Authorization', 'Bearer ' + userToken)
      .expect(200);

    expect(response.body.name).toBe(user.name);
    expect(response.body.email).toBe(user.email);
  });
});
