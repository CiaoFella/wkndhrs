import { bottomClipPath, fullClipPath, isDesktop, isTablet } from '../utilities/variables.js'
import { gsap, ScrollTrigger } from '../vendor.js'

let ctx

function init() {
  const section = document.querySelector('[data-scroll-selected-work=section]')

  if (section) {
    const items = section.querySelectorAll('[data-scroll-selected-work=item]')
    const list = section.querySelector('[data-scroll-selected-work=list]')

    ctx = gsap.context(() => {
      const scrubTl = gsap.timeline()

      ScrollTrigger.create({
        trigger: section,
        animation: scrubTl,
        start: 'top center',
        end: 'top top',
        scrub: 1,
      })

      scrubTl.to(list, { scale: 0.95, duration: 1 })

      items.forEach((item, index) => {
        const headline = item.querySelector('[data-scroll-selected-work=headline]')
        const category = item.querySelector('[data-scroll-selected-work=category]')
        const bg = item.querySelector('[data-scroll-selected-work=bg]')
        const overlay = item.querySelector('[data-scroll-selected-work=overlay]')

        const box = item.querySelector('[data-scroll-selected-work=box]')
        const boxTitle = item.querySelector('[data-scroll-selected-work=box-title]')
        const boxImg = item.querySelector('[data-scroll-selected-work=box-img]')
        const boxVideo = item.querySelector('[data-scroll-selected-work=box-video]')

        // // Variable to store the video element when it's removed
        // let storedBoxVideo = boxVideo

        // // GSAP MatchMedia to handle different viewport sizes
        // mm.add(isTablet, () => {
        //   // Remove boxVideo from the DOM on tablet
        //   if (boxVideo) {
        //     storedBoxVideo = boxVideo // Store the reference
        //     boxVideo.remove() // Remove from DOM
        //   }
        // })

        // mm.add(isDesktop, () => {
        //   // Re-append boxVideo to the DOM on desktop if it was removed
        //   if (storedBoxVideo && !box.contains(storedBoxVideo)) {
        //     box.appendChild(storedBoxVideo) // Re-append to the original parent
        //   }
        // })

        const revealTl = gsap.timeline({
          paused: true,
          defaults: { duration: 1 },
        })

        const hoverTl = gsap.timeline({
          paused: true,
          defaults: { duration: 1 },
        })

        // Animate headline away
        revealTl.set(headline, { yPercent: 100 })
        revealTl.set(category, { yPercent: 100 })
        revealTl.set(items, { pointerEvents: 'none' })

        revealTl
          .set(item, { pointerEvents: 'auto' })
          .fromTo([bg, overlay], { clipPath: bottomClipPath }, { clipPath: fullClipPath, ease: 'expo.inOut' }, '<')
          .fromTo(headline, { yPercent: 100 }, { yPercent: 0, ease: 'expo.inOut' }, '<')
          .fromTo(category, { yPercent: 100 }, { yPercent: 0, ease: 'expo.inOut' }, '<')
          .fromTo(
            [boxImg, boxVideo, boxTitle],
            { clipPath: bottomClipPath },
            { clipPath: fullClipPath, ease: 'expo.inOut' },
            '<'
          )

        // Adjust previous headline
        if (index > 0) {
          const prevHeadline = items[index - 1].querySelector('[data-scroll-selected-work=headline]')
          const prevCategory = items[index - 1].querySelector('[data-scroll-selected-work=category]')
          revealTl
            .fromTo(prevHeadline, { yPercent: 0 }, { yPercent: -100, ease: 'expo.inOut' }, '<')
            .fromTo(prevCategory, { yPercent: 0 }, { yPercent: -100, ease: 'expo.inOut' }, '<')
        }

        const triggerHeight = section.offsetHeight / items.length

        ScrollTrigger.create({
          trigger: section,
          animation: revealTl,
          start: () => `${index * triggerHeight} center`,
          end: 'bottom bottom',
          onEnter: () => {
            const nextItems = [...items].slice(index + 1)
            nextItems.forEach(item => {
              const nextHeadline = item.querySelectorAll('[data-scroll-selected-work=headline]')
              gsap.set(nextHeadline, { yPercent: 100 })
            })
          },
          toggleActions: 'play none none reverse',
          preventOverlaps: true,
        })

        hoverTl.to(boxImg, { opacity: 0, ease: 'expo.inOut' })

        box.addEventListener('mouseenter', () => {
          hoverTl.play()
        })
        box.addEventListener('mouseleave', () => {
          hoverTl.reverse()
        })
      })
    })
  }
}

function cleanup() {
  if (ctx) {
    ctx.revert()
  }
}

export default {
  init,
  cleanup,
}
