document.addEventListener("DOMContentLoaded", () => {
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

      // Update result
      priceRange.textContent = "$" + minPrice.toLocaleString() + " - $" + maxPrice.toLocaleString()
      calculatorResult.style.display = "block"
    })
  }
})

