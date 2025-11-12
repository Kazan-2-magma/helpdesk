import { Routes } from "@angular/router";
import { AdminDashboard } from "./dashboard/admin-dashboard/admin-dashboard";
import { AdminLayout } from "./admin-layout/admin-layout";
import { AdminTickets } from "./admin-tickets/admin-tickets/admin-tickets";
import { AdminFaqs } from "./admin-faqs/admin-faqs/admin-faqs";
import { AdminUsersComponent } from "./admin-users/admin-users.component";
import { AdminAgentsComponent } from "./admin-agents/admin-agents.component";
import { AdminCategoriesComponent } from "./admin-categories/admin-categories.component";

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: AdminLayout,
        children: [
            // { path: 'dashboard', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: AdminDashboard },
            { path: 'users', component: AdminUsersComponent },
            { path: 'tickets', component: AdminTickets },
            { path: 'agents', component: AdminAgentsComponent },
            { path: 'faqs', component: AdminFaqs },
            { path: 'categories', component: AdminCategoriesComponent },
            { path: '',redirectTo : "/admin/dashboard",pathMatch : "full" }
        ]
    }
];