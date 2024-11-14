import { faker } from '@faker-js/faker'

const options = { env: { snapshotOnly: true } }

describe('Create Issue', options, () => {
  const issue: Issue = {
    title: `issue-${faker.number.int({ min: 100, max: 999 })}`,
    description: faker.word.words({ count: 3 }),
    project: {
      name: `project-${faker.number.int({ min: 100, max: 999 })}`,
      description: faker.word.words({ count: 3 })
    }
  }

  beforeEach(() => {
    cy.deleteProjects()
    cy.loginDefault()
    cy.postProject(issue.project)
  })

  it('should create a new issue successfully', () => {
    cy.createIssue(issue)
    cy.get('.issue-details')
      .should('contain', issue.title)
      .and('contain', issue.description)
  })
})