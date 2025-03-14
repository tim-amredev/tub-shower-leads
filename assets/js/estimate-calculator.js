document.addEventListener("DOMContentLoaded", () => {
  const estimateForm = document.getElementById("estimate-calculator")
  const estimateResults = document.getElementById("estimate-results")
  const progressFill = document.getElementById("progress-fill")
  const progressSteps = document.querySelectorAll(".progress-step")
  const calculatorSteps = document.querySelectorAll(".calculator-step")
  const nextButtons = document.querySelectorAll(".next-button")
  const backButtons = document.querySelectorAll(".back-button")

  // Initially hide the results
  if (estimateResults) {
    estimateResults.style.display = "none"
  }

  // Handle next button clicks
  if (nextButtons.length > 0) {
    nextButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const currentStep = Number.parseInt(this.closest(".calculator-step").getAttribute("data-step"))
        const nextStep = Number.parseInt(this.getAttribute("data-next"))

        // Validate current step
        if (validateStep(currentStep)) {
          // Hide current step
          document.querySelector(`.calculator-step[data-step="${currentStep}"]`).classList.remove("active")

          // Show next step
          document.querySelector(`.calculator-step[data-step="${nextStep}"]`).classList.add("active")

          // Update progress bar
          updateProgress(nextStep)
        }
      })
    })
  }

  // Handle back button clicks
  if (backButtons.length > 0) {
    backButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const currentStep = Number.parseInt(this.closest(".calculator-step").getAttribute("data-step"))
        const prevStep = Number.parseInt(this.getAttribute("data-back"))

        // Hide current step
        document.querySelector(`.calculator-step[data-step="${currentStep}"]`).classList.remove("active")

        // Show previous step
        document.querySelector(`.calculator-step[data-step="${prevStep}"]`).classList.add("active")

        // Update progress bar
        updateProgress(prevStep)
      })
    })
  }

  // Handle form submission
  if (estimateForm) {
    estimateForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Validate final step
      if (validateStep(4)) {
        // Get form data
        const formData = new FormData(estimateForm)

        // Calculate estimate
        const estimate = calculateEstimate(formData)

        // Update results
        updateResults(estimate)

        // Show results
        estimateResults.style.display = "block"

        // Scroll to results
        estimateResults.scrollIntoView({ behavior: "smooth", block: "start" })

        // Set up consultation button
        document.getElementById("schedule-consultation").addEventListener("click", (e) => {
          e.preventDefault()

          // Redirect to contact page with form data
          const contactUrl = new URL("/contact", window.location.origin)

          // Add form data to URL
          contactUrl.searchParams.append("name", formData.get("name"))
          contactUrl.searchParams.append("email", formData.get("email"))
          contactUrl.searchParams.append("phone", formData.get("phone"))
          contactUrl.searchParams.append("project-type", "Siding Estimate")

          window.location.href = contactUrl.toString()
        })
      }
    })
  }

  // Update progress bar
  function updateProgress(step) {
    // Update progress fill
    if (progressFill) {
      const progressPercentage = ((step - 1) / 3) * 100
      progressFill.style.width = `${progressPercentage}%`
    }

    // Update progress steps
    if (progressSteps.length > 0) {
      progressSteps.forEach((stepEl) => {
        const stepNum = Number.parseInt(stepEl.getAttribute("data-step"))

        if (stepNum <= step) {
          stepEl.classList.add("active")
        } else {
          stepEl.classList.remove("active")
        }
      })
    }
  }

  // Validate step
  function validateStep(step) {
    const currentStep = document.querySelector(`.calculator-step[data-step="${step}"]`)
    const requiredFields = currentStep.querySelectorAll("[required]")
    let isValid = true

    requiredFields.forEach((field) => {
      if (!field.value) {
        field.classList.add("error")
        isValid = false
      } else {
        field.classList.remove("error")
      }
    })

    return isValid
  }

  // Calculate estimate
  function calculateEstimate(formData) {
    // Get form values
    const homeSize = Number.parseFloat(formData.get("home-size"))
    const stories = Number.parseInt(formData.get("stories"))
    const currentSiding = formData.get("current-siding")
    const projectType = formData.get("project-type")
    const newSiding = formData.get("new-siding")
    const sidingQuality = formData.get("siding-quality")
    const additionalServices = formData.getAll("additional-services")
    const zipCode = formData.get("zip-code")

    // Base material costs per square foot
    const materialCosts = {
      vinyl: {
        economy: { low: 3, high: 5 },
        standard: { low: 5, high: 8 },
        premium: { low: 8, high: 12 },
      },
      "fiber-cement": {
        economy: { low: 5, high: 7 },
        standard: { low: 7, high: 10 },
        premium: { low: 10, high: 13 },
      },
      wood: {
        economy: { low: 6, high: 8 },
        standard: { low: 8, high: 12 },
        premium: { low: 12, high: 15 },
      },
      "engineered-wood": {
        economy: { low: 4, high: 6 },
        standard: { low: 6, high: 8 },
        premium: { low: 8, high: 9 },
      },
      metal: {
        economy: { low: 4, high: 7 },
        standard: { low: 7, high: 10 },
        premium: { low: 10, high: 14 },
      },
      "stone-veneer": {
        economy: { low: 10, high: 20 },
        standard: { low: 20, high: 35 },
        premium: { low: 35, high: 50 },
      },
      unsure: {
        economy: { low: 4, high: 7 },
        standard: { low: 7, high: 12 },
        premium: { low: 12, high: 20 },
        unsure: { low: 7, high: 15 },
      },
    }

    // Get the selected material cost range
    const selectedMaterial = materialCosts[newSiding] || materialCosts["unsure"]
    const selectedQuality = selectedMaterial[sidingQuality] || selectedMaterial["standard"]

    // Calculate material costs
    const lowMaterialCost = homeSize * selectedQuality.low
    const highMaterialCost = homeSize * selectedQuality.high

    // Base labor costs per square foot
    const laborCostPerSqFt = { low: 2, high: 5 }

    // Adjust labor costs based on stories
    if (stories === 2) {
      laborCostPerSqFt.low *= 1.2
      laborCostPerSqFt.high *= 1.2
    } else if (stories >= 3) {
      laborCostPerSqFt.low *= 1.4
      laborCostPerSqFt.high *= 1.4
    }

    // Adjust labor costs based on project type
    if (projectType === "partial-replacement") {
      laborCostPerSqFt.low *= 1.1
      laborCostPerSqFt.high *= 1.1
    } else if (projectType === "repair") {
      laborCostPerSqFt.low *= 0.7
      laborCostPerSqFt.high *= 0.7
    }

    // Calculate labor costs
    const lowLaborCost = homeSize * laborCostPerSqFt.low
    const highLaborCost = homeSize * laborCostPerSqFt.high

    // Additional costs
    let additionalCosts = 0
    const includedItems = []

    // Add cost for removing existing siding
    if (currentSiding !== "none" && projectType !== "repair") {
      additionalCosts += homeSize * 1.5 // $1.50 per sq ft for removal
      includedItems.push("Removal of existing siding")
    }

    // Add costs for additional services
    if (additionalServices.includes("insulation")) {
      additionalCosts += homeSize * 2 // $2.00 per sq ft for insulation
      includedItems.push("Insulation installation")
    }

    if (additionalServices.includes("trim")) {
      additionalCosts += homeSize * 0.75 // $0.75 per sq ft for trim
      includedItems.push("Trim replacement")
    }

    if (additionalServices.includes("gutters")) {
      // Estimate perimeter based on square footage
      const estimatedPerimeter = Math.sqrt(homeSize) * 4
      additionalCosts += estimatedPerimeter * 8 // $8 per linear foot for gutters
      includedItems.push("Gutter replacement")
    }

    if (additionalServices.includes("soffit-fascia")) {
      // Estimate perimeter based on square footage
      const estimatedPerimeter = Math.sqrt(homeSize) * 4
      additionalCosts += estimatedPerimeter * 12 // $12 per linear foot for soffit/fascia
      includedItems.push("Soffit and fascia replacement")
    }

    // Always include these items
    includedItems.push("Professional installation")
    includedItems.push("Project cleanup")
    includedItems.push("Manufacturer warranty")
    includedItems.push("Workmanship warranty")

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
    const avgMaterialCost = Math.round(((lowMaterialCost + highMaterialCost) / 2) * regionalFactor)
    const avgLaborCost = Math.round(
      ((lowLaborCost + highLaborCost) / 2) * regionalFactor + additionalCosts * regionalFactor,
    )

    // Calculate cost per square foot
    const avgCostPerSqFt = (lowEstimate + highEstimate) / (2 * homeSize)

    return {
      lowEstimate: lowEstimate,
      highEstimate: highEstimate,
      materialCost: avgMaterialCost,
      laborCost: avgLaborCost,
      costPerSqFt: avgCostPerSqFt,
      includedItems: includedItems,
    }
  }

  // Update results in the DOM
  function updateResults(estimate) {
    document.getElementById("low-estimate").textContent = "$" + estimate.lowEstimate.toLocaleString()
    document.getElementById("high-estimate").textContent = "$" + estimate.highEstimate.toLocaleString()
    document.getElementById("material-cost").textContent = "$" + estimate.materialCost.toLocaleString()
    document.getElementById("labor-cost").textContent = "$" + estimate.laborCost.toLocaleString()
    document.getElementById("sqft-cost").textContent = "$" + estimate.costPerSqFt.toFixed(2)

    // Update included items
    const includedList = document.getElementById("included-items")
    includedList.innerHTML = ""

    estimate.includedItems.forEach((item) => {
      const li = document.createElement("li")
      li.textContent = item
      includedList.appendChild(li)
    })
  }
})

