import { faker } from '@faker-js/faker/locale/en';

describe('Sign up', () => {
  const prefix = faker.word.words(1)
  const domain = Cypress.env('MAILOSAUR_SERVER_ID') + '.mailosaur.net'
  const email = `${prefix}@${domain}`
  const password = Cypress.env('USER_PASSWORD')

  it('should successfully sign up using confirmation code sent via email', () => {
    cy.submitSignupForm(email, password)
    cy.contains('h1', 'Your Notes').should('be.visible')
    cy.contains('a', 'Create a new note').should('be.visible')
  })
})