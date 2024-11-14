import { faker } from '@faker-js/faker/locale/en'

describe('Scenarios where authentication is a precondition', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/notes').as('getNotes')
  })

  it('should CRUD a note', () => {
    const noteCreate = faker.word.words(4)
    const noteUpdate = faker.word.words(4)

    cy.addNote(noteCreate, false)
    cy.wait('@getNotes')

    cy.editNote(noteCreate, noteUpdate, true)
    cy.wait('@getNotes')

    cy.deleteNote(noteUpdate)
    cy.wait('@getNotes')
  })

  it('should submit the settings form', () => {
    cy.intercept('POST', '**/prod/billing').as('paymentRequest')

    cy.submitSettingsForm()

    cy.wait('@getNotes')
    cy.wait('@paymentRequest').its('state').should('be.equal', 'Complete')
  })

  it('should log out', () => {
    const isMenuCollapsed = Cypress.config('viewportWidth') < Cypress.env('viewportWidthBreakpoint')
    
    cy.visit('/')
    cy.wait('@getNotes')
    
    if (isMenuCollapsed) cy.get('.navbar-toggle.collapsed').should('be.visible').click()

    cy.contains('.nav a', 'Logout').click()
    cy.get('#email').should('be.visible')
  })
})