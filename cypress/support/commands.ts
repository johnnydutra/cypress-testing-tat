import 'cypress-localstorage-commands'

Cypress.Commands.add('assertLoadingIsShownAndHidden', () => {
  cy.contains('Loading ...').should('be.visible')
  cy.contains('Loading ...').should('not.exist')
})

Cypress.Commands.add('resultsTableShouldHaveLength', (amount: number) => {
  cy.get('.item').should('have.length', amount)
})