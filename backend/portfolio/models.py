from django.db import models


class Skill(models.Model):
    CATEGORY_CHOICES = [
        ("language", "Language"),
        ("framework", "Framework"),
        ("tool", "Tool"),
    ]

    name = models.CharField(max_length=60, unique=True)
    icon = models.CharField(
        max_length=60, help_text="Font Awesome class, e.g. 'fab fa-python'"
    )
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    rating = models.PositiveSmallIntegerField(
        default=3, help_text="1-5, how strong this skill is"
    )
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return self.name


class Education(models.Model):
    institution = models.CharField(max_length=120)
    url = models.URLField(blank=True)
    location = models.CharField(max_length=120, blank=True)
    graduation_year = models.CharField(max_length=20)
    degree = models.CharField(max_length=200, blank=True)
    gpa = models.CharField(max_length=30, blank=True)
    coursework = models.TextField(blank=True, help_text="Comma-separated list")
    activities = models.TextField(blank=True, help_text="Comma-separated list")
    award = models.CharField(max_length=255, blank=True)
    is_current = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "-graduation_year"]

    def __str__(self):
        return f"{self.institution} ({self.graduation_year})"


class Project(models.Model):
    TYPE_CHOICES = [
        ("fullstack", "Full-stack"),
        ("django", "Django"),
        ("frontend", "Frontend"),
        ("academic", "Academic"),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField()
    url = models.URLField(help_text="Live URL, often a subdomain of giftchristian.dev")
    code_url = models.URLField("code URL", blank=True)
    image = models.URLField(help_text="Cover image URL")
    project_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="fullstack")
    year = models.CharField(max_length=4)
    skills = models.ManyToManyField(Skill, related_name="projects", blank=True)
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "-year", "name"]

    def __str__(self):
        return self.name


class Interest(models.Model):
    name = models.CharField(max_length=60)
    description = models.TextField()
    icon = models.CharField(max_length=60, help_text="Font Awesome class")
    image = models.ImageField(upload_to="interests/")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return self.name


class ContactInfo(models.Model):
    """Singleton: the one row of live contact details the site reads from."""

    email = models.EmailField(default="christiangift44@gmail.com")
    phone = models.CharField(max_length=30, default="+1 603 322 0842")
    github_url = models.URLField(default="https://github.com/gcl140")
    linkedin_url = models.URLField(default="https://linkedin.com/in/giftchristian")
    instagram_url = models.URLField(default="https://instagram.com/gcl.140")

    class Meta:
        verbose_name = "Contact info"
        verbose_name_plural = "Contact info"

    def __str__(self):
        return "Contact info"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class AboutMe(models.Model):
    """Singleton: the About section's role/location card and bio copy."""

    role = models.CharField(max_length=120, default="SDE Intern, Evergreen AI")
    location = models.CharField(max_length=120, default="Hanover, NH")
    bio = models.TextField(
        help_text="Separate paragraphs with a blank line.",
        default="",
    )

    class Meta:
        verbose_name = "About me"
        verbose_name_plural = "About me"

    def __str__(self):
        return "About me"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class Profile(models.Model):
    """Singleton: the handful of numbers the About section displays."""

    start_year = models.PositiveIntegerField(
        default=2021, help_text="Used to compute 'years of experience'"
    )
    happy_clients = models.PositiveIntegerField(default=8)
    photo = models.ImageField(upload_to="profile/", blank=True)
    resume = models.FileField(upload_to="resume/", blank=True)

    class Meta:
        verbose_name = "Profile"
        verbose_name_plural = "Profile"

    def __str__(self):
        return "Profile"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class ContactMessage(models.Model):
    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=30, blank=True)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    emailed = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} <{self.email}> @ {self.created_at:%Y-%m-%d %H:%M}"
