Cypress.Commands.add(
  'fillMandatoryFieldsAndSubmitForm', 
  (firstName: string, lastName: string, emailAddress: string, message: string) => {
  cy.get('#firstName').type(firstName);
  cy.get('#lastName').type(lastName);
  cy.get('#email').type(emailAddress);
  cy.get('#open-text-area').type(message);
  cy.get('button[type="submit"]').click();
})