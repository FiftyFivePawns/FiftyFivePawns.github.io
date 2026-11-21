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

// News posts live in news.json so they can be added or deleted without
// touching this page (see admin.html). Without a file, the empty state stays.
const newsFeed = document.getElementById('news-feed')
const newsEmpty = document.getElementById('news-empty')

const formatPostDate = (value) => {
  const date = new Date(`${value}T00:00:00Z`)
  if (!value || Number.isNaN(date.getTime())) return value || ''
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

const buildPost = (post) => {
  const article = document.createElement('article')
  article.className = 'post'

  const meta = document.createElement('p')
  meta.className = 'post-meta'

  const time = document.createElement('time')
  time.className = 'post-date'
  if (post.date) time.dateTime = post.date
  time.textContent = formatPostDate(post.date)
  meta.append(time)

  if (post.tag) {
    const tag = document.createElement('span')
    tag.className = 'post-tag'
    tag.textContent = post.tag
    meta.append(tag)
  }

  const text = document.createElement('p')
  text.className = 'post-text'
  text.textContent = post.text

  article.append(meta, text)
  return article
}

if (newsFeed) {
  try {
    const response = await fetch('news.json', { cache: 'no-store' })
    if (!response.ok) throw new Error(`news.json returned ${response.status}`)
    const data = await response.json()
    const posts = (Array.isArray(data.posts) ? data.posts : [])
      .filter((post) => post && post.text)
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))

    if (posts.length) {
      const fragment = document.createDocumentFragment()
      posts.forEach((post) => fragment.append(buildPost(post)))
      newsFeed.replaceChildren(fragment)
      newsFeed.hidden = false
      if (newsEmpty) newsEmpty.hidden = true
    }
  } catch (error) {
    console.warn('News could not be loaded:', error)
  }
}
