import { faker } from '@faker-js/faker'

const options = { env: { snapshotOnly: true } }

describe('Issue Label', options, () => {
  const issue: Issue = {
    title: `issue-${faker.number.int({ min: 100, max: 999 })}`,
    description: faker.word.words({ count: 3 }),
    project: {
      name: `project-${faker.number.int({ min: 100, max: 999 })}`,
      description: faker.word.words({ count: 3 })
    }
  }

  const label: Label = {
    name: `label-${faker.word.words(1)}`,
    color: '#ffaabb'
  }

  beforeEach(() => {
    cy.deleteProjects()
    cy.loginDefault()
    
  })
})