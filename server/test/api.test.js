const supertest = require('supertest')
var server = supertest.agent("http://localhost:5000");
describe('socket.io project express api unit test', () => {

  it('should user login', async () => {
    server
      .post('/login')
      .send({ email: "mike@mike", password: "12345678" })
      .expect("Content-type", /json/)
      .then(response => {
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('post')
        done();
      })
  })
  it('should user register', async () => {
    server
      .post('/register')
      .send({ email: "alice@alice", password: "12345678", username: "alice", langue: "English", country: "Turkey" })
      .expect("Content-type", /json/)
      .then(response => {
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('post')
        done();
      })
  })
  it('should user get all', async () => {
    server
      .get('/allusers/62a32a1a806db32321aca623')
      .then(response => {
        expect(response.statusCode).toEqual(200)
        expect(response.body).toHaveProperty('get')
        done();
      })

  });
  it('should user get detail', async () => {
    server
      .get('/getuserdetail/62a32a1a806db32321aca623')
      .then(response => {
        expect(response.statusCode).toEqual(200)
        expect(response.body).toHaveProperty('get')
        done();
      })

  });
})
