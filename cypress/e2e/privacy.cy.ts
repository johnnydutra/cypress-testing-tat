it('should validate privacy page independently', () => {
  cy.visit('./src/tat/privacy.html')
  cy.contains('Talking About Testing').should('be.visible')
})