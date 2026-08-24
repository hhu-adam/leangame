describe('Basic Interface', () => {
  it('site is loading', () => {
    cy.visit('/')
    cy.contains('button', 'Ping?').should('exist').click()
  })
})
