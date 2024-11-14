import { faker } from '@faker-js/faker'

describe('Hacker Stories', () => {
  const initialSearchTerm = 'React'
  const newSearchTerm = 'Cypress'

  context('Hitting the real API', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'GET',
        pathname: '**/search',
        query: {
          query: initialSearchTerm,
          page: '0'
        }
      }).as('getStories')
  
      cy.visit('/')
      cy.wait('@getStories')
    })

    it('should display 20 stories, then the next 20 after clicking the "More" button', () => {
      cy.intercept({
        method: 'GET',
        pathname: '**/search',
        query: {
          query: initialSearchTerm,
          page: '1'
        }
      }).as('getNextStories')

      cy.get('.item').should('have.length', 20)
      cy.contains('More').should('be.visible').click()

      cy.wait('@getNextStories')
      cy.get('.item').should('have.length', 40)
    })

    it('should update search results based on the new term', () => {
      cy.intercept({
        method: 'GET',
        pathname: '**/search',
        query: {
          query: newSearchTerm,
          page: '0'
        }
      }).as('getNewTermStories')

      cy.get('#search').should('be.visible')
        .clear().type(`${newSearchTerm}{enter}`)

      cy.wait('@getNewTermStories')
      cy.getLocalStorage('search').should('be.equal',  newSearchTerm)
      cy.get(`button:contains(${initialSearchTerm})`).should('be.visible').click()
      cy.getLocalStorage('search').should('be.equal', initialSearchTerm)

      cy.wait('@getStories')
      cy.get('.item').should('have.length', 20)
      cy.get('.item').first().should('be.visible').and('contain', initialSearchTerm)
      cy.get(`button:contains(${newSearchTerm})`).should('be.visible')
    })
  })

  context('Mocking the API', () => {
    context('Footer and list of stories', () => {
      beforeEach(() => {
        cy.intercept('GET', `**/search?query=${initialSearchTerm}&page=0`, { fixture: 'stories' })
          .as('getMockStories')
  
        cy.visit('/')
        cy.wait('@getMockStories')
      })

      it('should show the page footer', () => {
        cy.get('footer').should('be.visible')
          .and('contain', 'Icons made by Freepik from www.flaticon.com')
      })

      context('List of stories', () => {
        const stories = require('../fixtures/stories')

        it('should show the correct data for all rendered stories', () => {
          cy.get('.item').first().should('be.visible')
            .and('contain', stories.hits[0].title)
            .and('contain', stories.hits[0].author)
            .and('contain', stories.hits[0].num_comments)
            .and('contain', stories.hits[0].points)
          cy.get(`.item a:contains(${stories.hits[0].title})`)
            .should('have.attr', 'href', stories.hits[0].url)

          cy.get('.item').last().should('be.visible')
            .and('contain', stories.hits[1].title)
            .and('contain', stories.hits[1].author)
            .and('contain', stories.hits[1].num_comments)
            .and('contain', stories.hits[1].points)
          cy.get(`.item a:contains(${stories.hits[1].title})`)
            .should('have.attr', 'href', stories.hits[1].url)            
        })

        it('should show one less story after the first one is dismissed', () => {
          cy.get('.button-small').first().should('be.visible').click()
          cy.resultsTableShouldHaveLength(1)
        })

        context('Ordering', () => {
          it('should order by title', () => {
            cy.get('.list-header-button:contains(Title)')
              .as('titleHeader').should('be.visible').click()
            cy.get('.item').first()
              .should('be.visible').and('contain', stories.hits[0].title)
            cy.get(`.item a:contains(${stories.hits[0].title})`)
              .should('have.attr', 'href', stories.hits[0].url)

            cy.get('@titleHeader').click()
            cy.get('.item').first()
              .should('be.visible').and('contain', stories.hits[1].title)
            cy.get(`.item a:contains(${stories.hits[1].title})`)
              .should('have.attr', 'href', stories.hits[1].url)
          })

          it('should order by author', () => {
            cy.get('.list-header-button:contains(Author)')
              .as('authorHeader').should('be.visible').click()
            cy.get('.item').first()
              .should('be.visible').and('contain', stories.hits[0].author)
            
            cy.get('@authorHeader').click()
            cy.get('.item').first()
              .should('be.visible').and('contain', stories.hits[1].author)
          })

          it('should order by comment count', () => {
            cy.get('.list-header-button:contains(Comments)')
              .as('commentsHeader').should('be.visible').click()
            cy.get('.item').first()
              .should('be.visible').and('contain', stories.hits[1].num_comments)
            
            cy.get('@commentsHeader').click()
            cy.get('.item').first()
              .should('be.visible').and('contain', stories.hits[0].num_comments)
          })

          it('should order by points', () => {
            cy.get('.list-header-button:contains(Comments)')
              .as('pointsHeader').should('be.visible').click()
            cy.get('.item').first()
              .should('be.visible').and('contain', stories.hits[1].points)
            
            cy.get('@pointsHeader').click()
            cy.get('.item').first()
              .should('be.visible').and('contain', stories.hits[0].points)
          })
        })
      })
    })

    context('Search', () => {
      beforeEach(() => {
        cy.intercept('GET', `**/search?query=${initialSearchTerm}&page=0`, { fixture: 'empty' })
          .as('getEmptyStories')

        cy.intercept('GET', `**/search?query=${newSearchTerm}&page=0`, { fixture: 'stories' })
          .as('getStories')

        cy.visit('/')
        cy.wait('@getEmptyStories')
        cy.get('#search').should('be.visible').clear()
      })

      it('should show empty table when no story is returned', () => {
        cy.get('.item').should('not.exist')
      })

      it('should return mocked results when passing term and hitting the enter key', () => {
        cy.get('#search').type(`${newSearchTerm}{enter}`)

        cy.wait('@getStories')
        cy.resultsTableShouldHaveLength(2)
        cy.get(`button:contains(${initialSearchTerm})`).should('be.visible')
      })

      it('should return mocked results when passing term and click the "Submit" button', () => {
        cy.get('#search').type(newSearchTerm)
        cy.contains('Submit').click()

        cy.wait('@getStories')
        cy.resultsTableShouldHaveLength(2)
        cy.get(`button:contains(${initialSearchTerm})`).should('be.visible')
      })

      context('Last searches', () => {
        it('should show a max of 5 buttons for the last searched terms', () => {
          cy.intercept('GET', '**/search**', { fixture: 'empty' })
            .as('getRandomStories')

          Cypress._.times(6, () => {
            const randomWord = faker.word.words(1)
            cy.get('#search').clear().type(`${randomWord}{enter}`)
            cy.wait('@getRandomStories')
            cy.getLocalStorage('search').should('be.equal', randomWord)
          })

          cy.get('.last-searches button').should('have.length', 5)
        })
      })
    })
  })

  it('should show a "Loading..." message before displaying results', () => {
    cy.intercept('GET', '**/search**', { delay: 3000, fixture: 'stories' })
      .as('getDelayedStories')

    cy.visit('/')
    cy.assertLoadingIsShownAndHidden()
    cy.resultsTableShouldHaveLength(2)
  })

  context('Errors', () => {
    it('should show "Something went wrong ..." in case of a server error', () => {
      cy.intercept('GET', '**/search**', { statusCode: 500 })
        .as('getServerFailure')
  
      cy.visit('/')
      cy.wait('@getServerFailure')
    
      cy.get('p:contains(Something went wrong ...)').should('be.visible')
    })
  
    it('should show "Something went wrong ..." in case of a network error', () => {
      cy.intercept('GET', '**/search**', { forceNetworkError: true })
        .as('getNetworkFailure')
  
      cy.visit('/')
      cy.wait('@getNetworkFailure')
  
      cy.get('p:contains(Something went wrong ...)').should('be.visible')
    })
  })
})