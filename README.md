# Gift Christian - Portfolio

Personal portfolio and site backend, all one Django app now: the page, the
admin dashboard, and the API all run under `backend/` on a single port.
Content (projects, skills, education, interests, contact info, resume,
profile photo) lives in the database and is edited from the Django admin,
not hardcoded in the template.

🌐 **Live site**: [www.giftchristian.me](https://www.giftchristian.me)

## Getting started

Everything lives in `backend/` - see **[backend/README.md](backend/README.md)**
for setup, the data model, the API, and deploy instructions. Quick version:

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py seed_data
python manage.py createsuperuser
python manage.py runserver
```

Then:
- Site: `http://localhost:8000/`
- Admin: `http://localhost:8000/admin/`
- API: `http://localhost:8000/api/`

## Stack

Django (templates + a handful of plain JSON views, no DRF) serving a
Tailwind/vanilla-JS frontend. No separate frontend build, no separate
frontend host - one app, one deploy.

## Contact

- **Email**: christiangift44@gmail.com
- **Phone**: +1 603 322 0842
- **GitHub**: [@gcl140](https://github.com/gcl140)
- **LinkedIn**: [giftchristian](https://linkedin.com/in/giftchristian)
- **Instagram**: [@gcl.140](https://instagram.com/gcl.140)

## License

This project is open source and available for personal use.

---

© 2026 Gift Christian. All rights reserved.
