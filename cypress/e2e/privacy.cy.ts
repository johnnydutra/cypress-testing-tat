it('should validate privacy page independently', () => {
  cy.visit('./src/privacy.html')
  cy.contains('Talking About Testing').should('be.visible')
})