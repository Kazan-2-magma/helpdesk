# Mini Helpdesk Project

A role-based support/ticketing application with a **Laravel 10 REST API** backend and an
**Angular 20 (TailAdmin)** frontend. Users open support tickets, agents handle the tickets
assigned to them, and admins manage users, agents, categories, FAQs and triage/assign every
ticket.

## Features

- **Authentication** via Laravel Sanctum tokens with per-role abilities.
- **Three roles** with dedicated dashboards and route guards:
  - **User** – create tickets, browse FAQs, reply to their tickets (with file attachments).
  - **Agent** – view tickets assigned to them and update their status.
  - **Admin** – manage users, agents, categories and FAQs; triage tickets (status/priority/category)
    and **assign an agent** to any ticket.
- **Tickets**: title, description, priority (low/medium/high), status (open/resolved/closed),
  category, requester and assigned agent.
- **Comments & attachments** on tickets (uploaded to the `public` storage disk).
- **FAQs** grouped by category, searchable.
- Filtering, search and pagination on the list endpoints.

## Installation

```bash
git clone <repo-url> helpdesk
cd helpdesk
```

### Backend (`/backend`)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

By default the app is configured for **SQLite** (zero setup). To use it, create the database file
and point `.env` at it:

```bash
touch database/database.sqlite
# in .env:
#   DB_CONNECTION=sqlite
#   DB_DATABASE=/absolute/path/to/backend/database/database.sqlite
```

To use MySQL instead, keep `DB_CONNECTION=mysql` and fill in `DB_DATABASE`, `DB_USERNAME`,
`DB_PASSWORD` in `.env`.

Then run the migrations, seed demo data, and link storage for attachments:

```bash
php artisan migrate:fresh --seed
php artisan storage:link
```

### Frontend (`/helpdesk-frontend`)

```bash
cd helpdesk-frontend
npm install
```

The API base URL is set in `src/environments/environment.ts`
(`baseUrl: "http://localhost:8000/api/v1"`).

## Run Backend

```bash
cd backend
php artisan serve            # http://localhost:8000
```

## Run Frontend

```bash
cd helpdesk-frontend
npm start                    # http://localhost:4200
```

## Seed Data

`php artisan migrate:fresh --seed` seeds:

- 3 demo users (admin, agent, user)
- 6 categories
- 30 FAQs
- 20 sample tickets

## Default Credentials

| Role  | Email               | Password    |
|-------|---------------------|-------------|
| Admin | admin@example.com   | `Admin123!` |
| Agent | agent@example.com   | `Agent123!` |
| User  | user@example.com    | `User123!`  |

After login you are redirected to the dashboard for your role.

## API Overview

All routes are prefixed with `/api/v1`. Protected routes require an
`Authorization: Bearer <token>` header.

| Method | Endpoint                         | Role        | Description                         |
|--------|----------------------------------|-------------|-------------------------------------|
| POST   | `/login`                         | public      | Authenticate, returns user + token  |
| POST   | `/logout`                        | any         | Revoke current token                |
| GET    | `/getUser`                       | any         | Current authenticated user          |
| GET    | `/tickets`                       | any         | List tickets (filter/search/page)   |
| POST   | `/tickets`                       | user/admin  | Create a ticket                     |
| GET    | `/tickets/{id}`                  | any         | Ticket detail (`?include=comments`) |
| PUT    | `/tickets/{id}`                  | owner/agent/admin | Update ticket (status, assign agent…) |
| DELETE | `/tickets/{id}`                  | owner/admin | Delete a ticket                     |
| GET    | `/user/userTickets`              | user        | Tickets created by the user         |
| GET    | `/agent/tickets`                 | agent       | Tickets assigned to the agent       |
| POST   | `/user/comment`                  | any         | Add a comment (+ attachments)       |
| GET    | `/categories`                    | any         | List categories                     |
| CRUD   | `/categories`                    | admin       | Manage categories                   |
| CRUD   | `/admin/faqs`                    | admin       | Manage FAQs                         |
| CRUD   | `/admin/users`                   | admin       | Manage users/agents                 |
| GET    | `/attachments/{id}/download`     | any         | Download a comment attachment       |

Ticket filters supported on `GET /tickets`: `status`, `priority`, `category`, `titleSearch`,
`createdAt`, `include` (e.g. `include=user,category,agent`), plus `page` / `per_page`.
