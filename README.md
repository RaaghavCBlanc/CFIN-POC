# CFIN POC (Strapi + Angular)

This repository contains:
- `strapi/`: Strapi v5 CMS backend
- `next/`: Angular frontend (served at `http://localhost:4200`)

Data portability is handled with official Strapi `export/import` archives.
A committed `strapi/data/export_latest.tar.gz` allows a new user to clone and load the same content snapshot.

## Prerequisites

- Node.js `18` to `22`
- Yarn `4.x` (Corepack recommended)

Enable Corepack if needed:

```bash
corepack enable
```

## Fresh Setup (New User)

1. Clone the repository.

```bash
git clone <your-repo-url>
cd CFIN-POC
```

2. Add environment files.

- `strapi/.env` (required)
- `next/.env` (if required by your local frontend config)

Template: `strapi/.env.example`.

3. Install dependencies and run setup.

```bash
yarn install
yarn setup
```

4. Import the shared Strapi snapshot.

```bash
yarn data:import
```

5. Start both apps.

```bash
yarn dev
```

## Local URLs

- Frontend: `http://localhost:4200/en`
- Strapi Admin: `http://localhost:1337/admin`
- Strapi API base: `http://localhost:1337/api`

## Official Strapi Export/Import Workflow

Export files are stored in `strapi/data`.

- Latest shared export used by default:
  - `strapi/data/export_latest.tar.gz`

Commands:

```bash
# Create a new official Strapi export archive (no encryption)
yarn data:export

# Import latest shared export
yarn data:import

# Import a specific export file from strapi/data
yarn data:import -- export_YYYYMMDDHHMMSS.tar.gz
```

Notes:
- `yarn data:import` runs with `--force` and replaces current Strapi data with the archive content.
- If Strapi is running, stop it before import.
- To keep identical data across machines, commit/publish the same export archive.

## Troubleshooting

- If API responses return `403`, check public role permissions in Strapi Admin:
  `Settings -> Users & Permissions -> Roles -> Public`.