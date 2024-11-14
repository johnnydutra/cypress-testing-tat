declare namespace Cypress {
  interface Chainable {
    assertLoadingIsShownAndHidden(): Chainable<void>
    resultsTableShouldHaveLength(amount: number): Chainable<void>
  }
}