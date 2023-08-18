import { type Directive, type DirectiveBinding } from 'vue'
import { type DefaultOptions, type ScrollSpyElement } from './types.ts'
import { Easing, scrollWithAnimation } from './animate.ts'
import { getOffsetTop } from './utils.ts'

interface UseScrollSpyReturnType {
  vScrollSpy: Directive
  vScrollSpyActive: Directive
  vScrollSpyLink: Directive
}

const defaults: DefaultOptions = {
  /**
     * allow no active sections when scroll position is outside
     * of the scroll-spy container. Default behavior is too keep
     * active at least one section in any case.
     */
  allowNoActiveSection: false,
  /** The scrollable container */
  sectionSelector: null,
  /** Callback for index value change **/
  indexChanged: null,
  /** Scroll offset from top */
  offset: 0,
  /** Animation timing */
  time: 500,
  /** Animation increment step  */
  steps: 30,
  /** Animation easing type */
  easing: Easing.Cubic.In,
  /** Active class options */
  active: {
    selector: null,
    class: 'active'
  },
  /** Link options */
  link: {
    selector: 'a'
  }
}

// Element tracking variables.
let scrollSpySections: ScrollSpyElement[] = []
let scrollSpyElement: ScrollSpyElement | null = null
let currentActiveElement: ScrollSpyElement | null
let activatableElements: ScrollSpyElement[] = []
let currentIndex: number | null = null
let lastActiveClass: string

export const useScrollSpy = (options?: Record<string, any>): UseScrollSpyReturnType => {
  const defaultOptions = Object.assign({}, defaults, (options != null) || {})

  // Setup
  const bodyScrollEl = {}
  Object.defineProperty(bodyScrollEl, 'scrollTop', {
    get (): number {
      return document.body.scrollTop || document.documentElement.scrollTop
    },
    set (val): void {
      document.body.scrollTop = val
      document.documentElement.scrollTop = val
    }
  })

  Object.defineProperty(bodyScrollEl, 'scrollHeight', {
    get (): number {
      return document.body.scrollHeight || document.documentElement.scrollHeight
    }
  })

  Object.defineProperty(bodyScrollEl, 'offsetHeight', {
    get (): number {
      return window.innerHeight
    }
  })

  // Utility functions

  const initScrollSpyElement = (el: ScrollSpyElement): ScrollSpyElement => {
    const onScroll = (): void => {

    }
    el.scrollSpyProps = {
      onScroll,
      options: defaultOptions,
      eventEl: el as HTMLElement,
      scrollEl: el as HTMLElement
    }
    return el
  }

  const findElements = (container: HTMLElement, selector: string | null): ScrollSpyElement[] => {
    if (selector == null) {
      return [...container.children].map((el) => {
        return initScrollSpyElement(el as ScrollSpyElement)
      })
    }

    const elements = []

    for (const el of container.querySelectorAll(selector)) {
      elements.push(initScrollSpyElement(el as ScrollSpyElement))
    }

    return elements
  }

  const doScroll = (el: ScrollSpyElement, index: number): void => {
    const { scrollEl, options } = el.scrollSpyProps
    const current = scrollEl.scrollTop

    if (scrollSpySections[index]) {
      const target = getOffsetTop(scrollSpySections[index]) - options.offset

      // If using an animator scroll with it and early exit.
      if (options.easing != null) {
        scrollWithAnimation(
          scrollEl,
          current,
          target,
          options.time,
          options.easing
        )
        return
      }

      // Internet explorer scroll.
      const ua = window.navigator.userAgent
      const msie = ua.indexOf('MSIE ')
      if (msie > 0) {
        const time = options.time
        const steps = options.steps
        const timeMs = time / steps
        const gap = target - current
        for (let i = 0; i <= steps; i++) {
          const pos = current + (gap / steps) * i
          setTimeout(() => {
            scrollEl.scrollTop = pos
          }, timeMs * i)
        }
        return
      }

      // Use window scrollTo behavior for anything else.
      window.scrollTo({
        top: target,
        behavior: 'smooth'
      })
    }
  }

  const scrollLinkClickHandler = (index: number, event: any): void => {
    event.preventDefault()
    if (scrollSpyElement != null) {
      doScroll(scrollSpyElement, index)
    }
  }

  // Init functions
  const initSections = (el: ScrollSpyElement, selector: string | null): void => {
    const scrollSpyContext = el.scrollSpyProps
    scrollSpySections = findElements(el, selector)

    if (
      scrollSpySections[0] &&
            scrollSpySections[0] instanceof HTMLElement &&
            scrollSpySections[0].offsetParent !== el
    ) {
      scrollSpyContext.eventEl = window
      scrollSpyContext.scrollEl = bodyScrollEl as HTMLElement
    }
  }

  const initLink = (el: ScrollSpyElement, selector: string): void => {
    // Find all the link elements based on given selector.
    const links = findElements(el as HTMLElement, selector)

    for (let i = 0; i < links.length; ++i) {
      const linkElement = links[i]

      const listener = scrollLinkClickHandler.bind(null, i)
      if (!linkElement.scrollSpyProps.clickHandler) {
        linkElement.addEventListener('click', listener)
        linkElement.scrollSpyProps.clickHandler = listener
      }
    }
  }

  // Collect all the elements that are eligible to be adorned with the defined `active` class.
  const initActivatableElements = (el: ScrollSpyElement, binding: DirectiveBinding): void => {
    const opts = Object.assign({}, defaultOptions.active, binding.value)

    const elems = [...findElements(el, opts.selector)]
    activatableElements = elems.map((el: ScrollSpyElement) => {
      el.scrollSpyProps.options.active = opts
      return el
    })

    recalculateActive()
  }

  const recalculateActive = (): void => {
    // Remove the class from the previous active element if exists.
    if (currentActiveElement != null) {
      currentActiveElement.classList.remove(lastActiveClass)
      currentActiveElement = null
    }

    // Add the class to the new active element, if exists.
    if (typeof currentIndex !== 'undefined' && Object.keys(activatableElements).length > 0 && currentIndex !== null) {
      currentActiveElement = activatableElements[currentIndex]

      if (currentActiveElement) {
        currentActiveElement.classList.add(currentActiveElement.scrollSpyProps.options.active.class)
        lastActiveClass = currentActiveElement.scrollSpyProps.options.active.class
      }
    }
  }

  // Return the directives.
  return {
    vScrollSpy: {
      created (el: ScrollSpyElement, binding: DirectiveBinding) {
        // onScroll event
        const onScroll = (): void => {
          let index

          const { scrollEl, options } = el.scrollSpyProps

          // Find the current index
          if (
            scrollEl.offsetHeight + scrollEl.scrollTop >=
                        scrollEl.scrollHeight - 10
          ) {
            // Reached end of the spy context
            index = scrollSpySections.length
          } else {
            for (index = 0; index < scrollSpySections.length; index++) {
              if (
                getOffsetTop(scrollSpySections[index], scrollEl) - options.offset >
                                scrollEl.scrollTop
              ) {
                break
              }
            }
          }
          index--

          // Sanity check the index.
          if (index < 0) { // Any number below 0 is either `null` if allowing for no active sections, or 0 for the first encountered section.
            index = options.allowNoActiveSection ? null : 0
          } else if (options.allowNoActiveSection && index >= scrollSpySections.length - 1) { // If we are outside the max sections AND allowing `no active section`, set the index to null.
            const idScrollSection = scrollSpySections[index]
            if (
              idScrollSection instanceof HTMLElement &&
                            getOffsetTop(scrollSpySections[index]) +
                            idScrollSection.offsetHeight <
                            scrollEl.scrollTop
            ) {
              index = null
            }
          }

          if ((!options.allowNoActiveSection && index === 0) || index !== currentIndex) {
            currentIndex = index

            recalculateActive()

            // Trigger callback if available.
            if ((options.indexChanged != null)) {
              options.indexChanged(currentIndex)
            }
          }
        }

        // Setup props for the spy-scroll element itself.
        el.scrollSpyProps = {
          onScroll,
          options: Object.assign({}, defaultOptions, binding.value),
          eventEl: el as HTMLElement,
          scrollEl: el as HTMLElement
        }

        scrollSpyElement = el
        currentIndex = null
      },
      mounted (el: ScrollSpyElement) {
        const { options: { sectionSelector } } = el.scrollSpyProps

        initSections(el, sectionSelector)
        const { eventEl, onScroll } = el.scrollSpyProps
        eventEl.addEventListener('scroll', onScroll)
        onScroll()
      },
      updated (el: ScrollSpyElement, binding: DirectiveBinding) {
        el.scrollSpyProps.options = Object.assign(
          {},
          defaultOptions,
          binding.value
        )

        const { onScroll, options: { sectionSelector } } = el.scrollSpyProps
        initSections(el, sectionSelector)
        onScroll()
      },
      unmounted (el: ScrollSpyElement) {
        const { eventEl, onScroll } = el.scrollSpyProps
        eventEl.removeEventListener('scroll', onScroll)
      },
      getSSRProps () {
        return {
          window: ''
        }
      }
    },
    vScrollSpyActive: {
      created: initActivatableElements,
      updated: initActivatableElements,
      getSSRProps () {
        return {}
      }
    },
    vScrollSpyLink: {
      mounted (el: ScrollSpyElement, binding: DirectiveBinding) {
        const opts = Object.assign({}, defaultOptions.link, binding.value)
        initLink(el, opts.selector)
      },
      updated (el: ScrollSpyElement, binding: DirectiveBinding) {
        const opts = Object.assign({}, defaultOptions.link, binding.value)
        initLink(el, opts.selector)
      },
      unmounted (el) {
        const linkElements: ScrollSpyElement[] = findElements(el, null)

        for (let i = 0; i < linkElements.length; i++) {
          const linkElement: ScrollSpyElement = linkElements[i]
          const listener = scrollLinkClickHandler.bind(null, i)

          if (linkElement.scrollSpyProps.clickHandler) {
            linkElement.removeEventListener('click', listener)
            linkElement.scrollSpyProps.clickHandler = null
          }
        }
      },
      getSSRProps () {
        return {}
      }
    }
  }
}
