# Chouchou Birthday Website — V3

V3 adds:

- Real Supabase Postgres database for his answers
- Private owner-only dashboard at `admin.html`
- Supabase Auth login for the dashboard
- Row Level Security (RLS)
- Supabase Edge Function for answer submission
- Optional Resend email notification after every saved answer
- Expanded Dua page with multiple personal duas
- Interactive question cards
- No Supabase secret or Resend API key in the frontend

## 1. Create the Supabase project

1. Create a project at Supabase.
2. Open **SQL Editor**.
3. Paste and run `supabase/migrations/001_answers.sql`.
4. In **Authentication → Users**, create your private dashboard user.
5. Copy that user's UUID.
6. Open `supabase/migrations/001_answers.sql` and replace `YOUR_ADMIN_USER_UUID` with the UUID, then run the policy part again.

## 2. Configure the website

Open `js/config.js` and set:

- `supabaseUrl`: your project URL
- `supabasePublishableKey`: your project's publishable key

Only the publishable key belongs in the browser. Do NOT put a secret/service-role key here.

## 3. Create the private dashboard login

Use the Supabase Auth user you created in step 1.

Then open:

`https://YOUR-SITE/admin.html`

The dashboard is not linked from the birthday pages.

## 4. Deploy the Edge Function

You need the Supabase CLI.

From the folder containing `supabase/`:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy submit-answer
```

If your project uses a current secret key, set:

```bash
supabase secrets set SUPABASE_SECRET_KEY="YOUR_SECRET_KEY"
```

For older projects that still use the service-role key, the function also accepts `SUPABASE_SERVICE_ROLE_KEY`.

## 5. Email notifications with Resend

Create a Resend account and API key. For production sending, verify a domain.

Then set:

```bash
supabase secrets set RESEND_API_KEY="YOUR_RESEND_API_KEY"
supabase secrets set OWNER_EMAIL="your-real-email@example.com"
supabase secrets set FROM_EMAIL="Chouchou Birthday <hello@your-verified-domain.com>"
```

The Edge Function sends the notification server-side. Your Resend API key never reaches the browser.

## 6. Add the question page

`questions.html` contains the interactive questions. You can link to it from the ocean page with:

```html
<a href="questions.html">Explore the questions →</a>
```

The questions are defined in `js/questions.js`, so you can add/edit questions without changing the database structure.

## 7. How the data flows

Guest browser
→ `submit-answer` Edge Function
→ Supabase Postgres `answers` table
→ optional Resend email
→ private `admin.html` dashboard

The guest does not need a Supabase account.

## 8. Important security notes

- Never put `SUPABASE_SECRET_KEY`, service-role keys, database passwords, or `RESEND_API_KEY` in frontend files.
- The `answers` table has RLS enabled.
- Anonymous users do not have direct table insert/select privileges.
- Only the server-side Edge Function inserts answers.
- Only the configured Supabase Auth account can read answers through the dashboard.

## 9. Deploying the static website

You can upload the project to Netlify, Vercel, GitHub Pages, or another static host.

The Supabase backend is independent of the static host.

## 10. Personalization

The fastest files to customize are:

- `js/questions.js` — questions
- `dua.html` — your personal duas
- `index.html` — main birthday experience
- `ocean.html` — ocean exploration
- `js/config.js` — Supabase project connection
