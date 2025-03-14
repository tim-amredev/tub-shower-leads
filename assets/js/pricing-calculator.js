document.addEventListener("DOMContentLoaded", () => {
  const calculatorForm = document.getElementById("bathroom-calculator")
  const estimateResults = document.getElementById("estimate-results")

  if (calculatorForm && estimateResults) {
    // Initially hide the results
    estimateResults.style.display = "none"

    calculatorForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const bathroomSize = Number.parseFloat(document.getElementById("bathroom-size").value)
      const projectType = document.getElementById("project-type").value
      const fixtureQuality = document.getElementById("fixture-quality").value
      const tileType = document.getElementById("tile-type").value
      const includeTub = document.querySelector('input[name="include-tub"]:checked').value
      const includeShower = document.querySelector('input[name="include-shower"]:checked').value
      const zipCode = document.getElementById("zip-code").value

      // Calculate estimates based on inputs
      const estimates = calculateBathroomEstimate(
        bathroomSize,
        projectType,
        fixtureQuality,
        tileType,
        includeTub,
        includeShower,
        zipCode,
      )

      // Update the DOM with calculated values
      document.getElementById("low-estimate").textContent = "$" + estimates.lowEstimate.toLocaleString()
      document.getElementById("high-estimate").textContent = "$" + estimates.highEstimate.toLocaleString()
      document.getElementById("material-cost").textContent = "$" + estimates.materialCost.toLocaleString()
      document.getElementById("labor-cost").textContent = "$" + estimates.laborCost.toLocaleString()
      document.getElementById("sqft-cost").textContent = "$" + estimates.costPerSqFt.toFixed(2)

      // Show the results
      estimateResults.style.display = "block"

      // Scroll to results
      estimateResults.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }
})

function calculateBathroomEstimate(
  bathroomSize,
  projectType,
  fixtureQuality,
  tileType,
  includeTub,
  includeShower,
  zipCode,
) {
  // Base material costs per square foot
  const materialCosts = {
    "full-remodel": { low: 40, high: 100 },
    "tub-shower-only": { low: 25, high: 75 },
    "shower-only": { low: 20, high: 60 },
    "tub-only": { low: 15, high: 50 },
  }

  // Fixture quality multipliers
  const qualityMultipliers = {
    economy: { low: 0.8, high: 0.8 },
    standard: { low: 1.0, high: 1.0 },
    premium: { low: 1.3, high: 1.5 },
    luxury: { low: 1.8, high: 2.5 },
  }

  // Tile type multipliers
  const tileMultipliers = {
    ceramic: { low: 0.8, high: 0.9 },
    porcelain: { low: 1.0, high: 1.1 },
    "natural-stone": { low: 1.3, high: 1.5 },
    glass: { low: 1.4, high: 1.6 },
    custom: { low: 1.5, high: 2.0 },
  }

  // Get the selected material cost range
  const selectedProject = materialCosts[projectType] || materialCosts["full-remodel"]
  const qualityMultiplier = qualityMultipliers[fixtureQuality] || qualityMultipliers["standard"]
  const tileMultiplier = tileMultipliers[tileType] || tileMultipliers["ceramic"]

  // Calculate base material costs
  const lowMaterialCost = bathroomSize * selectedProject.low * qualityMultiplier.low * tileMultiplier.low
  const highMaterialCost = bathroomSize * selectedProject.high * qualityMultiplier.high * tileMultiplier.high

  // Base labor costs per square foot
  const laborCostPerSqFt = { low: 30, high: 70 }

  // Calculate labor costs
  const lowLaborCost = bathroomSize * laborCostPerSqFt.low
  const highLaborCost = bathroomSize * laborCostPerSqFt.high

  // Additional costs for tub and shower
  let additionalCosts = 0

  // Add cost for tub
  if (includeTub === "yes") {
    if (fixtureQuality === "economy") {
      additionalCosts += 700 // Basic tub
    } else if (fixtureQuality === "standard") {
      additionalCosts += 1500 // Standard tub
    } else if (fixtureQuality === "premium") {
      additionalCosts += 3000 // Premium tub
    } else if (fixtureQuality === "luxury") {
      additionalCosts += 5000 // Luxury tub (e.g., freestanding)
    }
  }

  // Add cost for shower
  if (includeShower === "yes") {
    if (fixtureQuality === "economy") {
      additionalCosts += 800 // Basic shower
    } else if (fixtureQuality === "standard") {
      additionalCosts += 1800 // Standard shower
    } else if (fixtureQuality === "premium") {
      additionalCosts += 3500 // Premium shower
    } else if (fixtureQuality === "luxury") {
      additionalCosts += 6000 // Luxury shower (e.g., frameless glass)
    }
  }

  // Regional adjustment based on zip code
  // This is a simplified example - in a real application, you would have a database of regional cost factors
  let regionalFactor = 1.0
  const firstDigit = Number.parseInt(zipCode.charAt(0))

  // Simple regional adjustment based on first digit of zip code
  if (firstDigit >= 0 && firstDigit <= 9) {
    const regionalFactors = [1.1, 0.9, 0.95, 1.0, 1.05, 0.9, 0.85, 1.15, 1.2, 1.1]
    regionalFactor = regionalFactors[firstDigit]
  }

  // Calculate total estimates
  const lowEstimate = Math.round((lowMaterialCost + lowLaborCost + additionalCosts) * regionalFactor)
  const highEstimate = Math.round((highMaterialCost + highLaborCost + additionalCosts) * regionalFactor)

  // Calculate average material and labor costs for display
  const avgMaterialCost = Math.round(((lowMaterialCost + highMaterialCost) / 2 + additionalCosts / 2) * regionalFactor)
  const avgLaborCost = Math.round(((lowLaborCost + highLaborCost) / 2 + additionalCosts / 2) * regionalFactor)

  // Calculate cost per square foot
  const avgCostPerSqFt = (lowEstimate + highEstimate) / (2 * bathroomSize)

  return {
    lowEstimate: lowEstimate,
    highEstimate: highEstimate,
    materialCost: avgMaterialCost,
    laborCost: avgLaborCost,
    costPerSqFt: avgCostPerSqFt,
  }
}

