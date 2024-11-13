describe('TAT Customer Support', () => {
  it('should have correct application title', () => {
    cy.visit('./src/index.html')
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })
})