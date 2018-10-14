/**
 *  @fileOverview Contact book-related unit testing.
 *
 *  @author       Oliver Rudzinski <inf17068@lehre.dhbw-stuttgart.de>
 *
 *  @requires     NPM:chai Unit testing.
 *  @requires     NPM:chai-http Unit testing.
 *  @requires     ../index Server.
 *  @requires     ../models/book Contact book data model.
 */

// Set developer mode.
process.env.NODE_ENV = 'test';

// Import external modules.
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../index');
const Book = require('../models/book');

const should = chai.should();

chai.use(chaiHttp);

describe('Books', () => {
  before((done) => {
    Book.deleteMany({}, () => {
      done();
    });
  });

  it('should list all books on /books GET', (done) => {
    chai.request(server)
      .get('/api/books')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
  });

  it('should not create a contact book without a name and on /books POST', (done) => {
    chai.request(server)
      .post('/api/books')
      .send({
        color: '#D3D3D3',
      })
      .end((err, res) => {
        res.should.have.status(422);
        res.body.should.be.a('object');
        res.body.should.have.property('errors');
        res.body.errors.should.be.a('array');
        res.body.errors[0].should.have.property('param').eql('name');
        done();
      });
  });

  it('should create a contact book with name and color property on /books POST', (done) => {
    chai.request(server)
      .post('/api/books')
      .send({
        name: 'Sample Name',
        color: '#D3D3D3',
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('_id');
        res.body.should.have.property('name');
        res.body.should.have.property('color');
        res.body.color.length.should.be.eql(7);
        done();
      });
  });

  it('should not update a contact with an invalid color code on /books/<bookId> PUT', (done) => {
    chai.request(server)
      .get('/api/books')
      .end((err, res1) => {
        chai.request(server)
          .put(`/api/books/${res1.body[0]._id}`)
          .send({ color: '#ABCDEFG' }) // not valid hex code
          .end((err, res2) => {
            res2.should.have.status(422);
            res2.should.be.a('object');
            res2.body.should.have.property('errors');
            res2.body.errors.should.be.a('array');
            res2.body.errors[0].should.have.property('param').eql('color');
            done();
          });
      });
  });

  it('should update a contact with a valid name and color code on /books/<bookId> PUT', (done) => {
    chai.request(server)
      .get('/api/books')
      .end((err, res) => {
        chai.request(server)
          .put(`/api/books/${res.body[0]._id}`)
          .send({
            name: 'New Sample Name',
            color: '#C5C5C5', // valid hex code
          })
          .end((err2, res2) => {
            res2.should.have.status(200);
            res2.should.be.a('object');
            res2.body.should.have.property('color').not.eql(res.body[0].color);
            done();
          });
      });
  });

  it('should delete a contact book when a valid bookId is provided on /books/<bookId> DELETE', (done) => {
    chai.request(server)
      .get('/api/books')
      .end((err, res) => {
        chai.request(server)
          .delete(`/api/books/${res.body[0]._id}`)
          .end((err2, res2) => {
            res2.should.have.status(200);
            chai.request(server)
              .get('/api/books')
              .end((err3, res3) => {
                res3.should.have.status(200);
                res3.body.should.be.a('array');
                res3.body.length.should.be.eql(0);
                done();
              });
          });
      });
  });
});
