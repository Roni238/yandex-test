class MiniSlider {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector)
    if (!this.container) return

    const {
      gridSelector = '.slider-grid',
      autoplay = false,
      autoplayInterval = 4000,
      paginationType = 'dots',
      visibleDesktopCount = 3,
      desktopBreakpoint = 1366
    } = options

    this.grid = this.container.querySelector(gridSelector) || this.container.firstElementChild
    if (!this.grid) return

    this.slides = this.grid.children
    this.prevButtons = this.container.querySelectorAll('.prev-btn')
    this.nextButtons = this.container.querySelectorAll('.next-btn')
    
    this.options = { autoplay, autoplayInterval, paginationType, visibleDesktopCount, desktopBreakpoint }
    this.currentIndex = 0
    this.autoplayTimer = null

    this.init()
  }

  init() {
    this.prevButtons.forEach(btn => btn.addEventListener('click', () => this.prev()))
    this.nextButtons.forEach(btn => btn.addEventListener('click', () => this.next()))

    if (this.options.autoplay) {
      this.startAutoplay()
      this.container.addEventListener('mouseenter', () => this.stopAutoplay())
      this.container.addEventListener('mouseleave', () => this.startAutoplay())
    }

    window.addEventListener('resize', () => this.handleResize())
    this.updateUI()
  }

  get visibleCount() {
    return window.innerWidth >= this.options.desktopBreakpoint ? this.options.visibleDesktopCount : 1
  }

  get maxIndex() {
    return Math.max(0, this.slides.length - this.visibleCount)
  }

  handleResize() {
    this.currentIndex = Math.min(this.currentIndex, this.maxIndex)
    this.move()
  }

  move() {
    if (!this.slides.length) return

    const slideWidth = this.slides[0].offsetWidth
    const gap = parseFloat(window.getComputedStyle(this.grid).gap) || 0
    const offset = this.currentIndex * (slideWidth + gap)
    
    this.grid.style.transform = `translateX(-${offset}px)`
    this.updateUI()
  }

  next() {
    this.currentIndex = this.currentIndex >= this.maxIndex ? 0 : this.currentIndex + 1
    this.move()
  }

  prev() {
    this.currentIndex = this.currentIndex <= 0 ? this.maxIndex : this.currentIndex - 1
    this.move()
  }

  startAutoplay() {
    this.autoplayTimer = setInterval(() => this.next(), this.options.autoplayInterval)
  }

  stopAutoplay() {
    clearInterval(this.autoplayTimer)
  }

  updateUI() {
    if (!this.options.autoplay) {
      this.prevButtons.forEach(btn => btn.disabled = this.currentIndex === 0)
      this.nextButtons.forEach(btn => btn.disabled = this.currentIndex === this.maxIndex)
    }

    if (this.options.paginationType === 'dots') this.updateDots()
    if (this.options.paginationType === 'fraction') this.updateFraction()
  }

  updateDots() {
    const dotsContainer = this.container.querySelector('#sliderDots')
    if (!dotsContainer) return
    
    const dots = dotsContainer.querySelectorAll('.dot')
    dots.forEach((dot, index) => dot.classList.toggle('dot--active', index === this.currentIndex))
  }

  updateFraction() {
    const fractionContainers = this.container.querySelectorAll('.slider-counter')
    if (!fractionContainers.length) return

    const currentStep = this.visibleCount > 1 ? this.currentIndex + this.visibleCount : this.currentIndex + 1
    const totalSteps = this.slides.length

    fractionContainers.forEach(container => container.textContent = `${currentStep}/${totalSteps}`)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MiniSlider('.stages', {
    gridSelector: '.stages__grid',
    paginationType: 'dots',
    autoplay: false,
    visibleDesktopCount: 1
  })

  new MiniSlider('.participants', {
    gridSelector: '.participants__cards-container',
    paginationType: 'fraction',
    autoplay: true,
    autoplayInterval: 4000,
    visibleDesktopCount: 3
  })
})