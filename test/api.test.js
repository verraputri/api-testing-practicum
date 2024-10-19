const request = require('supertest');
const app = require('../src/app');

describe('API Testing', () => {
    let expect;

    // Before the tests, dynamically import chai and set up expect
    before(async () => {
        const chai = await import('chai');
        expect = chai.expect;
    });

    it('should return all items', (done) => {
        request(app)
            .get('/api/items')
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.be.at.least(1);
                done();
            });
    });

    it('should create a new item', (done) => {
        const newItem = { name: 'Item 3' };
        request(app)
            .post('/api/items')
            .send(newItem)
            .end((err, res) => {
                expect(res.status).to.equal(201);
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('name', 'Item 3');
                done();
            });
    });

    it('should update an item successfully', (done) => {
        const updatedItem = { name: 'Updated Item Name' };
        request(app)
            .put('/api/items/1') // Assuming item with id 1 exists
            .send(updatedItem)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('name', 'Updated Item Name');
                done();
            });
    });

    it('should return 404 for updating a non-existent item', (done) => {
        const updatedItem = { name: 'Non-existent Item' };
        request(app)
            .put('/api/items/999')
            .send(updatedItem)
            .end((err, res) => {
                expect(res.status).to.equal(404);
                expect(res.body).to.have.property('message', 'Item not found');
                done();
            });
    });

    
    it('should delete an item successfully', (done) => {
        request(app)
            .delete('/api/items/1') 
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('message', 'Item deleted successfully');
                done();
            });
    });

    it('should return 404 for deleting a non-existent item', (done) => {
        request(app)
            .delete('/api/items/999')
            .end((err, res) => {
                expect(res.status).to.equal(404);
                expect(res.body).to.have.property('message', 'Item not found');
                done();
            });
    });
});
