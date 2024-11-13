describe('TAT Customer Support', () => {

  const firstName = 'Johnny'
  const lastName = 'Test'
  const emailAddress = 'johnny@test.com'
  const phoneNumber = '11987654321'
  const message = 'Cypress refresher course'

  beforeEach('land on the application homepage', () => {
    cy.visit('./src/index.html')
  })

  it('should have correct application title', () => {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })

  it('should send completely filled form', () => {
    const longText = 'loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooongText'

    cy.clock();

    cy.get('#firstName').type(firstName)
    cy.get('#lastName').type(lastName)
    cy.get('#email').type(emailAddress)
    cy.get('#open-text-area').type(longText, { delay: 0 })
    cy.get('button[type="submit"]').click()

    cy.get('.success').should('be.visible')

    cy.tick(3000)

    cy.get('.success').should('not.be.visible')
  })

  it('should print error message when trying to submit form with invalid email address', () => {
    cy.clock()

    cy.get('#firstName').type(firstName)
    cy.get('#lastName').type(lastName)
    cy.get('#email').type(emailAddress.replace('@', ''))
    cy.get('#open-text-area').type(message)
    cy.get('button[type="submit"]').click()

    cy.get('.error').should('be.visible')

    cy.tick(3000)

    cy.get('.error').should('not.be.visible')
  })

  it('should not print non-numeric characters into the phone field', () => {
    cy.get('#phone').type('abcdef').should('have.value', '')
  })

  it('should print error message when phone field becomes mandatory but is not filled', () => {
    cy.clock()

    cy.get('#firstName').type(firstName)
    cy.get('#lastName').type(lastName)
    cy.get('#email').type(emailAddress)
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type(message)
    cy.get('button[type="submit"]').click()

    cy.get('.error').should('be.visible')

    cy.tick(3000)

    cy.get('.error').should('not.be.visible')
  })

  it('should clear all previously filled input fields', () => {
    cy.get('#firstName').type(firstName).should('have.value', firstName)
      .clear().should('have.value', '')
    cy.get('#lastName').type(lastName).should('have.value', lastName)
      .clear().should('have.value', '')
    cy.get('#email').type(emailAddress).should('have.value', emailAddress)
      .clear().should('have.value', '')
    cy.get('#phone').type(phoneNumber).should('have.value', phoneNumber)
      .clear().should('have.value', '')
  })

  it('should print error message when form is submit with unfilled mandatory fields', () => {
    cy.clock()

    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')

    cy.tick(3000)

    cy.get('.error').should('not.be.visible')
  })

  it('should submit form successfully using custom command', () => {
    cy.fillMandatoryFieldsAndSubmitForm(firstName, lastName, emailAddress, message)
    cy.get('.success').should('be.visible')
  })

  it('should select a product by its visible value', () => {
    cy.get('#product').select('YouTube').should('have.value', 'youtube')
  })

  it('should select a product by its coded value', () => {
    cy.get('#product').select('mentoria').should('have.value', 'mentoria')
  })

  it('should select a product by its index', () => {
    cy.get('#product').select(1).should('have.value', 'blog')
  })

  it('should check support type radio', () => {
    cy.get('input[type="radio"][value="feedback"]').check().should('be.checked')
  })

  it('should check all support type radio', () => {
    cy.get('input[type="radio"]')
      .should('have.length', 3)
      .each((radio) => {
        cy.wrap(radio).check().should('be.checked')
      })
  })

  it('should check all checkboxes, then uncheck the last one', () => {
    cy.get('input[type="checkbox"]').check().should('be.checked')
      .last().uncheck().should('not.be.checked')
  })

  it('should select a fixture file', () => {
    cy.get('#file-upload')
      .selectFile('cypress/fixtures/example.json')
      .should((input) => {
        expect(input[0].files[0].name).to.equal('example.json')
      })
  })

  it('should select a file simulating a drag and drop action', () => {
    cy.get('#file-upload')
      .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
      .should((input) => {
        expect(input[0].files[0].name).to.equal('example.json')
      })
  })

  it('should select a file as an aliased fixture', () => {
    const fileName = 'example.json'
    cy.fixture(fileName).as('sampleFile')
    cy.get('#file-upload').selectFile('@sampleFile')
      .should((input) => {
        expect(input[0].files[0].name).to.equal(fileName)
      })
  })

  it('should check that privacy page opens in a new tab without clicking a link', () => {
    cy.get('#privacy a').should('have.attr', 'target', '_blank')
  })

  it('should remove target attr from link and access privacy page', () => {
    cy.get('#privacy a').invoke('removeAttr', 'target').click()
    cy.contains('Talking About Testing').should('be.visible')
  })

  it('should show and hide alert messages with .invoke()', () => {
    cy.get('.success').should('not.be.visible')
      .invoke('show').should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide').should('not.be.visible')

    cy.get('.error').should('not.be.visible')
      .invoke('show').should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide').should('not.be.visible')
  })

  it('should fill textarea with .invoke()', () => {
    const longText = Cypress._.repeat('0123456789', 20);
    cy.get('#open-text-area')
      .invoke('val', longText)
      .should('have.value', longText);
  })

  it('make http request', () => {
    cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
      .then(response => {
        const { status, statusText, body } = response
        expect(status).to.equal(200);
        expect(statusText).to.equal('OK')
        expect(body).to.contain('CAC TAT')
      })
  })
  
  it('should find the hidden cat', () => {
    cy.get('#cat').invoke('show').should('be.visible')
    cy.get('#title').invoke('text', 'CAT TAT')
  })
})