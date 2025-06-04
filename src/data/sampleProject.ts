import { Project } from '../types/projectTypes';

export const sampleProject: Project = {
  id: "proj-2025-001",
  name: "Website Redesign",
  description: "Complete redesign of the corporate website with new branding guidelines",
  startDate: "2025-01-15",
  endDate: "2025-06-30",
  status: "active",
  progress: 35,
  createdAt: "2025-01-10T08:00:00Z",
  updatedAt: "2025-05-01T14:30:00Z",
  tasks: [
    {
      id: "task-001",
      name: "Research & Discovery",
      description: "Conduct user research and competitive analysis",
      startDate: "2025-01-15",
      endDate: "2025-01-31",
      duration: 17,
      progress: 100,
      status: "completed",
      priority: "high",
      assignedTo: ["res-001", "res-003"],
      dependencies: [],
      isMilestone: false,
      notes: "Research completed ahead of schedule",
      attachments: [
        {
          id: "att-001",
          name: "Research Findings.pdf",
          url: "#",
          type: "application/pdf",
          size: 2560000,
          uploadedBy: "res-001",
          uploadedAt: "2025-01-30T16:45:00Z"
        }
      ],
      createdAt: "2025-01-10T09:00:00Z",
      updatedAt: "2025-01-31T15:00:00Z"
    },
    {
      id: "task-002",
      name: "Initial Design Concepts",
      description: "Create wireframes and design mockups",
      startDate: "2025-02-01",
      endDate: "2025-02-28",
      duration: 28,
      progress: 100,
      status: "completed",
      priority: "high",
      assignedTo: ["res-002"],
      dependencies: ["task-001"],
      isMilestone: false,
      notes: "Client approved design direction B",
      attachments: [],
      createdAt: "2025-01-15T10:30:00Z",
      updatedAt: "2025-02-28T17:15:00Z"
    },
    {
      id: "task-003",
      name: "Design Approval",
      description: "Client review and sign-off on final designs",
      startDate: "2025-03-01",
      endDate: "2025-03-10",
      duration: 10,
      progress: 100,
      status: "completed",
      priority: "high",
      assignedTo: ["res-002", "res-006"],
      dependencies: ["task-002"],
      isMilestone: true,
      milestoneId: "mile-001",
      notes: "Design approved with minor revisions",
      attachments: [],
      createdAt: "2025-02-01T11:00:00Z",
      updatedAt: "2025-03-10T13:20:00Z"
    },
    {
      id: "task-004",
      name: "Frontend Development",
      description: "Implement approved designs with responsive layouts",
      startDate: "2025-03-11",
      endDate: "2025-04-30",
      duration: 51,
      progress: 65,
      status: "in-progress",
      priority: "medium",
      assignedTo: ["res-004", "res-005"],
      dependencies: ["task-003"],
      isMilestone: false,
      notes: "Homepage and about sections completed",
      attachments: [],
      createdAt: "2025-03-01T13:45:00Z",
      updatedAt: "2025-04-15T16:30:00Z"
    },
    {
      id: "task-005",
      name: "Backend Integration",
      description: "Connect frontend to CMS and databases",
      startDate: "2025-04-01",
      endDate: "2025-05-15",
      duration: 45,
      progress: 40,
      status: "in-progress",
      priority: "medium",
      assignedTo: ["res-005"],
      dependencies: ["task-003"],
      isMilestone: false,
      notes: "API endpoints defined and documentation created",
      attachments: [],
      createdAt: "2025-03-15T09:15:00Z",
      updatedAt: "2025-04-20T11:45:00Z"
    },
    {
      id: "task-006",
      name: "Content Migration",
      description: "Transfer and optimize existing content",
      startDate: "2025-04-15",
      endDate: "2025-05-31",
      duration: 47,
      progress: 20,
      status: "in-progress",
      priority: "low",
      assignedTo: ["res-003", "res-007"],
      dependencies: ["task-005"],
      isMilestone: false,
      notes: "Content inventory completed",
      attachments: [],
      createdAt: "2025-03-20T14:00:00Z",
      updatedAt: "2025-04-25T10:30:00Z"
    },
    {
      id: "task-007",
      name: "QA & Testing",
      description: "Cross-browser testing and bug fixes",
      startDate: "2025-05-15",
      endDate: "2025-06-15",
      duration: 32,
      progress: 0,
      status: "not-started",
      priority: "high",
      assignedTo: ["res-004", "res-008"],
      dependencies: ["task-004", "task-005", "task-006"],
      isMilestone: false,
      notes: "",
      attachments: [],
      createdAt: "2025-04-01T15:30:00Z",
      updatedAt: "2025-04-01T15:30:00Z"
    },
    {
      id: "task-008",
      name: "Launch Website",
      description: "Final deployment and go-live",
      startDate: "2025-06-15",
      endDate: "2025-06-30",
      duration: 16,
      progress: 0,
      status: "not-started",
      priority: "urgent",
      assignedTo: ["res-005", "res-006", "res-008"],
      dependencies: ["task-007"],
      isMilestone: true,
      milestoneId: "mile-002",
      notes: "",
      attachments: [],
      createdAt: "2025-04-01T16:00:00Z",
      updatedAt: "2025-04-01T16:00:00Z"
    }
  ],
  resources: [
    {
      id: "res-001",
      name: "Alex Chen",
      type: "human",
      email: "alex@example.com",
      phone: "+1-555-123-4567",
      role: "UX Researcher",
      skills: ["user research", "interviews", "analytics"],
      cost: 85,
      availability: [
        { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
        { dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
        { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
        { dayOfWeek: 4, startTime: "09:00", endTime: "17:00" },
        { dayOfWeek: 5, startTime: "09:00", endTime: "13:00" }
      ],
      utilization: 65,
      teamId: "team-001",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100",
      createdAt: "2025-01-05T10:00:00Z",
      updatedAt: "2025-01-05T10:00:00Z"
    },
    {
      id: "res-002",
      name: "Maya Patel",
      type: "human",
      email: "maya@example.com",
      phone: "+1-555-987-6543",
      role: "UI/UX Designer",
      skills: ["figma", "design systems", "prototyping"],
      cost: 95,
      availability: [
        { dayOfWeek: 1, startTime: "08:00", endTime: "16:00" },
        { dayOfWeek: 2, startTime: "08:00", endTime: "16:00" },
        { dayOfWeek: 3, startTime: "08:00", endTime: "16:00" },
        { dayOfWeek: 4, startTime: "08:00", endTime: "16:00" },
        { dayOfWeek: 5, startTime: "08:00", endTime: "16:00" }
      ],
      utilization: 90,
      teamId: "team-001",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100",
      createdAt: "2025-01-05T10:15:00Z",
      updatedAt: "2025-01-05T10:15:00Z"
    },
    {
      id: "res-003",
      name: "Sam Wilson",
      type: "human",
      email: "sam@example.com",
      phone: "+1-555-456-7890",
      role: "Content Strategist",
      skills: ["copywriting", "seo", "content planning"],
      cost: 75,
      availability: [
        { dayOfWeek: 1, startTime: "10:00", endTime: "18:00" },
        { dayOfWeek: 2, startTime: "10:00", endTime: "18:00" },
        { dayOfWeek: 3, startTime: "10:00", endTime: "18:00" },
        { dayOfWeek: 4, startTime: "10:00", endTime: "14:00" }
      ],
      utilization: 60,
      teamId: "team-002",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
      createdAt: "2025-01-05T10:30:00Z",
      updatedAt: "2025-01-05T10:30:00Z"
    },
    {
      id: "res-004",
      name: "Lisa Johnson",
      type: "human",
      email: "lisa@example.com",
      phone: "+1-555-789-0123",
      role: "Frontend Developer",
      skills: ["react", "typescript", "css"],
      cost: 90,
      availability: [
        { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
        { dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
        { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
        { dayOfWeek: 4, startTime: "09:00", endTime: "17:00" },
        { dayOfWeek: 5, startTime: "09:00", endTime: "17:00" }
      ],
      utilization: 85,
      teamId: "team-003",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
      createdAt: "2025-01-05T10:45:00Z",
      updatedAt: "2025-01-05T10:45:00Z"
    },
    {
      id: "res-005",
      name: "David Kim",
      type: "human",
      email: "david@example.com",
      phone: "+1-555-234-5678",
      role: "Full-Stack Developer",
      skills: ["node.js", "react", "mongodb", "aws"],
      cost: 100,
      availability: [
        { dayOfWeek: 1, startTime: "09:00", endTime: "18:00" },
        { dayOfWeek: 2, startTime: "09:00", endTime: "18:00" },
        { dayOfWeek: 3, startTime: "09:00", endTime: "18:00" },
        { dayOfWeek: 4, startTime: "09:00", endTime: "18:00" },
        { dayOfWeek: 5, startTime: "09:00", endTime: "18:00" }
      ],
      utilization: 95,
      teamId: "team-003",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100",
      createdAt: "2025-01-05T11:00:00Z",
      updatedAt: "2025-01-05T11:00:00Z"
    },
    {
      id: "res-006",
      name: "Emma Rodriguez",
      type: "human",
      email: "emma@example.com",
      phone: "+1-555-345-6789",
      role: "Project Manager",
      skills: ["project management", "agile", "client relations"],
      cost: 110,
      availability: [
        { dayOfWeek: 1, startTime: "08:00", endTime: "17:00" },
        { dayOfWeek: 2, startTime: "08:00", endTime: "17:00" },
        { dayOfWeek: 3, startTime: "08:00", endTime: "17:00" },
        { dayOfWeek: 4, startTime: "08:00", endTime: "17:00" },
        { dayOfWeek: 5, startTime: "08:00", endTime: "17:00" }
      ],
      utilization: 75,
      teamId: "team-004",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
      createdAt: "2025-01-05T11:15:00Z",
      updatedAt: "2025-01-05T11:15:00Z"
    },
    {
      id: "res-007",
      name: "Chris Taylor",
      type: "human",
      email: "chris@example.com",
      phone: "+1-555-456-7891",
      role: "Content Editor",
      skills: ["copyediting", "proofreading", "cms"],
      cost: 65,
      availability: [
        { dayOfWeek: 1, startTime: "09:00", endTime: "15:00" },
        { dayOfWeek: 3, startTime: "09:00", endTime: "15:00" },
        { dayOfWeek: 5, startTime: "09:00", endTime: "15:00" }
      ],
      utilization: 40,
      teamId: "team-002",
      avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100",
      createdAt: "2025-01-05T11:30:00Z",
      updatedAt: "2025-01-05T11:30:00Z"
    },
    {
      id: "res-008",
      name: "Jordan Lee",
      type: "human",
      email: "jordan@example.com",
      phone: "+1-555-567-8901",
      role: "QA Specialist",
      skills: ["testing", "automation", "accessibility"],
      cost: 80,
      availability: [
        { dayOfWeek: 1, startTime: "10:00", endTime: "18:00" },
        { dayOfWeek: 2, startTime: "10:00", endTime: "18:00" },
        { dayOfWeek: 3, startTime: "10:00", endTime: "18:00" },
        { dayOfWeek: 4, startTime: "10:00", endTime: "18:00" },
        { dayOfWeek: 5, startTime: "10:00", endTime: "18:00" }
      ],
      utilization: 70,
      teamId: "team-003",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100",
      createdAt: "2025-01-05T11:45:00Z",
      updatedAt: "2025-01-05T11:45:00Z"
    }
  ],
  milestones: [
    {
      id: "mile-001",
      name: "Design Approval",
      description: "Final design approval from client",
      date: "2025-03-10",
      status: "reached",
      taskIds: ["task-003"],
      createdAt: "2025-01-15T13:00:00Z",
      updatedAt: "2025-03-10T17:00:00Z"
    },
    {
      id: "mile-002",
      name: "Website Launch",
      description: "Official launch of redesigned website",
      date: "2025-06-30",
      status: "upcoming",
      taskIds: ["task-008"],
      createdAt: "2025-01-15T13:15:00Z",
      updatedAt: "2025-01-15T13:15:00Z"
    }
  ],
  teams: [
    {
      id: "team-001",
      name: "Design Team",
      description: "Responsible for research and design",
      members: ["res-001", "res-002"],
      createdAt: "2025-01-05T14:00:00Z",
      updatedAt: "2025-01-05T14:00:00Z"
    },
    {
      id: "team-002",
      name: "Content Team",
      description: "Handles content strategy and creation",
      members: ["res-003", "res-007"],
      createdAt: "2025-01-05T14:15:00Z",
      updatedAt: "2025-01-05T14:15:00Z"
    },
    {
      id: "team-003",
      name: "Development Team",
      description: "Builds and tests the website",
      members: ["res-004", "res-005", "res-008"],
      createdAt: "2025-01-05T14:30:00Z",
      updatedAt: "2025-01-05T14:30:00Z"
    },
    {
      id: "team-004",
      name: "Management",
      description: "Project oversight and client relations",
      members: ["res-006"],
      createdAt: "2025-01-05T14:45:00Z",
      updatedAt: "2025-01-05T14:45:00Z"
    }
  ],
  costs: [
    {
      id: "cost-001",
      taskId: "task-004",
      amount: 10000,
      category: "人事",
      currency: "USD",
      date: "2025-04-15",
      invoiceId: "INV-2025-04A",
      status: "pending",
      note: "Initial payment"
    }
  ],
  risks: [
    {
      id: "risk-001",
      name: "Schedule Delay",
      description: "Potential delay due to resource shortage",
      probability: "medium",
      impact: "high",
      status: "identified",
      mitigation: "Allocate backup resources",
      owner: "res-006",
      createdAt: "2025-01-05T12:00:00Z",
      updatedAt: "2025-01-05T12:00:00Z"
    }
  ],
  budget: {
    total: 150000,
    spent: 67500,
    remaining: 82500,
    currency: "USD",
    categories: [
      {
        id: "budget-cat-001",
        name: "Design",
        planned: 40000,
        actual: 38500
      },
      {
        id: "budget-cat-002",
        name: "Development",
        planned: 80000,
        actual: 25000
      },
      {
        id: "budget-cat-003",
        name: "Content",
        planned: 20000,
        actual: 4000
      },
      {
        id: "budget-cat-004",
        name: "Testing & QA",
        planned: 10000,
        actual: 0
      }
    ]
  }
};