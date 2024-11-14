Cypress.Commands.add('submitSignupForm', (email: string, password: string) => {
  cy.intercept('GET', '**/notes').as('getNotes')
  cy.visit('/signup')
  cy.get('#email').type(email)
  cy.get('#password').type(password, { log: false })
  cy.get('#confirmPassword').type(password, { log: false })
  cy.contains('button', 'Signup').click()
  cy.get('#confirmationCode').should('be.visible')

  cy.mailosaurGetMessage(
    Cypress.env('MAILOSAUR_SERVER_ID'),
    { sentTo: email }
  ).then((message) => {
    const confirmationCode = message?.html?.body?.match(/\d{6}/)?.[0]
    cy.get('#confirmationCode').type(`${confirmationCode}{enter}`)

    cy.wait('@getNotes');
  })
})

Cypress.Commands.add('login', 
  (
    username: string = Cypress.env('USER_EMAIL'),
    password: string = Cypress.env('USER_PASSWORD')
  ) => {
    cy.intercept('GET', '**/notes').as('getNotes')
    cy.visit('/login')
    cy.get('#email').type(username)
    cy.get('#password').type(password, { log: false })
    cy.contains('button', 'Login').click()
    cy.wait('@getNotes')
    cy.contains('h1', 'Your Notes').should('be.visible')
  }
)

Cypress.Commands.add('sessionLogin',
  (
    username: string = Cypress.env('USER_EMAIL'),
    password: string = Cypress.env('USER_PASSWORD')
  ) => {
    const login = () => cy.login(username, password)
    cy.session(username, login)
  }
)

const attachFileHandler = () => {
  cy.get('#file').selectFile('cypress/fixtures/example.json')
}

Cypress.Commands.add('addNote', (note: string, attachFile: boolean = false) => {
  cy.visit('/notes/new')
  cy.get('#content').type(note)
  if (attachFile) attachFileHandler()
  cy.contains('button', 'Create').click()
  cy.contains('.list-group-item', note).should('be.visible')
})

Cypress.Commands.add('editNote', (targetNote: string, newNoteValue: string, attachFile: boolean = false) => {
  cy.intercept('GET', '**/notes/**').as('getNote')

  cy.contains('.list-group-item', targetNote).click()
  cy.wait('@getNote')

  cy.get('#content').as('contentField').clear()
  cy.get('@contentField').type(newNoteValue)

  if (attachFile) attachFileHandler()

  cy.contains('button', 'Save').click()

  cy.contains('.list-group-item', newNoteValue).should('be.visible')
  cy.contains('.list-group-item', targetNote).should('not.exist')
})

Cypress.Commands.add('deleteNote', (note: string) => {
  cy.contains('.list-group-item', note).click()
  cy.contains('button', 'Delete').click()
  cy.get('.list-group-item').its('length').should('be.at.least', 1)
  cy.contains('.list-group-item', note).should('not.exist')
})

Cypress.Commands.add('submitSettingsForm', () => {
  cy.visit('/settings')
  cy.get('#storage').type('1')
  cy.get('#name').type(Cypress.env('CREDIT_CARD_HOLDER'))
  cy.iframe('.card-field iframe')
    .as('iframe')
    .find('[name="cardnumber"]')
    .type(Cypress.env('CREDIT_CARD_NUMBER'))
  cy.get('@iframe')
    .find('[name="exp-date"]')
    .type(Cypress.env('CREDIT_CARD_EXP_DATE'))
  cy.get('@iframe').find('[name="cvc"]').type(Cypress.env('CREDIT_CARD_CVC'))
  cy.get('@iframe')
    .find('[name="postal"]')
    .type(Cypress.env('CREDIT_CARD_POSTAL_CODE'))
  cy.contains('button', 'Purchase').click()
})