import './style.css'

document.documentElement.classList.add('js')

// Solid header once the page scrolls away from the hero top.
const header = document.querySelector('.site-header')
const onScroll = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 24)
}
onScroll()
window.addEventListener('scroll', onScroll, { passive: true })

// Mobile navigation.
const nav = document.querySelector('.nav')
const toggle = document.querySelector('.nav-toggle')

const closeNav = () => {
  nav.classList.remove('is-open')
  toggle.setAttribute('aria-expanded', 'false')
  toggle.textContent = 'Menu'
}

toggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open')
  toggle.setAttribute('aria-expanded', String(isOpen))
  toggle.textContent = isOpen ? 'Close' : 'Menu'
})

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeNav)
})

// Fade sections in as they arrive, unless the visitor asked for less motion.
const reveals = document.querySelectorAll('.reveal')
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (reduceMotion || !('IntersectionObserver' in window)) {
  reveals.forEach((el) => el.classList.add('is-visible'))
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  )
  reveals.forEach((el) => observer.observe(el))
}

document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = String(new Date().getFullYear())
})
