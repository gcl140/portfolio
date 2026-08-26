import json
import re
from datetime import datetime

from django.core.mail import send_mail
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .models import (
    AboutMe,
    ContactInfo,
    ContactMessage,
    Education,
    Interest,
    Profile,
    Project,
    Skill,
)


def home(request):
    return render(request, "index.html")


def _absolute(request, url):
    if not url:
        return ""
    return request.build_absolute_uri(url)


@require_GET
def skills(request):
    data = [
        {
            "id": s.id,
            "name": s.name,
            "icon": s.icon,
            "category": s.category,
            "rating": s.rating,
        }
        for s in Skill.objects.all()
    ]
    return JsonResponse({"results": data})


def _csv_list(text):
    return [item.strip() for item in text.split(",") if item.strip()]


@require_GET
def education(request):
    data = [
        {
            "id": e.id,
            "institution": e.institution,
            "url": e.url,
            "location": e.location,
            "graduationYear": e.graduation_year,
            "degree": e.degree,
            "gpa": e.gpa,
            "coursework": _csv_list(e.coursework),
            "activities": _csv_list(e.activities),
            "award": e.award,
            "current": e.is_current,
        }
        for e in Education.objects.all()
    ]
    return JsonResponse({"results": data})


def _project_image(request, p):
    if p.image_upload:
        return _absolute(request, p.image_upload.url)
    return p.image


@require_GET
def projects(request):
    data = [
        {
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "url": p.url,
            "codeUrl": p.code_url,
            "image": _project_image(request, p),
            "type": p.project_type,
            "year": p.year,
            "featured": p.is_featured,
            "tech": [s.name for s in p.skills.all()],
        }
        for p in Project.objects.prefetch_related("skills").all()
    ]
    return JsonResponse({"results": data})


@require_GET
def interests(request):
    data = [
        {
            "id": i.id,
            "name": i.name,
            "description": i.description,
            "icon": i.icon,
            "image": _absolute(request, i.image.url) if i.image else "",
        }
        for i in Interest.objects.all()
    ]
    return JsonResponse({"results": data})


@require_GET
def about(request):
    info = AboutMe.load()
    # Browsers/admin widgets sometimes submit textarea content with \r\n line
    # endings, so a literal "\n\n" split can silently miss blank lines.
    normalized_bio = info.bio.replace("\r\n", "\n").replace("\r", "\n")
    paragraphs = [p.strip() for p in re.split(r"\n[ \t]*\n+", normalized_bio) if p.strip()]
    return JsonResponse(
        {
            "role": info.role,
            "location": info.location,
            "bio": info.bio,
            "paragraphs": paragraphs,
        }
    )


@require_GET
def contact_info(request):
    info = ContactInfo.load()
    return JsonResponse(
        {
            "email": info.email,
            "phone": info.phone,
            "githubUrl": info.github_url,
            "linkedinUrl": info.linkedin_url,
            "instagramUrl": info.instagram_url,
        }
    )


@require_GET
def stats(request):
    profile = Profile.load()
    years_experience = datetime.now().year - profile.start_year
    return JsonResponse(
        {
            "yearsExperience": years_experience,
            "projectsCount": Project.objects.count(),
            "happyClients": profile.happy_clients,
            "photoUrl": _absolute(request, profile.photo.url) if profile.photo else "",
            "resumeUrl": _absolute(request, profile.resume.url) if profile.resume else "",
        }
    )


@csrf_exempt
@require_POST
def contact_message(request):
    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"status": "error", "message": "Invalid request."}, status=400)

    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip()
    phone = (payload.get("phone") or "").strip()
    message = (payload.get("message") or "").strip()

    if not name or not email or not message:
        return JsonResponse(
            {"status": "error", "message": "Name, email, and message are required."},
            status=400,
        )

    entry = ContactMessage.objects.create(
        name=name, email=email, phone=phone, message=message
    )

    try:
        send_mail(
            subject=f"New message from {name} via giftchristian.me",
            message=(
                f"From: {name} <{email}>\nPhone: {phone or 'n/a'}\n\n{message}"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.CONTACT_TO_EMAIL],
            fail_silently=False,
        )
        entry.emailed = True
        entry.save(update_fields=["emailed"])
    except Exception:
        # Message is safely stored either way; email delivery is best-effort.
        pass

    return JsonResponse({"status": "success", "message": "Message sent. Talk soon!"})
