// The page and the API are served by the same Django app now, so this is
// just relative paths - no cross-origin fetches, no CORS to worry about.
const API_BASE_URL = "";

// App State
const state = {
  projects: [],
  filteredProjects: [],
  currentFilter: "all",
  activeSection: "header",

  // Pagination states
  projectsPerPage: 6,
  currentProjectsPage: 1,
  totalProjectsPages: 1,

  skillsPerPage: 9,
  currentSkillsPage: 1,
  totalSkillsPages: 1,

  experiencePerPage: 3,
  currentExperiencePage: 1,
  totalExperiencePages: 1,
};

// Populated from the backend on load (see loadPortfolioData below).
let skills = [];
let githubProjects = [];
let interests = [];
let education = [];

// Technical terms to highlight
const technicalTerms = [
  // Programming Languages
  "Python",
  "JavaScript",
  "Django",
  "Flask",
  "HTMX",
  "PyTorch",
  // Web Technologies
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Tailwind",
  "WebSockets",
  "Redis",
  "REST",
  "RESTful",
  "APIs",
  "API",
  "CI/CD",
  "Git",
  "GitHub Actions",
  // Databases & Storage
  "PostgreSQL",
  "MariaDB",
  "MySQL",
  "Amazon RDS",
  "SQL",
  "localStorage",
  // Cloud & DevOps
  "AWS",
  "EC2",
  "AWS EC2",
  "Oracle Cloud",
  "cPanel",
  "Nginx",
  "Gunicorn",
  "Linux",
  "SSL",
  // Frameworks & Libraries
  "Django CMS",
  "server-side rendering",
  "async",
  // Security & Auth
  "CSRF protection",
  "role-based authentication",
  "authentication",
  // Other Technical Terms
  "full-stack",
  "frontend",
  "backend",
  "deployment",
  "e-commerce",
  "CMS",
  "dashboards",
  "real-time",
  // Miscellaneous
  "dartmouth-langchain",
  "Stripe",
  "Colorstack",
  "tech",
  "technical",
  // Evergreen AI / newspaper tooling
  "AWS RDS MySQL",
  "JSON",
  "MinHash",
  "locality-sensitive hashing",
  "duckduckgo-search",
  "LDAP",
  "LinkedIn",
  "pandas",
  "OpenPyXL",
  "API rate-limiting",
];

// Function to highlight technical terms in text
function highlightTechnicalTerms(text) {
  let result = text;
  // Sort by length descending to match longer phrases first
  const sortedTerms = [...technicalTerms].sort((a, b) => b.length - a.length);

  sortedTerms.forEach((term) => {
    // Create a case-insensitive regex that matches whole words/phrases
    const regex = new RegExp(`\\b(${term})\\b`, "gi");
    result = result.replace(regex, '<b class="font-semibold text-ink">$1</b>');
  });

  return result;
}

// Experience data
const experiences = [
  {
    period: "Apr 2026 - Present",
    title: "Software Development Intern",
    company: "The Dartmouth (America's Oldest College Newspaper)",
    location: "Hanover, NH",
    type: "Campus Job",
    current: true,
    bullets: [
      "Built a Python automation tool collecting 2,000+ alumni contact records across 50+ class years with the duckduckgo-search library, LDAP, and LinkedIn lookups, exporting structured datasets with pandas and OpenPyXL at 90% accuracy",
      "Engineered fault-tolerant batch processing with checkpoint resumability, deduplication, and API rate-limiting, enabling the scraping to run for hours and resume seamlessly even after interruptions while preserving data integrity",
    ],
  },
  {
    period: "Oct 2025 - Present",
    title: "Software Engineering Intern & Project Manager",
    company: "Evergreen AI, Dartmouth College",
    location: "Hanover, NH",
    type: "Campus Job",
    current: true,
    bullets: [
      "Built and maintained a Flask web app that ingests, validates, and sanitizes 1,000+ dialogue turns daily from 200+ student writers for training Evie, Dartmouth's wellness LLM chatbot, persisting versioned data in AWS RDS MySQL",
      "Introduced a real-time dialogue chat platform using WebSockets, incremental JSON message synchronization, post-send editing, and enforced minimum turn count before automated conversion into standardized training dialogue format",
      "Engineered a plagiarism-detection pipeline using MinHash signatures and locality-sensitive hashing to flag near-duplicate dialogues with similarity greater than 70% asynchronously on submission, protecting training-data integrity",
      "Collaborated to build a red-teaming sandbox enabling selected student writers to probe Evie's safety guardrails through live conversations, logging reproducible, severity-rated findings that informed fixes before production deployment",
      "Enhanced user engagement by introducing Evie-themed Dino and Daily Wordle games with live weekly-reset leaderboards, API-driven word generation, and a client-side break timer using localStorage to avoid unnecessary database requests",
    ],
  },
  {
    period: "Oct 2025 - Present",
    title: "ColorStack First Year Representative",
    company: "Dartmouth ColorStack Chapter",
    location: "Hanover, NH",
    type: "Leadership",
    current: true,
    bullets: [
      "Advocating for 20+ first-year students at Dartmouth in ColorStack chapter meetings; improved tech-mentoring initiatives that focused on community building, professional development, and peer support for underrepresented students in CS by 30%",
      "Organized 3+ technical workshops and networking events, connecting 200+ members with mentorship and internship opportunities, resulting in 70% of participants securing networking and internship opportunities",
    ],
  },
  {
    period: "Jul 2025 - Sep 2025",
    title: "Software Development Intern",
    company: "North and Beyond Heights",
    location: "Dar es Salaam",
    type: "Internship",
    current: false,
    bullets: [
      "Developed a self-editable Django CMS utilizing Python programming with secure role-based authentication, cutting operational costs by 70% while supporting 20+ weekly content updates",
      "Designed a responsive, intuitive Tailwind CSS frontend that reduced content publishing time by 70%; deployed on cPanel with MariaDB, SSL configuration, and automated backups for 99%+ uptime",
    ],
  },
  {
    period: "Dec 2024 - Jul 2025",
    title: "Software Development Intern",
    company: "Tanzania Students' Achievement Foundation",
    location: "Dar es Salaam, Tanzania",
    type: "Internship",
    current: false,
    bullets: [
      "Built an admissions portal on Django with role-based authentication and CSRF protection, improving application processing efficiency by 60% for 300+ applicants, while also operating within a secure Linux environment",
      "Engineered an HTMX staff dashboard with server-side rendering, which increased review throughput by 60% for 20+ reviewers and streamlined document management workflow",
      "Deployed the solution on cPanel with MariaDB integration to ensure reliable hosting and secure data access for multiple admission cycles",
    ],
  },
  {
    period: "Apr 2025 - Jun 2025",
    title: "Software Development Freelancer",
    company: "Being That Guy",
    location: "Arusha, Tanzania",
    type: "Freelance",
    current: false,
    bullets: [
      "Built a full-stack Django e-commerce platform integrating Django RESTful APIs with PostgreSQL and real-time order tracking, supporting 50+ active users and 30+ orders per month; incorporated elements of PyTorch for data handling where applicable",
      "Developed a responsive, minimalist Tailwind storefront featuring an automated GitHub actions CI/CD pipeline to Oracle Cloud that reduced deployment time by 60% with zero manual intervention",
    ],
  },
];

// interests, githubProjects, and skills are fetched from the backend
// (loadPortfolioData, near the bottom of this file) instead of hardcoded here.

// Function to render education
function renderEducation() {
  const container = document.getElementById("educationContainer");
  if (!container) return;

  container.innerHTML = "";

  education.forEach((edu) => {
    const dotClass = edu.current ? "border-amber" : "border-wire";
    const dotInner = edu.current
      ? '<div class="w-1.5 h-1.5 rounded-full bg-amber"></div>'
      : "";
    const heading = edu.location
      ? `${edu.institution}, ${edu.location}, ${edu.graduationYear}`
      : `${edu.institution}, ${edu.graduationYear}`;
    const headingHtml = edu.url
      ? `<a href="${edu.url}" target="_blank" class="hover:text-amber transition-colors">${heading}</a>`
      : heading;

    const lines = [];
    if (edu.degree) lines.push(edu.degree);
    if (edu.gpa) lines.push(`<b class="text-graphite">GPA:</b> ${edu.gpa}`);
    if (edu.coursework.length)
      lines.push(
        `<b class="text-graphite">Coursework:</b> ${edu.coursework.join(", ")}`
      );
    if (edu.activities.length)
      lines.push(
        `<b class="text-graphite">Activities:</b> ${edu.activities.join(", ")}`
      );
    if (edu.award) lines.push(`<b class="text-graphite">Award:</b> ${edu.award}`);

    const item = document.createElement("div");
    item.className = "flex gap-5";
    item.innerHTML = `
      <div class="mt-2 flex-shrink-0 w-3 h-3 border ${dotClass} bg-cream rounded-full flex items-center justify-center">
        ${dotInner}
      </div>
      <div class="flex-1">
        <h5 class="text-xl sm:text-2xl font-semibold mb-2 text-ink">${headingHtml}</h5>
        <p class="text-mute leading-relaxed">${lines.join("<br />")}</p>
      </div>
    `;
    container.appendChild(item);
  });
}

// Function to render projects
function renderProjects() {
  const projectsContainer = document.getElementById("projectsContainer");
  if (!projectsContainer) return;

  projectsContainer.innerHTML = "";

  // Calculate pagination
  const startIdx = (state.currentProjectsPage - 1) * state.projectsPerPage;
  const endIdx = startIdx + state.projectsPerPage;
  const projectsToShow = githubProjects.slice(startIdx, endIdx);
  state.totalProjectsPages = Math.ceil(
    githubProjects.length / state.projectsPerPage
  );

  projectsToShow.forEach((project, i) => {
    const isFeatured = state.currentProjectsPage === 1 && i === 0;

    const projectCard = document.createElement("div");
    projectCard.className = `flex flex-col gap-5 group cursor-pointer h-full${
      isFeatured ? " md:col-span-2 md:flex-row md:items-center md:gap-8" : ""
    }`;
    projectCard.onclick = () => window.open(project.url, "_blank");

    projectCard.innerHTML = `
                    <div class="overflow-hidden rounded-lg relative h-56 ${
                      isFeatured ? "md:h-72 md:w-1/2 shrink-0" : ""
                    }">
                        <img
                            src="${project.image}"
                            alt="${project.name}"
                            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onerror="this.src='https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80'"
                        />
                        <div class="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div class="flex flex-col gap-2 flex-1">
                        <div class="flex items-center justify-between gap-3">
                            <h5 class="text-xl sm:text-2xl font-semibold text-ink group-hover:text-amber transition-colors">
                                ${project.name}
                            </h5>
                            <svg class="w-7 h-7 text-mute group-hover:text-amber transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                            </svg>
                        </div>
                        <p class="text-mute text-sm sm:text-base line-clamp-4">${
                          project.description
                        }</p>
                        <div class="flex flex-wrap gap-2 mt-2">
                            ${project.tech
                              .slice(0, 3)
                              .map(
                                (tech) => `
                                <span class="px-3 py-1 bg-ink text-xs sm:text-sm text-paper rounded-full">${tech}</span>
                            `
                              )
                              .join("")}
                        </div>
                    </div>
                `;

    projectsContainer.appendChild(projectCard);
  });

  // Update pagination info
  updateProjectsPagination();
}

// Function to update projects pagination UI
function updateProjectsPagination() {
  const prevBtn = document.getElementById("prevProjectsBtn");
  const nextBtn = document.getElementById("nextProjectsBtn");
  const pageInfo = document.getElementById("projectsPageInfo");

  if (prevBtn) prevBtn.disabled = state.currentProjectsPage === 1;
  if (nextBtn)
    nextBtn.disabled = state.currentProjectsPage === state.totalProjectsPages;
  if (pageInfo)
    pageInfo.textContent = `Page ${state.currentProjectsPage} of ${state.totalProjectsPages}`;
}

// Function to change projects page
function changeProjectsPage(direction) {
  const newPage = state.currentProjectsPage + direction;
  if (newPage >= 1 && newPage <= state.totalProjectsPages) {
    state.currentProjectsPage = newPage;
    renderProjects();
    // Scroll to projects section
    document
      .getElementById("projectsContainer")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Function to render skills
function renderSkills() {
  const skillsContainer = document.getElementById("skillsContainer");
  if (!skillsContainer) return;

  skillsContainer.innerHTML = "";

  // Calculate pagination
  const startIdx = (state.currentSkillsPage - 1) * state.skillsPerPage;
  const endIdx = startIdx + state.skillsPerPage;
  const skillsToShow = skills.slice(startIdx, endIdx);
  state.totalSkillsPages = Math.ceil(skills.length / state.skillsPerPage);

  skillsToShow.forEach((skill) => {
    const skillCard = document.createElement("div");
    skillCard.className =
      "border border-wire bg-cream rounded-lg p-6 flex flex-col gap-8 items-center justify-between hover:border-amber transition-colors duration-300 h-full";

    // Use the skill's actual rating
    const rating = skill.rating || 3;

    skillCard.innerHTML = `
                    <div class="flex flex-col items-center gap-4">
                        <i class="${skill.icon} text-4xl sm:text-5xl text-amber"></i>
                        <div class="text-center">
                            <p class="text-base sm:text-lg font-medium text-ink">${
                              skill.name
                            }</p>
                            <p class="font-mono text-[11px] text-mute mt-0.5">${
                              skill.category
                            }</p>
                        </div>
                    </div>
                    <div class="flex gap-1">
                        ${Array(5)
                          .fill(0)
                          .map(
                            (_, i) => `
                            <div class="w-2 h-2 rounded-full ${
                              i < rating ? "bg-amber" : "bg-wire"
                            }"></div>
                        `
                          )
                          .join("")}
                    </div>
                `;

    skillsContainer.appendChild(skillCard);
  });

  // Update pagination info
  updateSkillsPagination();
}

// Function to update skills pagination UI
function updateSkillsPagination() {
  const prevBtn = document.getElementById("prevSkillsBtn");
  const nextBtn = document.getElementById("nextSkillsBtn");
  const pageInfo = document.getElementById("skillsPageInfo");

  if (prevBtn) prevBtn.disabled = state.currentSkillsPage === 1;
  if (nextBtn)
    nextBtn.disabled = state.currentSkillsPage === state.totalSkillsPages;
  if (pageInfo)
    pageInfo.textContent = `Page ${state.currentSkillsPage} of ${state.totalSkillsPages}`;
}

// Function to change skills page
function changeSkillsPage(direction) {
  const newPage = state.currentSkillsPage + direction;
  if (newPage >= 1 && newPage <= state.totalSkillsPages) {
    state.currentSkillsPage = newPage;
    renderSkills();
    // Scroll to skills section
    document
      .getElementById("skillsContainer")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Function to render experience
function renderExperience() {
  const experienceContainer = document.getElementById("experienceContainer");
  if (!experienceContainer) return;

  experienceContainer.innerHTML = "";

  // Calculate pagination
  const startIdx = (state.currentExperiencePage - 1) * state.experiencePerPage;
  const endIdx = startIdx + state.experiencePerPage;
  const experienceToShow = experiences.slice(startIdx, endIdx);
  state.totalExperiencePages = Math.ceil(
    experiences.length / state.experiencePerPage
  );

  experienceToShow.forEach((exp, index) => {
    const experienceItem = document.createElement("div");
    experienceItem.className =
      "flex flex-col lg:grid lg:grid-cols-3 gap-5 lg:gap-8";

    const statusPill = exp.current
      ? '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-moss/15 text-moss font-mono text-[11px] tracking-wide"><span class="w-1.5 h-1.5 rounded-full bg-moss animate-blink"></span>live</span>'
      : '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-wire/40 text-mute font-mono text-[11px] tracking-wide"><i class="fas fa-check text-[9px]"></i>complete</span>';

    const timelineDotClass = exp.current ? "border-amber" : "border-wire";
    const timelineDotInnerClass = exp.current
      ? "w-1.5 h-1.5 rounded-full bg-amber"
      : "w-1.5 h-1.5 rounded-full";

    experienceItem.innerHTML = `
            <div class="lg:col-span-1">
              <h3 class="text-2xl sm:text-3xl font-bold mb-2 text-ink">${
                exp.period
              }</h3>
              <h4 class="text-lg sm:text-xl font-normal text-mute mb-2">${
                exp.title
              }</h4>
              ${statusPill}
            </div>

            <div class="lg:col-span-1 ${
              index < experienceToShow.length - 1 ? "timeline-line" : ""
            } pl-7 relative">
              <div class="absolute left-0 top-0 -translate-x-1/2 w-3.5 h-3.5 ${timelineDotClass} bg-cream rounded-full flex items-center justify-center border">
                <div class="${timelineDotInnerClass}"></div>
              </div>
              <div>
                <span class="text-xl block mb-1 text-ink font-medium">${
                  exp.company
                }</span>
                <p class="text-mute text-base">${exp.location}</p>
                <p class="text-mute text-sm mt-1">${exp.type}</p>
              </div>
            </div>

            <div class="lg:col-span-1 lg:pl-8">
              <ul class="space-y-3 experience-bullets-${startIdx + index}">
                ${exp.bullets
                  .map(
                    (bullet, bulletIndex) => `
                  <li class="text-mute text-base leading-relaxed flex gap-2 ${
                    bulletIndex > 0 ? "hidden" : ""
                  } bullet-item">
                    <span class="text-amber mt-1.5 flex-shrink-0">•</span>
                    <span>${highlightTechnicalTerms(bullet)}</span>
                  </li>
                `
                  )
                  .join("")}
              </ul>
              ${
                exp.bullets.length > 1
                  ? `
                <button
                  class="read-more-btn mt-4 text-amber hover:text-ink transition-colors duration-300 font-medium flex items-center gap-2"
                  onclick="toggleExperienceDescription(${startIdx + index})"
                >
                  <span class="read-more-text">Read more</span>
                  <svg class="w-4 h-4 transition-transform duration-300 read-more-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
              `
                  : ""
              }
            </div>
          `;

    experienceContainer.appendChild(experienceItem);
  });

  // Update pagination info
  updateExperiencePagination();
}

// Function to update experience pagination UI
function updateExperiencePagination() {
  const prevBtn = document.getElementById("prevExperienceBtn");
  const nextBtn = document.getElementById("nextExperienceBtn");
  const pageInfo = document.getElementById("experiencePageInfo");

  if (prevBtn) prevBtn.disabled = state.currentExperiencePage === 1;
  if (nextBtn)
    nextBtn.disabled =
      state.currentExperiencePage === state.totalExperiencePages;
  if (pageInfo)
    pageInfo.textContent = `Page ${state.currentExperiencePage} of ${state.totalExperiencePages}`;
}

// Function to change experience page
function changeExperiencePage(direction) {
  const newPage = state.currentExperiencePage + direction;
  if (newPage >= 1 && newPage <= state.totalExperiencePages) {
    state.currentExperiencePage = newPage;
    renderExperience();
    // Scroll to experience section
    document
      .getElementById("experienceContainer")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Function to toggle experience description
function toggleExperienceDescription(index) {
  const bulletsContainer = document.querySelector(
    `.experience-bullets-${index}`
  );
  if (!bulletsContainer) return;

  const bullets = bulletsContainer.querySelectorAll(".bullet-item");
  const button = bulletsContainer.parentElement.querySelector(".read-more-btn");
  const buttonText = button.querySelector(".read-more-text");
  const buttonIcon = button.querySelector(".read-more-icon");

  // Check if currently expanded
  const isExpanded = bullets[1] && !bullets[1].classList.contains("hidden");

  // Toggle all bullets except the first one
  bullets.forEach((bullet, idx) => {
    if (idx > 0) {
      bullet.classList.toggle("hidden");
    }
  });

  // Update button text and icon
  if (isExpanded) {
    buttonText.textContent = "Read more";
    buttonIcon.style.transform = "rotate(0deg)";
  } else {
    buttonText.textContent = "Read less";
    buttonIcon.style.transform = "rotate(180deg)";
  }
}

// Function to render interests
function renderInterests() {
  const interestsContainer = document.getElementById("interestsContainer");
  if (!interestsContainer) return;

  // Target the grid div inside the container
  const gridContainer = interestsContainer.querySelector(".grid");
  if (!gridContainer) return;

  gridContainer.innerHTML = "";

  interests.forEach((interest) => {
    const interestCard = document.createElement("div");
    interestCard.className =
      "group h-full bg-cream rounded-lg overflow-hidden border border-wire hover:border-amber transition-all duration-300 cursor-pointer";

    interestCard.innerHTML = `
            <div class="relative overflow-hidden h-64 sm:h-72">
              <img
                src="${interest.image}"
                alt="${interest.name}"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onerror="this.src='https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80'"
              />
              <!-- Title overlay - always visible -->
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/85 to-transparent p-6 transition-opacity duration-300 group-hover:opacity-0">
                <div class="flex items-center gap-3 text-white">
                  <i class="${interest.icon} text-2xl"></i>
                  <h5 class="text-xl sm:text-2xl font-semibold">
                    ${interest.name}
                  </h5>
                </div>
              </div>
              <!-- Description overlay - visible on hover -->
              <div class="absolute inset-0 bg-ink/80 p-6 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="text-center text-white space-y-4">
                  <i class="${interest.icon} text-4xl"></i>
                  <h5 class="text-xl sm:text-2xl font-bold">
                    ${interest.name}
                  </h5>
                  <p class="text-sm sm:text-base leading-relaxed">${interest.description}</p>
                </div>
              </div>
            </div>
          `;

    gridContainer.appendChild(interestCard);
  });
}

// Function to toggle interests visibility
function toggleInterests() {
  const container = document.getElementById("interestsContainer");
  const toggleText = document.getElementById("interestsToggleText");
  const toggleIcon = document.getElementById("interestsToggleIcon");
  const isHidden = container.classList.contains("hidden");

  if (isHidden) {
    container.classList.remove("hidden");
    toggleText.textContent = "Hide interests";
    toggleIcon.style.transform = "rotate(180deg)";
    // Render interests on first open - check the grid div
    const gridContainer = container.querySelector(".grid");
    if (gridContainer && gridContainer.children.length === 0) {
      renderInterests();
    }
    // Smooth scroll to interests
    setTimeout(() => {
      container.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  } else {
    container.classList.add("hidden");
    toggleText.textContent = "Show interests";
    toggleIcon.style.transform = "rotate(0deg)";
  }
}

// Skeleton loaders: shown the instant the page loads, replaced the moment
// each render*() function runs (they all clear innerHTML before rebuilding).
function skeletonBlock(classes) {
  return `<div class="skeleton rounded-md ${classes}"></div>`;
}

function renderEducationSkeleton(count = 2) {
  const el = document.getElementById("educationContainer");
  if (!el) return;
  el.innerHTML = Array.from({ length: count })
    .map(
      () => `
        <div class="flex gap-5">
          ${skeletonBlock("w-3 h-3 rounded-full mt-2 flex-shrink-0")}
          <div class="flex-1 flex flex-col gap-2">
            ${skeletonBlock("h-6 w-2/3")}
            ${skeletonBlock("h-4 w-full")}
            ${skeletonBlock("h-4 w-5/6")}
          </div>
        </div>
      `
    )
    .join("");
}

function renderProjectsSkeleton(count = 3) {
  const el = document.getElementById("projectsContainer");
  if (!el) return;
  el.innerHTML = Array.from({ length: count })
    .map(
      () => `
        <div class="flex flex-col gap-5 h-full">
          ${skeletonBlock("h-56 w-full")}
          <div class="flex flex-col gap-2">
            ${skeletonBlock("h-6 w-2/3")}
            ${skeletonBlock("h-4 w-full")}
            ${skeletonBlock("h-4 w-5/6")}
          </div>
        </div>
      `
    )
    .join("");
}

function renderSkillsSkeleton(count = 9) {
  const el = document.getElementById("skillsContainer");
  if (!el) return;
  el.innerHTML = Array.from({ length: count })
    .map(
      () => `
        <div class="border border-wire bg-cream rounded-lg p-6 flex flex-col gap-8 items-center h-full">
          ${skeletonBlock("h-10 w-10 rounded-full")}
          ${skeletonBlock("h-4 w-20")}
        </div>
      `
    )
    .join("");
}

function renderExperienceSkeleton(count = 2) {
  const el = document.getElementById("experienceContainer");
  if (!el) return;
  el.innerHTML = Array.from({ length: count })
    .map(
      () => `
        <div class="flex flex-col lg:grid lg:grid-cols-3 gap-5 lg:gap-8">
          <div class="flex flex-col gap-2">
            ${skeletonBlock("h-7 w-3/4")}
            ${skeletonBlock("h-5 w-1/2")}
          </div>
          <div class="flex flex-col gap-2 pl-7">
            ${skeletonBlock("h-5 w-2/3")}
            ${skeletonBlock("h-4 w-1/2")}
          </div>
          <div class="flex flex-col gap-2 lg:pl-8">
            ${skeletonBlock("h-4 w-full")}
            ${skeletonBlock("h-4 w-full")}
            ${skeletonBlock("h-4 w-3/4")}
          </div>
        </div>
      `
    )
    .join("");
}

// Fetch education, projects, skills, interests, contact info, and stats
// from the backend, then render everything that depends on them.
async function loadPortfolioData() {
  renderEducationSkeleton();
  renderProjectsSkeleton();
  renderSkillsSkeleton();
  renderExperienceSkeleton();

  const [educationRes, projectsRes, skillsRes, interestsRes, contactRes, statsRes] =
    await Promise.allSettled([
      fetch(`${API_BASE_URL}/api/education/`).then((r) => r.json()),
      fetch(`${API_BASE_URL}/api/projects/`).then((r) => r.json()),
      fetch(`${API_BASE_URL}/api/skills/`).then((r) => r.json()),
      fetch(`${API_BASE_URL}/api/interests/`).then((r) => r.json()),
      fetch(`${API_BASE_URL}/api/contact-info/`).then((r) => r.json()),
      fetch(`${API_BASE_URL}/api/stats/`).then((r) => r.json()),
    ]);

  if (educationRes.status === "fulfilled") education = educationRes.value.results;
  if (projectsRes.status === "fulfilled") githubProjects = projectsRes.value.results;
  if (skillsRes.status === "fulfilled") skills = skillsRes.value.results;
  if (interestsRes.status === "fulfilled") interests = interestsRes.value.results;

  if (
    [educationRes, projectsRes, skillsRes, interestsRes].some(
      (r) => r.status === "rejected"
    )
  ) {
    console.warn(
      "Couldn't reach the backend API at",
      API_BASE_URL,
      "- some sections may be empty. Is the Django server running?"
    );
  }

  renderEducation();
  renderProjects();
  renderSkills();
  renderExperience();

  if (contactRes.status === "fulfilled") applyContactInfo(contactRes.value);
  if (statsRes.status === "fulfilled") applyStats(statsRes.value);
}

// Fill in every element that displays live contact info. Elements that wrap
// an <img> (e.g. the shields.io badges) only get their href updated, not
// their text, so the badge image survives.
function applyContactInfo(info) {
  document.querySelectorAll("[data-contact-email]").forEach((el) => {
    if (!el.querySelector("img")) el.textContent = info.email;
    el.href = `mailto:${info.email}`;
  });
  document.querySelectorAll("[data-contact-phone]").forEach((el) => {
    if (!el.querySelector("img")) el.textContent = info.phone;
    el.href = `tel:${info.phone.replace(/[^+\d]/g, "")}`;
  });
  document.querySelectorAll("[data-contact-github]").forEach((el) => {
    el.href = info.githubUrl;
  });
  document.querySelectorAll("[data-contact-linkedin]").forEach((el) => {
    el.href = info.linkedinUrl;
  });
  document.querySelectorAll("[data-contact-instagram]").forEach((el) => {
    el.href = info.instagramUrl;
  });
}

// Fill in the About section's stat numbers, and swap the resume/photo
// sources over to the backend-served files once they've loaded.
function applyStats(stats) {
  const years = document.getElementById("statYearsExperience");
  const clients = document.getElementById("statHappyClients");
  const projectsCount = document.getElementById("statProjectsCount");
  if (years) years.textContent = stats.yearsExperience;
  if (clients) clients.textContent = stats.happyClients;
  if (projectsCount) projectsCount.textContent = stats.projectsCount;

  if (stats.resumeUrl) window.__resumeUrl = stats.resumeUrl;

  if (stats.photoUrl) {
    document.querySelectorAll("[data-hero-photo]").forEach((img) => {
      img.src = stats.photoUrl;
    });
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  loadPortfolioData();
});

// Mobile nav menu toggle
const navMenuToggle = document.getElementById("navMenuToggle");
const navMenuPanel = document.getElementById("navMenuPanel");
const navMenuIcon = document.getElementById("navMenuIcon");
if (navMenuToggle && navMenuPanel) {
  navMenuToggle.addEventListener("click", () => {
    const isOpen = !navMenuPanel.classList.contains("hidden");
    navMenuPanel.classList.toggle("hidden");
    navMenuToggle.setAttribute("aria-expanded", String(!isOpen));
    navMenuIcon.className = isOpen ? "fas fa-bars text-lg" : "fas fa-xmark text-lg";
  });
  navMenuPanel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenuPanel.classList.add("hidden");
      navMenuToggle.setAttribute("aria-expanded", "false");
      navMenuIcon.className = "fas fa-bars text-lg";
    });
  });
}

// Scroll to Top
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Show/hide back-to-top button once the hero has scrolled out of view.
// Uses IntersectionObserver instead of a scroll listener to avoid main-thread jank.
const backToTopBtn = document.getElementById("backToTopBtn");
const heroSentinel = document.getElementById("heroSentinel");
if (backToTopBtn) {
  backToTopBtn.style.opacity = "0";
  backToTopBtn.style.pointerEvents = "none";
}
if (backToTopBtn && heroSentinel) {
  const backToTopObserver = new IntersectionObserver(
    ([entry]) => {
      const visible = !entry.isIntersecting;
      backToTopBtn.style.opacity = visible ? "1" : "0";
      backToTopBtn.style.pointerEvents = visible ? "auto" : "none";
    },
    { rootMargin: "-300px 0px 0px 0px" }
  );
  backToTopObserver.observe(heroSentinel);
}

// Scroll-reveal for sections, respecting prefers-reduced-motion
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
const revealTargets = document.querySelectorAll(".reveal");
if (prefersReducedMotion) {
  revealTargets.forEach((el) => el.classList.add("is-visible"));
} else if (revealTargets.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealTargets.forEach((el) => revealObserver.observe(el));
}

// Resume preview modal
function openResumeModal() {
  const modal = document.getElementById("resumeModal");
  const frame = document.getElementById("resumeModalFrame");
  if (!modal || !frame) return;

  // Lazy-load the PDF only when the modal is actually opened.
  const url = window.__resumeUrl || "/static/files/resume.pdf";
  if (frame.src !== url) frame.src = url;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";
}

function closeResumeModal() {
  const modal = document.getElementById("resumeModal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.style.overflow = "";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeResumeModal();
});

// Download Resume as PDF
function downloadResumePDF(triggerBtn) {
  const originalContent = triggerBtn ? triggerBtn.innerHTML : null;

  if (triggerBtn) {
    triggerBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin text-sm"></i><span class="ml-2">Downloading...</span>';
    triggerBtn.disabled = true;
  }

  // Create a temporary link to download the PDF file
  const link = document.createElement("a");
  link.href = window.__resumeUrl || "/static/files/resume.pdf";
  link.download = "Gift_Christian_Resume.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if (triggerBtn) {
    setTimeout(() => {
      triggerBtn.innerHTML = originalContent;
      triggerBtn.disabled = false;
    }, 1000);
  }
}

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // stop the form from submitting normally

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  try {
    const res = await fetch(`${API_BASE_URL}/api/contact/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email, message }),
    });

    const data = await res.json();

    Toastify({
      text: data.message,
      duration: 3000,
      gravity: "top",
      position: "right",
      close: true,
      backgroundColor: data.status === "success" ? "green" : "red",
    }).showToast();

    // Optionally, reset the form after successful send
    if (data.status === "success") form.reset();
  } catch (err) {
    Toastify({
      text: "Something went wrong. Try again.",
      duration: 3000,
      gravity: "top",
      position: "right",
      close: true,
      backgroundColor: "red",
    }).showToast();
    console.error(err);
  }
});

form.addEventListener("submit", (e) => {
  const response = grecaptcha.getResponse();

  if (response.length === 0) {
    e.preventDefault();
    Toastify({
      text: "Please complete the reCAPTCHA first!",
      duration: 3000,
      gravity: "top",
      position: "right",
      close: true,
      backgroundColor: "red",
    }).showToast();
  }  else {
    const token = 'what you lookin at?';
    console.log("Form ready to submit with token:", token);
  };
});
