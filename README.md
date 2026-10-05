<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

Run commands from the repository root (from `api/`, run `cd ..` first):

```bash
nvm use
pnpm install --frozen-lockfile
cp .env.example .env
docker compose --env-file .env -f api/docker-compose.yml up -d
```

Start both the API and the React client with `pnpm dev`. Open
`http://localhost:3000` for the client and `/api/tools` for the API. The API reads the root `.env` independently of the working directory.
Docker Compose uses the same file through `--env-file .env`.

Dependencies are managed by the root `package.json`, `pnpm-lock.yaml`, and
`node_modules/`. Do not install separate dependencies inside `api/` or `Client/`.
Shared Prettier and Oxlint settings also live at the root. The frontend HTML entry
and Vite/TypeScript configuration stay in `Client/`; NestJS/TypeScript/test
configuration stays in `api/`.

## Tools API

The API stores tools with a required `name` and optional `description`:

| Method   | Endpoint         | Description   |
| -------- | ---------------- | ------------- |
| `POST`   | `/api/tools`     | Create a tool |
| `GET`    | `/api/tools`     | List tools    |
| `GET`    | `/api/tools/:id` | Get a tool    |
| `PATCH`  | `/api/tools/:id` | Update a tool |
| `DELETE` | `/api/tools/:id` | Delete a tool |

Example create request:

```json
{ "name": "MySQL", "description": "Database" }
```

The app reads `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`.
`DB_SYNCHRONIZE=true` lets TypeORM create/update the schema for local development;
keep it `false` in production. Before deploying, apply `database/schema.sql` to
the production database and configure the same connection variables in Vercel.

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

Client requests share an Axios instance in `Client/src/api/apiService.ts`, with
same-origin `/api`, a 15-second timeout, session cookies, cancellation through
`AbortSignal`, and readable backend errors. Domain API modules validate response
payloads before returning them to components.

## Google Calendar

Connect a Google account to view calendars and upcoming events, and create events
on calendars you can edit. OAuth credentials must be configured before connecting.
See [Google Calendar setup](docs/google-calendar.md) for Google Cloud, environment variables, and
production callback configuration. Calendar sessions use encrypted HttpOnly cookies;
Google tokens remain on the backend.

## Deployment on Vercel

Production URL: https://tools-ruby-eight.vercel.app/

Deploy the repository root, with **Root Directory left empty** and the
**Other** framework preset. The root `vercel.json` explicitly builds only `api/index.mjs` as the Node.js
function and builds `Client/dist` as static output. This prevents backend source
and test files inside `api/` from becoming separate Vercel functions.
It rewrites `/api` and `/api/*` to the NestJS handler. Remove previous dashboard build/output
command overrides. Node.js 24 is selected by the root `package.json`.

- `/` serves the admin login screen from `Client/`. There is no public website route.
- `/api` returns `Hello World!`.
- `/api/tools` exposes the tools CRUD API.
- Unknown API routes return backend 404 responses.

The admin reads real data from `/api/tools` and supports searching by name or
description, loading, empty, and error/retry states.

The admin login is the default screen at `/` (also available at `/#/admin/login`), with a separate preview link
to `/#/admin`. It uses Tailwind CSS 4 via the official Vite plugin and follows the Lumina CMS
sidebar, card, and form patterns, including its login illustration. The Tools
page uses shadcn/ui components and TanStack Table v8 for sorting, search, column
visibility, row selection, pagination, and row actions. Components live in
`Client/src/components/ui/`; the domain table is
`Client/src/components/tools/ToolsDataTable.tsx`.
Pages live in `Client/src/pages/`: `auth/LoginPage.tsx`,
`admin/DashboardPage.tsx`, `admin/ToolsPage.tsx`, and `admin/CalendarPage.tsx`. Shared sidebar/header live in
`Client/src/layouts/AdminLayout.tsx`; `App.tsx` handles hash navigation.
`/#/admin/tools` supports searching, pagination, and creating/editing tools through
the existing API; `/#/admin/calendar` reuses Google Calendar. The login screen offers Google OAuth through `/api/calendar/connect` and checks
`/api/calendar/status` for configuration and an existing connection. Google
OAuth connects Calendar; admin authentication and backend authorization for Tools
are not implemented. The preview is public, and the existing tools
API remains unchanged.

For local development, run `pnpm install --frozen-lockfile` once, then `pnpm dev`.
NestJS hosts Vite middleware and the API on a single HTTP server. The root `.env`
selects `PORT` (default: `3000`); React hot reload uses the same server.
API routes bypass Vite, so unknown `/api/*` routes keep backend 404 responses.

Run `pnpm run build` from the root to build both applications.

Configure `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and
`DB_SYNCHRONIZE=false` in Vercel. Apply the schema manually before deployment.

Link the repository root to the existing Vercel project, then deploy from the
root using your installed Vercel CLI (`vercel link`, `vercel --prod`). Use `main`
as the production branch for Git integration. Do not deploy from `api/`.

See [Vercel Node.js functions](https://vercel.com/docs/functions/runtimes/node-js).

## Observability

In production applications, observability is essential for understanding how your system behaves, detecting issues early, and maintaining reliable performance.

[NestJS Observe](https://observe.nestjs.com) automatically instruments your NestJS application, giving you deep visibility into your system with minimal setup:

- **Distributed tracing:** Follow requests across services and understand how they flow through your system.
- **Waterfall analysis:** Visualize request execution and identify slow operations, bottlenecks, and unexpected delays.
- **Performance analysis:** Analyze application performance in real time and quickly pinpoint areas that need optimization.
- **Metrics:** Track key application and infrastructure metrics to understand system health and performance trends.
- **Logging:** Centralize and correlate logs with traces and other telemetry to make debugging easier.
- **Error tracking:** Detect errors quickly and investigate their root causes with the surrounding context.
- **SLA monitoring:** Track service-level objectives and identify when your application is approaching or exceeding defined thresholds.
- **Alarms and alerts:** Set up alerts for critical errors, performance degradation, SLA violations, and other anomalies so your team can react quickly.

To add it to this project:

```bash
$ pnpm add @nestjs/observe
```

Then follow the [setup guide](https://docs.nestjs.com/observability/overview) - it takes a single import and an app key.

The free plan needs no payment details and covers 300,000 events a month. You can also browse the [live demo](https://www.observe-demo.nestjs.com/dashboard) first - the whole dashboard over a busy service's data, with nothing to install.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Auto-instrument your application with [NestJS Observe](https://observe.nestjs.com). Distributed tracing, metrics, and logging made easy. Error tracking and performance monitoring for your NestJS applications.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
