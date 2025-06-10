# Tichu Score Tracker

A web application for tracking card game scores, built with modern web technologies and Supabase for data management.

## Prerequisites

Before setting up the project, ensure you have the following installed on your system:

- **Docker** - For running the local Supabase instance
  - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
  - Verify installation: `docker --version`
- **Node.js** (version 22 or higher recommended)
  - [Download Node.js](https://nodejs.org/)
  - Verify installation: `node --version`
- **npm** (comes with Node.js)
  - Verify installation: `npm --version`

## Project Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Supabase
Set up the local Supabase development environment:
```bash
npx supabase init
```

This creates the necessary Supabase configuration files and folder structure in your project. 

### 3. Start Local Supabase Services
Launch the local Supabase stack (PostgreSQL, PostgREST, Auth, etc.):
```bash
npx supabase start
```

This command will:
- Pull and start Docker containers for all Supabase services
- Apply database migrations automatically
- Display local service URLs and credentials

Be patient, it may take a little on the initial setup.

Expected output includes:
- **API URL**: `http://localhost:54321`
- **Database URL**: `postgresql://postgres:postgres@localhost:54322/postgres`
- **Studio URL**: `http://localhost:54323`
- **Anon Key**: Local anonymous key for client connections

### 4. Start Development Server
```bash
npm run dev
```

## Database Schema

The application uses several tables to track games:

- **`players`** - Player information and profiles (shared between Tichu and Rebel Princess)
- **`games`** - Individual game sessions of Tichu
- **`game_participants`** - Player participation in games with positions and Tichu calls
- **`game_scores`** - Team scores and results
- **`rp_games`** - Individual game sessions of Rebel Princess
- **`rp_rounds`** - Individual rounds in Rebel Princess games
- **`rp_round_participants`** - Player participation in Rebel Princess rounds

## Development Workflow

### Useful Supabase Commands
- **Check service status**: `npx supabase status`
- **Stop services**: `npx supabase stop`
- **View logs**: `npx supabase logs`
- **Create migrations**: `npx supabase migration new <migration_name>`
- **Reset local database**: `npx supabase db reset`
- **Access local Studio**: Navigate to `http://localhost:54323`

### Local Services Access
- **Supabase Studio**: `http://localhost:54323` - Visual database management
- **API Documentation**: `http://localhost:54321/rest/v1/` - Auto-generated API docs
- **Database Direct Access**: Use any PostgreSQL client with the connection string shown in `supabase status`

## Troubleshooting

### Common Issues
- **Docker not running**: Ensure Docker Desktop is started before running `supabase start`
- **Port conflicts**: If ports 54321-54323 are in use, stop conflicting services or configure different ports
- **Migration errors**: Check migration SQL syntax and run `supabase db reset` if needed

### Getting Help
- Check Supabase local development logs: `npx supabase logs`
- Verify all services are running: `npx supabase status`
- Restart services if needed: `npx supabase stop && npx supabase start`