# giftchristian.me backend

One Django app, one port. It renders the page (`portfolio/templates/index.html`),
serves its assets (`portfolio/static/`), runs the admin dashboard, and exposes
the API the page's JS calls - all from the same process, no separate frontend
host, no CORS to configure for normal use. Education, skills, projects,
interests, contact info, and site stats live in a real database and are
edited through the Django admin. No DRF, no extra framework layers, just
plain Django views returning JSON, on purpose, per "so so simple not complex."

## Local setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # sqlite by default, no MySQL needed locally
python manage.py migrate
python manage.py seed_data    # loads current site content, downloads interest images
python manage.py createsuperuser
python manage.py runserver
```

- Site: `http://localhost:8000/`
- Admin dashboard: `http://localhost:8000/admin/`
- API base: `http://localhost:8000/api/`

## What's in the database

Edit all of this from `/admin/`, no code changes needed:
- **Education** — institution, degree, GPA, coursework, activities, award
- **Skills** — name, icon, category (framework/tool), rating
- **Projects** — with a many-to-many to Skills, so you pick which skills show under each project
- **Interests** — including the photo, uploaded and served from this backend instead of hotlinked
- **Contact info** — email, phone, social links
- **Profile** — `start_year` (drives "years of experience"), `happy_clients`, profile photo, resume PDF
- **Contact messages** — every form submission is saved here, and best-effort emailed to `CONTACT_TO_EMAIL`

Experience history is still hardcoded in `static/js/index.js` (`const experiences = [...]`).
Say the word if you want that in the database too.

## API

All read endpoints are plain `GET`, no auth. Since the page and the API share
an origin, `CORS_ALLOWED_ORIGINS` only matters if something external ever
needs to call this API directly.

| Endpoint | Returns |
|---|---|
| `GET /api/education/` | all education entries, `coursework`/`activities` as arrays |
| `GET /api/projects/` | all projects, each with a `tech` array of skill names |
| `GET /api/skills/` | all skills |
| `GET /api/interests/` | all interests, `image` is an absolute URL to this server |
| `GET /api/contact-info/` | email, phone, social links |
| `GET /api/stats/` | `yearsExperience`, `projectsCount`, `happyClients`, `photoUrl`, `resumeUrl` |
| `POST /api/contact/` | `{name, email, phone, message}` -> saves + emails you |

## Deploying to your server

This is built to run on your own box (the one your project subdomains like
`meetups.giftchristian.dev` run from), reachable at `giftchristian.dev` (or
whichever domain you point at it - it's now the domain that serves the page
itself, not a separate API subdomain). Rough shape:

1. Install MySQL if you want it instead of sqlite, create a database and user.
2. On the server: clone this repo, set up the venv, `pip install -r requirements.txt`.
3. Copy `.env.example` to `.env`, fill in `MYSQL_*`, `DJANGO_SECRET_KEY`,
   `DJANGO_ALLOWED_HOSTS=giftchristian.dev`, `DJANGO_DEBUG=False`,
   and the `EMAIL_*` vars (a Gmail app password works fine for
   `EMAIL_HOST_USER`/`EMAIL_HOST_PASSWORD`, or swap in whatever SMTP you use).
   Set `EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend` to
   actually send instead of just logging to console.
4. `python manage.py migrate && python manage.py seed_data && python manage.py createsuperuser`
5. `python manage.py collectstatic` (gathers admin + app static files into `staticfiles/`).
6. Run it behind gunicorn + nginx (or Tailscale + Caddy, whatever you're
   already using for the subdomains), pointed at `config.wsgi:application`,
   with `nginx` serving `/static/` and `/media/` directly. With `DEBUG=False`,
   `runserver` won't serve those itself - that's nginx's job in production.
7. Point DNS: `giftchristian.dev` -> this server.

## Notes

- `db.sqlite3`, `media/`, `venv/`, `staticfiles/`, and `.env` are gitignored
  (generated/secret, not source) — everything else, including migrations,
  templates, and static source files, is committed.
- `seed_data` is safe to re-run; it upserts by name instead of duplicating.
- Locally, `DEBUG=True` is what makes `runserver` auto-serve the admin's CSS/JS
  and this app's own static files. If the admin looks unstyled, check `.env`.
