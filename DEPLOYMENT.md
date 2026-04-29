# Deployment Guide - Vercel + Supabase

## Prerequisites
- Vercel account (https://vercel.com)
- Supabase account (https://supabase.com)
- Vercel CLI installed: `npm i -g vercel`

## Step 1: Create Supabase Project

1. Go to https://supabase.com and create a new project
2. Wait for the project to be ready
3. Go to Project Settings → Database
4. Copy the "Connection string" (URI format)
5. Replace `[YOUR-PASSWORD]` with your database password

Example: `postgresql://postgres:your-password@db.xxx.supabase.co:5432/postgres`

## Step 2: Set Up Database Schema

Run the Drizzle push to create the tables in Supabase:

```bash
# Set the DATABASE_URL temporarily
$env:DATABASE_URL="your-supabase-connection-string"

# Push schema to Supabase
cd D:\JOBAPP\job_hub22\lib\db
pnpm run push
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to https://vercel.com/new
3. Import your repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: Leave default (Vercel will use vercel.json)

5. Add Environment Variables (in Settings → Environment Variables):
   - `DATABASE_URL` - Your Supabase connection string
   - `JWT_SECRET` - Generate a secure random string (e.g., `openssl rand -base64 32`)
   - `ADMIN_PASSWORD` - Password for admin registration
   - `NODE_ENV` - `production`
   - `STRIPE_SECRET_KEY` - (Optional) Your Stripe secret key

6. Click "Deploy"

### Option B: Using Vercel CLI

```bash
cd D:\JOBAPP\job_hub22
vercel login
vercel --prod
```

When prompted, set the environment variables.

## Step 4: Verify Deployment

1. Visit your Vercel deployment URL
2. Test the API health endpoint: `https://your-app.vercel.app/api/healthz`
3. Test user registration and login

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Supabase PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret key for JWT token signing (use a secure random string) |
| `ADMIN_PASSWORD` | Yes | Password for admin user registration |
| `NODE_ENV` | Yes | Set to `production` |
| `STRIPE_SECRET_KEY` | No | Stripe API key for payment features |
| `PORT` | No | Set automatically by Vercel |

## Troubleshooting

### Database Connection Issues
- Verify the `DATABASE_URL` is correct
- Make sure your Supabase project allows connections from Vercel (Supabase allows all by default)
- Check Supabase logs in the dashboard

### API Routes Not Working
- Check Vercel function logs
- Verify `api/index.ts` is being deployed as a serverless function
- Check that all environment variables are set

### Frontend Not Loading
- Check that the build completed successfully
- Verify `artifacts/placementbridge/dist/public` exists after build
- Check browser console for errors

## Notes

- The Express API is converted to a serverless function using `serverless-http`
- The frontend is built separately and served as static files
- Supabase handles the PostgreSQL database in the cloud
- Vercel handles the hosting and serverless functions
