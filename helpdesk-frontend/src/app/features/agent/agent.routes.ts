import { Routes } from "@angular/router";
import { AgentLayoutComponent } from "./agent-layout/agent-layout.component";
import { AgentDashboardComponent } from "./agent-dashboard/agent-dashboard.component";
import { AgentTicketsComponent } from "./agent-tickets/agent-tickets.component";
import { UserTicketDetailComponent } from "../user/user-ticket-detail/user-ticket-detail.component";

export const AGENT_ROUTES: Routes = [
  {
    path: "",
    component: AgentLayoutComponent,
    children: [
      {
        path: "dashboard",
        component: AgentDashboardComponent,
      },
      {
        path: "tickets",
        component: AgentTicketsComponent,
      },
      {
        path: "tickets/:id",
        component: UserTicketDetailComponent,
      },
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
    ],
  },
];
