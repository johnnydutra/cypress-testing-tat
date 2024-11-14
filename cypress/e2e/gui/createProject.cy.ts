import { faker } from '@faker-js/faker'

const options = { env: { snapshotOnly: true }}

describe('Create Project', options, () => {
  beforeEach(() => {
    cy.deleteProjects()
    cy.loginDefault()
  })

  it('should create a new project', () => {
    const project: Project = {
      name: `project-${faker.number.int({ min: 100, max: 999 })}`,
      description: faker.word.words({ count: 3 })
    }

    cy.createProject(project)

    cy.url().should('be.equal', `${Cypress.config('baseUrl')}/${Cypress.env('user_name')}/${project.name}`)
    cy.contains(project.name).should('be.visible')
    cy.contains(project.description).should('be.visible')
  })
})