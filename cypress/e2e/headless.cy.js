/*
This file contains integration tests for the API endpoints without
using the frontend.
*/

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

describe('Server communication', () => {
  it('can start instance', () => {
    cy.request('POST', '/api/lean/start/test/testgame').then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body.id).to.be.an('string')
      expect(res.body.id).to.match(uuidRegex)
    })
  })
  it('can get status', () => {
    cy.request('POST', '/api/lean/start/test/testgame')
      .then((res) => res.body.id)
      .then((id) => {
        expect(id).to.match(uuidRegex)
        cy.request('GET', `/api/lean/instances/${id}`).then((res) => {
          expect(res.status).to.eq(200)
          expect(res.body.status).to.eq('running')
        })
      })
  })
  it('can check empty proof', () => {
    cy.request('POST', '/api/lean/start/test/testgame')
      .then((res) => res.body.id)
      .then((id) => {
        expect(id).to.match(uuidRegex)
        cy.request('POST', `/api/lean/instances/${id}/check`, {
          world: 'TestWorld',
          level: '1',
          tactics: [],
          inventory: [],
          difficulty: 0,
        })
          .then((res) => {
            expect(res.status).to.eq(200)
            return res.body
          })
          .then(({ completed }) => {
            expect(completed).to.eq(false)
          })
      })
  })
  it('can check complete proof', () => {
    cy.request('POST', '/api/lean/start/test/testgame')
      .then((res) => res.body.id)
      .then((id) => {
        expect(id).to.match(uuidRegex)
        cy.request('POST', `/api/lean/instances/${id}/check`, {
          world: 'TestWorld',
          level: '1',
          tactics: ['rw [g]', 'rw [h]'],
          difficulty: 0,
          inventory: [],
        })
          .then((res) => {
            expect(res.status).to.eq(200)
            return res.body
          })
          .then(({ completed }) => {
            expect(completed).to.eq(true)
          })
      })
  })
})
