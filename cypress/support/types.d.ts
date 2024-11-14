interface Project {
  projectId?: string
  name: string
  description: string
}

interface Issue {
  title: string
  description: string
  project: Project
}

interface Label {
  name: string
  color: string
}

interface Milestone {
  title: string
}

type PostProjectResponse = {
  body: {
    id: string;
  }
}
