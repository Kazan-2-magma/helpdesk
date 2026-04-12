import { Routes } from "@angular/router";
import { UserTicketsComponent } from "./user-tickets/user-tickets.component";
import { UserLayoutComponent } from "./user-layout/user-layout.component";
import { UserDashboardComponent } from "./user-dashboard/user-dashboard.component";
import { UserFaqsComponent } from "./user-faqs/user-faqs.component";

export const USER_ROUTES: Routes = [
  {
    path: "",
    component: UserLayoutComponent,
    children: [
      {
        path: "dashboard",
        component: UserDashboardComponent,
      },
      {
        path: "tickets",
        component: UserTicketsComponent,
      },
      {
        path: "faqs",
        component: UserFaqsComponent,
      },
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
    ],
  },
];
