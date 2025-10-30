# Deploying Adopour to Netlify

## Important Notes

⚠️ **This project is optimized for Vercel** and uses Next.js features that work best on Vercel's platform. While you can deploy to Netlify, some features may require adjustments.

## Environment Variables

You'll need to set up the following environment variables in your Netlify project settings:

### Required Variables

1. **Supabase** (Database & Authentication)
   - Get these from your Supabase project dashboard at https://supabase.com
   - `SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_URL` - Same as above (public)
   - `SUPABASE_ANON_KEY` - Your Supabase anonymous key
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Same as above (public)
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (keep secret!)
   - `SUPABASE_JWT_SECRET` - Your Supabase JWT secret

2. **Postgres Database** (via Supabase)
   - These are automatically provided by Supabase
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_HOST`
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`

3. **Groq API** (for AI features like AdoAI)
   - Get an API key from https://console.groq.com
   - `GROQ_API_KEY`

4. **Stripe** (for business features and payments)
   - Get these from your Stripe dashboard at https://stripe.com
   - `STRIPE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Same as above (public)
   - `STRIPE_SECRET_KEY` - Keep this secret!
   - `STRIPE_MCP_KEY`

### Optional Variables

- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` - Set to your Netlify URL for OAuth redirects

## Setup Steps

1. **Create a Supabase Project**
   - Go to https://supabase.com and create a new project
   - Run all SQL scripts from the `/scripts` folder in your Supabase SQL editor
   - Copy your project URL and keys to the environment variables

2. **Set up Groq API**
   - Sign up at https://console.groq.com
   - Generate an API key
   - Add it to your environment variables

3. **Configure Stripe** (if using business features)
   - Create a Stripe account at https://stripe.com
   - Get your API keys from the dashboard
   - Add them to your environment variables

4. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Add all environment variables in Netlify's dashboard
   - Deploy!

## Database Setup

After deploying, you need to set up your database:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run each script in the `/scripts` folder in order:
   - `001_create_tables.sql`
   - `002_create_profile_trigger.sql`
   - `003_add_post_analysis.sql`
   - `004_add_developer_role.sql`
   - `005_add_admin_verified_roles.sql`
   - `006_create_communities.sql`

## Netlify Configuration

Create a `netlify.toml` file in your project root:

\`\`\`toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
\`\`\`

## Troubleshooting

- **OAuth not working**: Make sure to add your Netlify URL to Supabase's allowed redirect URLs
- **API routes failing**: Netlify handles Next.js API routes differently than Vercel. You may need to use Netlify Functions
- **Environment variables not loading**: Ensure all `NEXT_PUBLIC_*` variables are set for client-side access

## Recommended: Deploy to Vercel Instead

For the best experience, we recommend deploying to Vercel:
1. Push your code to GitHub
2. Import the project in Vercel
3. Vercel will automatically detect and configure Next.js
4. Add your environment variables in Vercel's dashboard
5. Deploy!

Vercel provides better Next.js support and automatic optimizations.
