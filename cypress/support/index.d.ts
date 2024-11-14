declare namespace Cypress {
  interface Chainable {
    cloneViaSSH(project: Project): Chainable<void>
    createProject(project: Project): Chainable<void>
    createIssue(issue: Issue): Chainable<void>
    login(user: string, password: string, options?: { cacheSession?: boolean }): Chainable<void>
    loginDefault(): Chainable<void>
    logout(): Chainable<void>
    setLabelOnIssue(label: Label): Chainable<void>
    setMilestoneOnIssue(milestone: Milestone): Chainable<void>


    
    
    
    
    // API
    deleteProjects(): Chainable
    getAllProjects(): Chainable
    postIssue(issue: Issue): Chainable
    postLabel(project: Project, label: Label)
    postMilestone(project: Project, milestone: Milestone): Chainable
    postProject(project: Project): Chainable<PostProjectResponse>


  }
}