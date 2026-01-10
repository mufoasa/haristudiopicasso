// Main JavaScript for HairStudio Picasso

// Declare variables here
var translations, teamData, galleryImages, servicesData
var currentLang = "sq"

// DOM Elements - will be set after DOM loads
var navbar, navToggle, navMenu, langButtons, bookingForm, successModal, closeModalBtn

// Initialize website when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("[v0] DOM loaded, translations available:", typeof translations !== "undefined")
  console.log("[v0] teamData available:", typeof teamData !== "undefined")
  console.log("[v0] galleryImages available:", typeof galleryImages !== "undefined")
  console.log("[v0] servicesData available:", typeof servicesData !== "undefined")

  // Get DOM elements
  navbar = document.getElementById("navbar")
  navToggle = document.getElementById("navToggle")
  navMenu = document.getElementById("navMenu")
  langButtons = document.querySelectorAll(".lang-btn")
  bookingForm = document.getElementById("bookingForm")
  successModal = document.getElementById("successModal")
  closeModalBtn = document.getElementById("closeModal")

  console.log("[v0] Found langButtons:", langButtons.length)

  // Initialize all components
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

// gemini dog


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
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active")
      navMenu.classList.toggle("active")
      document.body.style.overflow = navMenu.classList.contains("active") ? "hidden" : ""
    })
  }

  // Close menu on link click
  var navLinks = navMenu.querySelectorAll("a")
  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", () => {
      navToggle.classList.remove("active")
      navMenu.classList.remove("active")
      document.body.style.overflow = ""
    })
  }
}

// Language switcher functionality
function initLanguageSwitcher() {
  console.log("[v0] Initializing language switcher with", langButtons.length, "buttons")

  for (var i = 0; i < langButtons.length; i++) {
    ;((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        var lang = btn.getAttribute("data-lang")
        console.log("[v0] Language button clicked:", lang)

        if (lang && lang !== currentLang) {
          currentLang = lang
          console.log("[v0] Changing language to:", currentLang)

          // Update active button
          for (var j = 0; j < langButtons.length; j++) {
            langButtons[j].classList.remove("active")
          }
          btn.classList.add("active")

          // Update HTML lang attribute
          document.documentElement.lang = lang

          // Update all content
          updateLanguage()
        }
      })
    })(langButtons[i])
  }
}

// Update all text content to current language
function updateLanguage() {
  console.log("[v0] Updating language to:", currentLang)

  if (typeof translations === "undefined") {
    console.log("[v0] ERROR: translations not defined")
    return
  }

  var t = translations[currentLang]
  if (!t) {
    console.log("[v0] ERROR: No translations for language:", currentLang)
    return
  }

  console.log("[v0] Found translations for", currentLang, "with keys:", Object.keys(t).length)

  // Update all elements with data-translate attribute
  var elements = document.querySelectorAll("[data-translate]")
  console.log("[v0] Found", elements.length, "elements to translate")

  for (var i = 0; i < elements.length; i++) {
    var key = elements[i].getAttribute("data-translate")
    if (t[key]) {
      elements[i].textContent = t[key]
    }
  }

  // Re-render dynamic content
  renderServices()
  renderTeam()
  populateServiceSelect()
}

// Render services section
function renderServices() {
  var servicesGrid = document.getElementById("servicesGrid")

  if (!servicesGrid) {
    console.log("[v0] servicesGrid not found")
    return
  }

  if (typeof translations === "undefined" || typeof servicesData === "undefined") {
    console.log("[v0] translations or servicesData not available")
    return
  }

  var t = translations[currentLang]
  if (!t) return

  var html = ""
  for (var i = 0; i < servicesData.length; i++) {
    var service = servicesData[i]
    html +=
      '<div class="service-card animate-on-scroll">' +
      '<div class="service-icon">' +
      service.icon +
      "</div>" +
      '<h3 class="service-title">' +
      (t[service.titleKey] || service.titleKey) +
      "</h3>" +
      '<p class="service-description">' +
      (t[service.descKey] || service.descKey) +
      "</p>" +
      '<div class="service-price">' +
      service.price +
      " <span>MKD</span>" +
      '<div style="font-size: 12px; margin-top: 5px;">' +
      (t["services.from"] || "From") +
      "</div>" +
      "</div>" +
      "</div>"
  }
  servicesGrid.innerHTML = html
  initScrollAnimations()
}

function renderGallery() {
  var galleryGrid = document.getElementById("galleryGrid");

  if (!galleryGrid) {
    console.log("[v0] galleryGrid not found");
    return;
  }

  if (typeof galleryImages === "undefined") {
    console.log("[v0] galleryImages not available");
    return;
  }

  var html = "";
  for (var i = 0; i < galleryImages.length; i++) {
    var item = galleryImages[i];
    html += '<div class="gallery-item animate-on-scroll">';
    
    if (item.type === "image") {
      html += `<img src="${item.url}" alt="Gallery image ${i + 1}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x400?text=Image'">`;
    } else if (item.type === "video") {
      html += `
        <video autoplay muted loop playsinline width="100%" onerror="this.poster='https://via.placeholder.com/400x400?text=Video'">
          <source src="${item.url}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `;
    }

    html += `
      <div class="gallery-overlay">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="11" y1="8" x2="11" y2="14"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
      </div>
    </div>`;
  }

  galleryGrid.innerHTML = html;
  initScrollAnimations();
}



// Render team section
function renderTeam() {
  var teamGrid = document.getElementById("teamGrid")

  if (!teamGrid) {
    console.log("[v0] teamGrid not found")
    return
  }

  if (typeof translations === "undefined" || typeof teamData === "undefined") {
    console.log("[v0] translations or teamData not available")
    return
  }

  var t = translations[currentLang]
  if (!t) return

  console.log("[v0] Rendering team with", teamData.length, "members")

  var html = ""
  for (var i = 0; i < teamData.length; i++) {
    var member = teamData[i]
    html +=
      '<div class="team-member animate-on-scroll">' +
      '<div class="team-image">' +
      '<img src="' +
      member.image +
      '" alt="' +
      member.name +
      '" loading="lazy" onerror="this.src=\'https://via.placeholder.com/400x500?text=' +
      encodeURIComponent(member.name) +
      "'\">" +
      "</div>" +
      '<h3 class="team-name">' +
      member.name +
      "</h3>" +
      '<p class="team-role">' +
      (t[member.roleKey] || member.roleKey) +
      "</p>" +
      "</div>"
  }
  teamGrid.innerHTML = html
  initScrollAnimations()
}

// Populate service select dropdown
function populateServiceSelect() {
  var serviceSelect = document.getElementById("service")

  if (!serviceSelect) return

  if (typeof translations === "undefined" || typeof servicesData === "undefined") return

  var t = translations[currentLang]
  if (!t) return

  // Keep the first option (placeholder) and update its text
  var firstOption = serviceSelect.querySelector('option[value=""]')
  if (firstOption) {
    firstOption.textContent = t["booking.selectService"] || "Select a service"
  }

  // Remove existing service options
  var existingOptions = serviceSelect.querySelectorAll('option:not([value=""])')
  for (var i = 0; i < existingOptions.length; i++) {
    existingOptions[i].remove()
  }

  // Add service options
  for (var j = 0; j < servicesData.length; j++) {
    var service = servicesData[j]
    var option = document.createElement("option")
    option.value = service.id
    option.textContent = (t[service.titleKey] || service.titleKey) + " - " + service.price + " MKD"
    serviceSelect.appendChild(option)
  }
}

// Initialize form validation
function initFormValidation() {
  if (!bookingForm) return

  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault()

    var t = translations[currentLang]
    var isValid = true

    // Clear previous errors
    var errorElements = document.querySelectorAll(".error-message")
    for (var i = 0; i < errorElements.length; i++) {
      errorElements[i].textContent = ""
    }

    // Validate name
    var name = document.getElementById("name")
    if (!name.value.trim()) {
      document.getElementById("nameError").textContent = t["booking.errorName"] || "Please enter your name"
      isValid = false
    }

    // Validate phone
    var phone = document.getElementById("phone")
    if (!phone.value.trim()) {
      document.getElementById("phoneError").textContent = t["booking.errorPhone"] || "Please enter your phone"
      isValid = false
    }

    // Validate service
    var service = document.getElementById("service")
    if (!service.value) {
      document.getElementById("serviceError").textContent = t["booking.errorService"] || "Please select a service"
      isValid = false
    }

    if (isValid) {
      // Show success modal
      successModal.classList.add("active")
      bookingForm.reset()
    }
  })

  // Close modal
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      successModal.classList.remove("active")
    })
  }

  // Close modal on outside click
  if (successModal) {
    successModal.addEventListener("click", (e) => {
      if (e.target === successModal) {
        successModal.classList.remove("active")
      }
    })
  }
}

// Initialize scroll animations
function initScrollAnimations() {
  var animatedElements = document.querySelectorAll(".animate-on-scroll")

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      (entries) => {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            entries[i].target.classList.add("visible")
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    for (var j = 0; j < animatedElements.length; j++) {
      observer.observe(animatedElements[j])
    }
  } else {
    // Fallback for older browsers
    for (var k = 0; k < animatedElements.length; k++) {
      animatedElements[k].classList.add("visible")
    }
  }
}

// Initialize smooth scroll for anchor links
function initSmoothScroll() {
  var anchors = document.querySelectorAll('a[href^="#"]')

  for (var i = 0; i < anchors.length; i++) {
    anchors[i].addEventListener("click", function (e) {
      e.preventDefault()
      var targetId = this.getAttribute("href")
      var target = document.querySelector(targetId)

      if (target) {
        var navHeight = navbar ? navbar.offsetHeight : 0
        var targetPosition = target.offsetTop - navHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  }
}
