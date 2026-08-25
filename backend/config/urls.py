import re

from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve as serve_static

from portfolio.views import home

urlpatterns = [
    path("", home, name="home"),
    path("admin/", admin.site.urls),
    path("api/", include("portfolio.urls")),
    # Media (uploaded photos, resume) served by Django itself - there's no
    # nginx in front of this app. Django's own `static()` helper refuses to
    # do this outside DEBUG, so this uses the view it wraps directly. Fine
    # at this traffic level; revisit if that ever changes.
    re_path(
        r"^%s(?P<path>.*)$" % re.escape(settings.MEDIA_URL.lstrip("/")),
        serve_static,
        {"document_root": settings.MEDIA_ROOT},
    ),
]
