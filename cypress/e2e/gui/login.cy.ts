describe('Login', () => {
  it('should login successfully', () => {
    const username = Cypress.env('user_name')
    const password = Cypress.env('user_password')
    const options = { cacheSession: false }

    cy.login(username, password, options)
    cy.get('.qa-user-avatar').should('be.visible')
  })
})