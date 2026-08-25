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

Runs on your own box (the same one your other project subdomains run from),
behind a Cloudflare Tunnel, on `giftchristian.dev`. No nginx: gunicorn
serves the app directly on its own port, and
[WhiteNoise](https://whitenoise.readthedocs.io/) (already wired into
`MIDDLEWARE`/`STORAGES` in `settings.py`) serves static files from inside
the same process - matching how your other projects each run their own
service on their own port with the tunnel routing straight to it.

1. Create a MySQL database + user for this app (MySQL's likely already
   running on the box for your other projects).
2. Clone this repo, set up the venv, `pip install -r requirements.txt`.
3. Copy `.env.example` to `.env`, fill in `MYSQL_*`, a fresh
   `DJANGO_SECRET_KEY`, `DJANGO_ALLOWED_HOSTS=giftchristian.dev`,
   `DJANGO_DEBUG=False`, and the `EMAIL_*` vars (a Gmail app password works
   fine for `EMAIL_HOST_USER`/`EMAIL_HOST_PASSWORD`). Set
   `EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend` to actually
   send instead of just logging to console.
4. `python manage.py migrate && python manage.py seed_data && python manage.py createsuperuser`
5. `python manage.py collectstatic --noinput` (WhiteNoise serves from here).
6. Run gunicorn bound to `127.0.0.1:<port>` as a systemd service (pick a
   port your other projects aren't already using).
7. In the Cloudflare Zero Trust dashboard, add a Public Hostname on the
   tunnel: `giftchristian.dev` -> `http://localhost:<port>`.

## Notes

- `db.sqlite3`, `media/`, `venv/`, `staticfiles/`, and `.env` are gitignored
  (generated/secret, not source) — everything else, including migrations,
  templates, and static source files, is committed.
- `seed_data` is safe to re-run; it upserts by name instead of duplicating.
- Locally, `DEBUG=True` is what makes `runserver` auto-serve the admin's CSS/JS
  and this app's own static files. If the admin looks unstyled, check `.env`.
