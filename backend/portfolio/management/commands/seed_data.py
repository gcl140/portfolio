import io
from pathlib import Path

import requests
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand

from portfolio.models import ContactInfo, Education, Interest, Profile, Project, Skill

# portfolio/static/, where prof.jpeg and resume.pdf live as the
# fallback copies bundled with the template (not the same file object as
# what gets uploaded to Profile.photo/Profile.resume, just the seed source).
APP_STATIC = Path(__file__).resolve().parents[2] / "static"

EDUCATION = [
    {
        "institution": "Dartmouth College",
        "url": "https://www.dartmouth.edu/",
        "location": "",
        "graduation_year": "2029",
        "degree": "Bachelor of Arts: Computer Science and Human Centered Design",
        "gpa": "3.88 / 4.0",
        "coursework": (
            "Data Structures & Algorithms, Software Design & Implementation, "
            "Discrete Mathematics, Foundations of Applied Computer Science, "
            "Calculus III, Intro to Programming"
        ),
        "activities": (
            "ColorStack (Treasurer), HealthX Lab (ML Research), CodePath, "
            "First-Gen Office (CS Teaching Assistant)"
        ),
        "award": "AI in the Physical World Award, DALI Technigala Hackathon 2026, for Sema Health AI",
        "is_current": True,
        "order": 0,
    },
    {
        "institution": "Ilboru High School",
        "url": "",
        "location": "Arusha",
        "graduation_year": "2023",
        "degree": "",
        "gpa": "4.0 / 4.0",
        "coursework": "Physics, Chemistry, Mathematics",
        "activities": "STEM Club General Secretary, Web Dev, Hackathons, Lab Assistant",
        "award": "",
        "is_current": False,
        "order": 1,
    },
]

SKILLS = [
    # Languages
    {"name": "Python", "icon": "fab fa-python", "category": "language", "rating": 5, "order": 0},
    {"name": "Java", "icon": "fab fa-java", "category": "language", "rating": 4, "order": 1},
    {"name": "C", "icon": "fab fa-cuttlefish", "category": "language", "rating": 4, "order": 2},
    {"name": "JavaScript", "icon": "fab fa-js", "category": "language", "rating": 4, "order": 3},
    {"name": "TypeScript", "icon": "fab fa-js", "category": "language", "rating": 3, "order": 4},
    {"name": "Dart", "icon": "fas fa-code", "category": "language", "rating": 3, "order": 5},
    {"name": "SQL", "icon": "fas fa-database", "category": "language", "rating": 4, "order": 6},
    {"name": "HTML/CSS", "icon": "fab fa-html5", "category": "language", "rating": 5, "order": 7},
    # Frameworks
    {"name": "Django", "icon": "fas fa-leaf", "category": "framework", "rating": 5, "order": 8},
    {"name": "Flask", "icon": "fas fa-flask", "category": "framework", "rating": 5, "order": 9},
    {"name": "React", "icon": "fab fa-react", "category": "framework", "rating": 4, "order": 10},
    {"name": "Node.js", "icon": "fab fa-node-js", "category": "framework", "rating": 4, "order": 11},
    {"name": "Flutter", "icon": "fas fa-mobile-screen", "category": "framework", "rating": 3, "order": 12},
    {"name": "Tailwind CSS", "icon": "fas fa-wind", "category": "framework", "rating": 5, "order": 13},
    {"name": "Bootstrap", "icon": "fab fa-bootstrap", "category": "framework", "rating": 4, "order": 14},
    {"name": "NumPy", "icon": "fas fa-square-root-variable", "category": "framework", "rating": 3, "order": 15},
    {"name": "pandas", "icon": "fas fa-table", "category": "framework", "rating": 4, "order": 16},
    {"name": "scikit-learn", "icon": "fas fa-diagram-project", "category": "framework", "rating": 3, "order": 17},
    {"name": "TensorFlow", "icon": "fas fa-brain", "category": "framework", "rating": 3, "order": 18},
    # Tools
    {"name": "Git", "icon": "fab fa-git-alt", "category": "tool", "rating": 5, "order": 19},
    {"name": "AWS", "icon": "fab fa-aws", "category": "tool", "rating": 4, "order": 20},
    {"name": "Linux", "icon": "fab fa-linux", "category": "tool", "rating": 4, "order": 21},
    {"name": "MySQL", "icon": "fas fa-database", "category": "tool", "rating": 4, "order": 22},
    {"name": "bash", "icon": "fas fa-terminal", "category": "tool", "rating": 4, "order": 23},
    {"name": "Make", "icon": "fas fa-gears", "category": "tool", "rating": 3, "order": 24},
    {"name": "Valgrind", "icon": "fas fa-bug", "category": "tool", "rating": 3, "order": 25},
    {"name": "VS Code", "icon": "fas fa-code", "category": "tool", "rating": 5, "order": 26},
    {"name": "IntelliJ IDEA", "icon": "fas fa-laptop-code", "category": "tool", "rating": 4, "order": 27},
    {"name": "Figma", "icon": "fa-brands fa-figma", "category": "tool", "rating": 3, "order": 28},
    {"name": "Miniconda", "icon": "fas fa-cube", "category": "tool", "rating": 3, "order": 29},
    {"name": "APIs", "icon": "fas fa-plug", "category": "tool", "rating": 5, "order": 30},
    {"name": "Tailscale", "icon": "fas fa-network-wired", "category": "tool", "rating": 3, "order": 31},
]

PROJECTS = [
    {
        "name": "Edupayy",
        "description": "A comprehensive student billing and fee management system for educational institutions, streamlining financial workflows from invoicing to payment tracking and reporting.",
        "url": "https://edupayy-railway.onrender.com/",
        "code_url": "https://github.com/gcl140/edupayy-railway",
        "tech": ["Django", "APIs"],
        "type": "fullstack",
        "year": "2024",
        "image": "https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
        "featured": True,
    },
    {
        "name": "ForumAbroad",
        "description": "A community-driven platform for students navigating international opportunities, featuring discussion forums, resource sharing, and AI-powered answer discovery.",
        "url": "https://tztoabroad.tech/",
        "code_url": "https://github.com/gcl140/abroad-forum",
        "tech": ["Django", "APIs"],
        "type": "fullstack",
        "year": "2024",
        "image": "https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    },
    {
        "name": "Maghettoni",
        "description": "A student-focused housing platform helping university students find and book rooms near campuses with location-based search and distance filtering.",
        "url": "https://maghettoni.com/",
        "code_url": "https://github.com/gcl140/maghettoni.com",
        "tech": ["Django", "APIs"],
        "type": "fullstack",
        "year": "2025",
        "image": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    },
    {
        "name": "TanSAF Application Portal",
        "description": "A multi-step online application system for scholarship programs with form validation, user authentication, admin review tools, and dynamic progress saving.",
        "url": "https://apply.tansaf.or.tz/",
        "code_url": "https://github.com/gcl140/TanSAF-Application-Portal",
        "tech": ["Django", "MySQL"],
        "type": "django",
        "year": "2024",
        "image": "https://github.com/gcl140/gcl140.github.io/blob/main/images/tansaf.png?raw=true",
    },
    {
        "name": "Office Social",
        "description": "A full-stack social platform for the Office communities with member discovery, posts, connections, and rich profiles.",
        "url": "https://maghettoni.pythonanywhere.com/",
        "code_url": "https://github.com/gcl140/dali_social",
        "tech": ["Django", "APIs", "Tailwind CSS"],
        "type": "fullstack",
        "year": "2024",
        "image": "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80",
    },
    {
        "name": "Dad Jokes",
        "description": "A Django-based web application for sharing and enjoying dad jokes with custom styling, likes, comments, and social authentication.",
        "url": "https://tansafapply.pythonanywhere.com//",
        "code_url": "https://github.com/gcl140/dadjokes",
        "tech": ["Django", "APIs"],
        "type": "fullstack",
        "year": "2024",
        "image": "https://dadblog.co.uk/wp-content/uploads/2024/09/91-best-worst-dad-jokes.jpg",
    },
    {
        "name": "Climate Research",
        "description": "A web-based research presentation platform assessing youth knowledge on climate change mitigation effectiveness.",
        "url": "https://climatenyouth.netlify.app/",
        "code_url": "https://github.com/gcl140/climate-research",
        "tech": [],
        "type": "frontend",
        "year": "2024",
        "image": "https://images.unsplash.com/photo-1584266463340-53b684c6ee9c?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        "name": "Eversource; Evergreen AI",
        "description": "A web-based ML training platform to power generative AI and build on decades of Dartmouth research on student wellness.",
        "url": "https://eversource.dartmouth.edu/",
        "code_url": "https://github.com/Dartmouth-Evergreen/EvergreenTranscript",
        "tech": ["Flask", "APIs"],
        "type": "fullstack",
        "year": "2024",
        "image": "https://evergreenai.dartmouth.edu/files/2025/08/Vector.png",
    },
    {
        "name": "CS01 Projects",
        "description": "Collection of programming projects from Dartmouth's CS 1 course including graphics, algorithms, and interactive applications.",
        "url": "https://github.com/gcl140/cs01",
        "code_url": "https://projectpython.net/",
        "tech": [],
        "type": "academic",
        "year": "2025",
        "image": "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80",
    },
    {
        "name": "GOD.GOALS.GLORY",
        "description": "A full-featured Django-based e-commerce platform designed for managing products, orders, reviews, testimonials, and user accounts.",
        "url": "https://beingthatguy.com/",
        "code_url": "https://github.com/gcl140/god.goals.glory",
        "tech": ["Django", "Tailwind CSS"],
        "type": "fullstack",
        "year": "2025",
        "image": "https://beingthatguy.com/static/images/run.jpg",
    },
    {
        "name": "pdf-reader",
        "description": "A powerful and user-friendly PDF reader designed to help students and professionals efficiently manage their reading assignments and documents.",
        "url": "https://gcl.pythonanywhere.com/",
        "code_url": "https://github.com/gcl140/pdf-reader",
        "tech": ["Django", "Tailwind CSS"],
        "type": "fullstack",
        "year": "2025",
        "image": "https://www.narakeet.com/assets/howto/2023-03-26-pdf-audio-reader-poster.png",
    },
    {
        "name": "IG-Post-Generator",
        "description": "A powerful auto posting tool designed to help users efficiently manage their Instagram posts and engagement with daily posts for reels.",
        "url": "https://www.instagram.com/__meimez/",
        "code_url": "https://github.com/gcl140/igmimz",
        "tech": ["APIs"],
        "type": "fullstack",
        "year": "2025",
        "image": "https://cdn.prod.website-files.com/64baacfcb337b7364622226f/66fc3cec142d82d7e94725fb_styled-instagram-icon.jpg",
    },
]

INTERESTS = [
    {
        "name": "Soccer",
        "description": "Soccer is simple, but it is difficult to play simple... As an amateur, I often wish it were the former.",
        "icon": "fas fa-futbol",
        "image_url": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80",
    },
    {
        "name": "Amapiano",
        "description": "South African beats' vibes are just unmatched. 'Dzungu' (you fly, man!)",
        "icon": "fas fa-music",
        "image_url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80",
    },
    {
        "name": "Board Games",
        "description": "I like cards. But I may teach you a game, and you'd still beat me to it.",
        "icon": "fas fa-chess",
        "image_url": "https://cdn.thewirecutter.com/wp-content/media/2023/06/cardgames-2048px-9173-2x1-1.jpg?width=2048&quality=75&crop=2:1&auto=webp",
    },
    {
        "name": "Drumming",
        "description": "Started on a practice pad, now I can't hear a song without tapping out the groove.",
        "icon": "fas fa-drum",
        "image_url": "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80",
    },
    {
        "name": "Anime",
        "description": '"My soldiers RAGEEEEEE!"',
        "icon": "fas fa-tv",
        "image_url": "https://preview.redd.it/why-do-so-many-people-hate-eren-yaeger-and-what-would-make-v0-zyem4dlyltkd1.png?width=640&crop=smart&auto=webp&s=c4004752d10d3ecf58ee9306f241835961b1acb4",
    },
]


class Command(BaseCommand):
    help = "Seed the database with the current portfolio content."

    def add_arguments(self, parser):
        parser.add_argument(
            "--skip-images",
            action="store_true",
            help="Skip downloading interest images (faster, useful offline).",
        )

    def handle(self, *args, **options):
        self.seed_education()
        self.seed_skills()
        skill_map = {s.name: s for s in Skill.objects.all()}
        self.seed_projects(skill_map)
        self.seed_interests(skip_images=options["skip_images"])
        self.seed_contact_info()
        self.seed_profile()
        self.stdout.write(self.style.SUCCESS("Seed complete."))

    def seed_education(self):
        for data in EDUCATION:
            Education.objects.update_or_create(
                institution=data["institution"], defaults=data
            )
        self.stdout.write(f"  education: {len(EDUCATION)}")

    def seed_skills(self):
        for data in SKILLS:
            Skill.objects.update_or_create(name=data["name"], defaults=data)
        self.stdout.write(f"  skills: {len(SKILLS)}")

    def seed_projects(self, skill_map):
        for order, data in enumerate(PROJECTS):
            tech = data.pop("tech")
            featured = data.pop("featured", False)
            project, _ = Project.objects.update_or_create(
                name=data["name"],
                defaults={
                    "description": data["description"],
                    "url": data["url"],
                    "code_url": data["code_url"],
                    "image": data["image"],
                    "project_type": data["type"],
                    "year": data["year"],
                    "is_featured": featured,
                    "order": order,
                },
            )
            project.skills.set([skill_map[name] for name in tech if name in skill_map])
        self.stdout.write(f"  projects: {len(PROJECTS)}")

    def seed_interests(self, skip_images=False):
        for order, data in enumerate(INTERESTS):
            interest, _ = Interest.objects.update_or_create(
                name=data["name"],
                defaults={
                    "description": data["description"],
                    "icon": data["icon"],
                    "order": order,
                },
            )
            if skip_images or interest.image:
                continue
            try:
                resp = requests.get(data["image_url"], timeout=15)
                resp.raise_for_status()
                filename = f"{data['name'].lower().replace(' ', '-')}.jpg"
                interest.image.save(
                    filename, ContentFile(io.BytesIO(resp.content).read()), save=True
                )
                self.stdout.write(f"  downloaded image for {data['name']}")
            except Exception as exc:  # pragma: no cover
                self.stdout.write(
                    self.style.WARNING(
                        f"  could not download image for {data['name']}: {exc}"
                    )
                )
        self.stdout.write(f"  interests: {len(INTERESTS)}")

    def seed_contact_info(self):
        ContactInfo.objects.update_or_create(
            pk=1,
            defaults={
                "email": "christiangift44@gmail.com",
                "phone": "+1 603 322 0842",
                "github_url": "https://github.com/gcl140",
                "linkedin_url": "https://linkedin.com/in/giftchristian",
                "instagram_url": "https://instagram.com/gcl.140",
            },
        )
        self.stdout.write("  contact info: ready")

    def seed_profile(self):
        profile = Profile.load()
        profile.start_year = 2021
        profile.happy_clients = 8

        if not profile.photo:
            photo_path = APP_STATIC / "images" / "prof.jpeg"
            if photo_path.exists():
                profile.photo.save(
                    "prof.jpeg", ContentFile(photo_path.read_bytes()), save=False
                )
                self.stdout.write("  uploaded profile photo")
            else:
                self.stdout.write(
                    self.style.WARNING(f"  prof.jpeg not found at {photo_path}")
                )

        if not profile.resume:
            resume_path = APP_STATIC / "files" / "resume.pdf"
            if resume_path.exists():
                profile.resume.save(
                    "Gift_Christian_Resume.pdf",
                    ContentFile(resume_path.read_bytes()),
                    save=False,
                )
                self.stdout.write("  uploaded resume")
            else:
                self.stdout.write(
                    self.style.WARNING(f"  resume.pdf not found at {resume_path}")
                )

        profile.save()
        self.stdout.write("  profile: ready")
