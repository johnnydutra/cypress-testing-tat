Cypress.Commands.add('loginDefault', () => {
  cy.login(Cypress.env('user_name'), Cypress.env('user_password'), { cacheSession: true })
})

Cypress.Commands.add(
  'login',
  (
    user: string = Cypress.env('user_name'),
    password: string = Cypress.env('user_password'),
    { cacheSession = true }: { cacheSession?: boolean } = {}
  ) => {

    const login = () => {
      cy.visit('/users/sign_in')

      cy.get('[data-qa-selector="login_field"]').type(user)
      cy.get('[data-qa-selector="password_field"]').type(password, { log: false })
      cy.get('[data-qa-selector="sign_in_button"]').click()
    }

    const validate = () => {
      cy.visit('/')
      cy.location('pathname', { timeout: 1000 }).should('not.eq', '/users/sign_in')
    }

    const options = {
      cacheAcrossSpecs: true,
      validate
    }

    if (cacheSession) {
      cy.session([user, password], login, options)
    } else {
      login()
    }
  }
)

Cypress.Commands.add('logout', () => {
  cy.get('[data-qa-selector="user_menu"]').click();
  cy.get('[data-qa-selector="sign_out_link"]').click();
})

Cypress.Commands.add('createProject', (project: Project) => {
  cy.visit('/projects/new')
  cy.get('#project_name').type(project.name)
  cy.get('#project_description').type(project.description)
  cy.get('.qa-initialize-with-readme-checkbox').check()
  cy.contains('Create project').click()
})

Cypress.Commands.add('createIssue', (issue: Issue) => {
  cy.visit(`/${Cypress.env('user_name')}/${issue.project.name}/issues/new`)
  cy.get('.qa-issuable-form-title').type(issue.title)
  cy.get('.qa-issuable-form-description').type(issue.description)
  cy.contains('Submit issue').click()
})

Cypress.Commands.add('setLabelOnIssue', (label: Label) => {
  cy.get('.qa-edit-link-labels').click()
  cy.contains(label.name).click()
  cy.get('body').click()
})

Cypress.Commands.add('setMilestoneOnIssue', (milestone: Milestone) => {
  cy.get('.block.milestone .edit-link').click()
  cy.contains(milestone.title).click()
})