// cypress/support/index.d.ts

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to fill in required form fields and submit the form.
     * @example cy.fillMandatoryFieldsAndSubmitForm()
     */
    fillMandatoryFieldsAndSubmitForm(firstName: string, lastName: string, emailAddress: string, message: string): Chainable<void>;
  }
}
