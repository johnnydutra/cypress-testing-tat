declare namespace Cypress {
  interface Chainable {
    addNote(note: string, attachFile: boolean): Chainable
    deleteNote(note:string): Chainable
    editNote(targetNote: string, newNoteValue: string, attachFile: boolean): Chainable
    login(email: string, password: string): Chainable
    sessionLogin(email: string, password: string): Chainable
    submitSettingsForm(): Chainable
    submitSignupForm(email: string, password: string): Chainable
  }
}