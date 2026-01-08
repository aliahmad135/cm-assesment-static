# Multi-Step Registration Form

A simple registration form that collects user info, shows relevant offers based on location, and displays a summary. Built with TypeScript and Supabase.

## Getting Started

You'll need:

- Node.js 18 or higher
- A Supabase account (free tier works fine)
- Supabase CLI installed: `npm install -g supabase`

### Setup Steps

1. **Install everything:**

   ```bash
   npm install
   ```

2. **Get your Supabase credentials:**

   - Create a project at [supabase.com](https://supabase.com)
   - Go to Settings → API
   - Copy your project URL and anon key

3. **Add credentials to the HTML files:**

   - Open `index.html`, `results.html`, and `thank-you.html`
   - Find the `window.__SUPABASE_CONFIG__` section
   - Replace the URL and anon key with yours

4. **Set up the database:**

   - Open Supabase SQL Editor
   - Copy everything from `supabase/migrations/20240101000000_initial_schema.sql`
   - Paste and run it

5. **Deploy the functions:**

   ```bash
   supabase login
   supabase link --project-ref your-project-ref
   supabase functions deploy submit-registration
   supabase functions deploy submit-offers
   ```

6. **Build and run:**
   ```bash
   npm run build
   python3 -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser.

## What's Inside

```
src/
  models/          # User and Offer data structures
  validators/      # Email, phone, and form validation
  services/        # Talks to Supabase
  controllers/     # Handles form logic
  utils/           # Helper functions
  main.ts          # Registration page
  results.ts       # Offers page
  thank-you.ts     # Summary page

supabase/
  functions/       # Server-side functions
  migrations/      # Database setup

tests/            # Unit and E2E tests
```

## What It Does

- Two-step registration form (eligibility questions, then personal info)
- Shows offers based on the user's state
- Validates email and phone numbers
- Prevents XSS attacks by sanitizing all output
- Works on mobile and desktop

## Running Tests

```bash
# Unit tests
npm test

# E2E tests (install browsers first: npx playwright install)
npm run test:e2e

# Function tests
deno test supabase/functions
```

Note: First time running E2E tests? Install browsers with `npx playwright install`.

More test details in `tests/README.md`.

## How It's Built

The code follows SOLID principles:

- Each class does one thing
- Controllers get services passed in (dependency injection)
- Validators can be extended without changing the base class
- UI, business logic, validation, and data access are separate

Main pieces:

- **Models**: `User`, `Offer` - the data structures
- **Validators**: Check email, phone, and form fields
- **Services**: `SupabaseService` - handles all API calls
- **Controllers**: Manage form state and submission
- **Utils**: Sanitize HTML, store data, show errors

## Security

- All user output is escaped to prevent XSS
- Validation happens on both client and server
- Uses parameterized queries (no SQL injection)
- Row Level Security on database tables
- Only the public anon key is exposed (safe for client-side)

## Database

Four tables:

- `states` - list of states
- `users` - registration info
- `offers` - available offers (some are state-specific)
- `user_offers` - which offers each user selected

## Development

```bash
# Auto-recompile on changes
npm run watch

# Check for type errors
npx tsc --noEmit

# Build for production
npm run build
```

## Common Issues

**"Supabase URL and Anon Key must be configured"**

- Make sure you updated all three HTML files
- Check that the config script comes before the main script tag

**"Failed to submit registration"**

- Is the Edge Function deployed?
- Check the browser console for errors
- Make sure RLS policies allow inserts

**TypeScript won't compile**

- All imports need `.js` extensions
- Try `npm install` again

## License

This is an assessment project.
