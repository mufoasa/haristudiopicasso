// Main JavaScript for HairStudio Picasso

// Current language
let currentLang = "sq"

// DOM Elements
const navbar = document.getElementById("navbar")
const navToggle = document.getElementById("navToggle")
const navMenu = document.getElementById("navMenu")
const langButtons = document.querySelectorAll(".lang-btn")
const bookingForm = document.getElementById("bookingForm")
const successModal = document.getElementById("successModal")
const closeModalBtn = document.getElementById("closeModal")

// Data variables
const translations = {
  sq: {
    "services.from": "Nga",
    "booking.selectService": "Zgjidhni Shërbimin",
    "booking.errorName": "Ju lutem vendosni emrin",
    "booking.errorPhone": "Ju lutem vendosni numrin e telefonit",
    "booking.errorService": "Ju lutem zgjidhni një shërbim",
  },
  en: {
    "services.from": "From",
    "booking.selectService": "Select Service",
    "booking.errorName": "Please enter your name",
    "booking.errorPhone": "Please enter your phone number",
    "booking.errorService": "Please select a service",
  },
}

const servicesData = [
  { id: "1", icon: '<i class="fas fa-cut"></i>', titleKey: "services.cut", descKey: "services.cutDesc", price: "100" },
  {
    id: "2",
    icon: '<i class="fas fa-color"></i>',
    titleKey: "services.color",
    descKey: "services.colorDesc",
    price: "200",
  },
]

const galleryImages = ["image1.jpg", "image2.jpg", "image3.jpg"]

const teamData = [
  { id: "1", name: "Arsim Shasivari", image: "john.jpg", roleKey: "team.hairdresser" },
  { id: "2", name: "Argjend Sulejmani", image: "jane.jpg", roleKey: "team.stylist" },
]

// Initialize website
document.addEventListener("DOMContentLoaded", () => {
  initNavigation()
  initLanguageSwitcher()
  renderServices()
  renderGallery()
  renderTeam()
  populateServiceSelect()
  initFormValidation()
  initScrollAnimations()
  initSmoothScroll()
})

// Navigation functionality
function initNavigation() {
  // Sticky navbar on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })

  // Mobile menu toggle
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active")
    navMenu.classList.toggle("active")
    document.body.style.overflow = navMenu.classList.contains("active") ? "hidden" : ""
  })

  // Close menu on link click
  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("active")
      navMenu.classList.remove("active")
      document.body.style.overflow = ""
    })
  })
}

// Language switcher functionality
function initLanguageSwitcher() {
  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang
      if (lang !== currentLang) {
        currentLang = lang
        updateLanguage()

        // Update active button
        langButtons.forEach((b) => b.classList.remove("active"))
        btn.classList.add("active")

        // Update HTML lang attribute
        document.documentElement.lang = lang
      }
    })
  })
}

// Update all translatable text
function updateLanguage() {
  // Update all elements with data-translate attribute
  document.querySelectorAll("[data-translate]").forEach((element) => {
    const key = element.dataset.translate
    if (translations[currentLang] && translations[currentLang][key]) {
      element.textContent = translations[currentLang][key]
    }
  })

  // Re-render dynamic content
  renderServices()
  renderTeam()
  populateServiceSelect()
}

// Render services section
function renderServices() {
  const servicesGrid = document.getElementById("servicesGrid")
  const t = translations[currentLang]

  servicesGrid.innerHTML = servicesData
    .map(
      (service) => `
    <div class="service-card animate-on-scroll">
      <div class="service-icon">${service.icon}</div>
      <h3 class="service-title">${t[service.titleKey]}</h3>
      <p class="service-description">${t[service.descKey]}</p>
      <div class="service-price">
        ${service.price} <span>MKD</span>
        <div style="font-size: 12px; margin-top: 5px;">${t["services.from"] || "From"}</div>
      </div>
    </div>
  `,
    )
    .join("")

  // Reinitialize scroll animations for new elements
  initScrollAnimations()
}

// Render gallery section
function renderGallery() {
  const galleryGrid = document.getElementById("galleryGrid")

  galleryGrid.innerHTML = galleryImages
    .map(
      (image, index) => `
    <div class="gallery-item animate-on-scroll">
      <img src="${image}" alt="Gallery image ${index + 1}" loading="lazy">
      <div class="gallery-overlay">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
      </div>
    </div>
  `,
    )
    .join("")

  initScrollAnimations()
}

// Render team section
function renderTeam() {
  const teamGrid = document.getElementById("teamGrid")
  const t = translations[currentLang]

  teamGrid.innerHTML = teamData
    .map(
      (member) => `
    <div class="team-member animate-on-scroll">
      <div class="team-image">
        <img src="${member.image}" alt="${member.name}" loading="lazy">
      </div>
      <h3 class="team-name">${member.name}</h3>
      <p class="team-role">${t[member.roleKey]}</p>
    </div>
  `,
    )
    .join("")

  initScrollAnimations()
}

// Populate service select dropdown
function populateServiceSelect() {
  const serviceSelect = document.getElementById("service")
  const t = translations[currentLang]

  // Keep the first option (placeholder)
  const firstOption = serviceSelect.querySelector('option[value=""]')
  firstOption.textContent = t["booking.selectService"]

  // Remove existing service options
  const existingOptions = serviceSelect.querySelectorAll('option:not([value=""])')
  existingOptions.forEach((opt) => opt.remove())

  // Add service options
  servicesData.forEach((service) => {
    const option = document.createElement("option")
    option.value = service.id
    option.textContent = `${t[service.titleKey]} - ${service.price} MKD`
    serviceSelect.appendChild(option)
  })
}

// Form validation
function initFormValidation() {
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const t = translations[currentLang]
    let isValid = true

    // Clear previous errors
    document.querySelectorAll(".error-message").forEach((el) => (el.textContent = ""))

    // Validate name
    const name = document.getElementById("name")
    if (!name.value.trim()) {
      document.getElementById("nameError").textContent = t["booking.errorName"]
      isValid = false
    }

    // Validate phone
    const phone = document.getElementById("phone")
    if (!phone.value.trim()) {
      document.getElementById("phoneError").textContent = t["booking.errorPhone"]
      isValid = false
    }

    // Validate service
    const service = document.getElementById("service")
    if (!service.value) {
      document.getElementById("serviceError").textContent = t["booking.errorService"]
      isValid = false
    }

    if (isValid) {
      // Show success modal
      successModal.classList.add("active")
      bookingForm.reset()
    }
  })

  // Close modal
  closeModalBtn.addEventListener("click", () => {
    successModal.classList.remove("active")
  })

  // Close modal on outside click
  successModal.addEventListener("click", (e) => {
    if (e.target === successModal) {
      successModal.classList.remove("active")
    }
  })
}

// Scroll animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(".animate-on-scroll")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  )

  animatedElements.forEach((el) => observer.observe(el))
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        const navHeight = navbar.offsetHeight
        const targetPosition = target.offsetTop - navHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })
}
