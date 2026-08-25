from django.urls import path

from . import views

urlpatterns = [
    path("education/", views.education, name="education"),
    path("skills/", views.skills, name="skills"),
    path("projects/", views.projects, name="projects"),
    path("interests/", views.interests, name="interests"),
    path("contact-info/", views.contact_info, name="contact-info"),
    path("stats/", views.stats, name="stats"),
    path("contact/", views.contact_message, name="contact-message"),
]
