document.addEventListener("DOMContentLoaded", () => {
  // Header scroll effect
  const header = document.querySelector("header")
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled")
      } else {
        header.classList.remove("scrolled")
      }
    })
  }

  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
  const navList = document.querySelector("nav ul")

  if (mobileMenuToggle && navList) {
    mobileMenuToggle.addEventListener("click", () => {
      mobileMenuToggle.classList.toggle("active")
      navList.classList.toggle("active")
    })
  }

  // Quote form submission
  const quoteForm = document.getElementById("quote-form")
  const quoteResult = document.getElementById("quote-result")

  if (quoteForm) {
    quoteForm.addEventListener("submit", (e) => {
      // We'll let FormSubmit handle the form submission
      // This is just for any additional JS functionality
    })
  }

  // Calculator form submission
  const calculatorForm = document.getElementById("calculator-form")
  const calculatorResult = document.getElementById("calculator-result")
  const priceRange = document.getElementById("price-range")

  if (calculatorForm) {
    calculatorForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const bathroomSize = Number.parseInt(document.getElementById("bathroom-size").value)
      const projectType = document.getElementById("project-type").value
      const fixtureQuality = document.getElementById("fixture-quality").value
      const tileType = document.getElementById("tile-type").value

      // Calculate price range
      let pricePerSqFt = {
        min: 0,
        max: 0,
      }

      // Base price by project type
      switch (projectType) {
        case "full-remodel":
          pricePerSqFt = { min: 70, max: 150 }
          break
        case "tub-shower-only":
          pricePerSqFt = { min: 50, max: 120 }
          break
        case "shower-only":
          pricePerSqFt = { min: 40, max: 100 }
          break
        case "tub-only":
          pricePerSqFt = { min: 30, max: 80 }
          break
        default:
          pricePerSqFt = { min: 50, max: 120 }
      }

      // Adjust for quality
      if (fixtureQuality === "economy") {
        pricePerSqFt.min *= 0.8
        pricePerSqFt.max *= 0.8
      } else if (fixtureQuality === "premium") {
        pricePerSqFt.min *= 1.3
        pricePerSqFt.max *= 1.3
      } else if (fixtureQuality === "luxury") {
        pricePerSqFt.min *= 1.8
        pricePerSqFt.max *= 1.8
      }

      // Adjust for tile type
      if (tileType === "natural-stone" || tileType === "glass") {
        pricePerSqFt.min *= 1.2
        pricePerSqFt.max *= 1.2
      } else if (tileType === "custom") {
        pricePerSqFt.min *= 1.4
        pricePerSqFt.max *= 1.4
      }

      // Calculate total price range
      const minPrice = Math.round(bathroomSize * pricePerSqFt.min)
      const maxPrice = Math.round(bathroomSize * pricePerSqFt.max)

      // Update result with animation
      calculatorResult.style.opacity = 0

      setTimeout(() => {
        priceRange.textContent = "$" + minPrice.toLocaleString() + " - $" + maxPrice.toLocaleString()
        calculatorResult.style.display = "block"

        setTimeout(() => {
          calculatorResult.style.opacity = 1
        }, 50)
      }, 300)

      // Smooth scroll to results
      setTimeout(() => {
        calculatorResult.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 350)
    })
  }

  // Form field animations
  const formInputs = document.querySelectorAll("input, select, textarea")

  if (formInputs.length > 0) {
    formInputs.forEach((input) => {
      // Add focus class to parent when input is focused
      input.addEventListener("focus", () => {
        input.parentElement.classList.add("focused")
      })

      // Remove focus class when input loses focus
      input.addEventListener("blur", () => {
        input.parentElement.classList.remove("focused")
      })
    })
  }
})

