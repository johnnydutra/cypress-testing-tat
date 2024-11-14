const accessToken = `Bearer ${Cypress.env('gitlab_access_token')}`

Cypress.Commands.add('postProject', (project) => {
  cy.request({
    method: 'POST',
    url: '/api/v4/projects/',
    body: {
      name: project.name,
      description: project.description,
      initialize_with_readme: true,
    },
    headers: { Authorization: accessToken },
  })
})

Cypress.Commands.add('getAllProjects', () => {
  cy.request({
    method: 'GET',
    url: '/api/v4/projects/',
    headers: { Authorization: accessToken },
  })
})

Cypress.Commands.add('deleteProjects', () => {
  cy.getAllProjects().then((response) => {
    response.body.forEach((project: { id:string }) =>
      cy.request({
        method: 'DELETE',
        url: `/api/v4/projects/${project.id}`,
        headers: { Authorization: accessToken },
      })
    )
  })
})

Cypress.Commands.add('postIssue', (issue: Issue) => {
  cy.postProject(issue.project).then((response: PostProjectResponse) => {
    cy.request({
      method: 'POST',
      url: `/api/v4/projects/${response.body.id}/issues`,
      body: {
        title: issue.title,
        description: issue.description,
      },
      headers: { Authorization: accessToken },
    });
  });
});

Cypress.Commands.add('postLabel', (project: Project, label: Label) => {
  cy.request({
    method: 'POST',
    url: `/api/v4/projects/${project.projectId}/labels`,
    body: {
      name: label.name,
      color: label.color,
    },
    headers: { Authorization: accessToken },
  });
});

Cypress.Commands.add('postMilestone', (project: Project, milestone: Milestone) => {
  cy.request({
    method: 'POST',
    url: `/api/v4/projects/${project.projectId}/milestones`,
    body: { title: milestone.title },
    headers: { Authorization: accessToken },
  });
});
