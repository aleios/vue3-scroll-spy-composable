export interface ActiveOptions {
  selector: string | null
  class: string
}

export interface LinkOptions {
  selector: string
}

export interface DefaultOptions {
  allowNoActiveSection: boolean
  sectionSelector: string | null
  data: string | null
  offset: number
  time: number
  steps: 30
  easing: string | null
  active: ActiveOptions
  link: LinkOptions
}

export interface ScrollSpyElement extends HTMLElement {
  scrollSpyProps: {
    onScroll: () => void
    options: DefaultOptions
    eventEl: HTMLElement | Element | Window
    scrollEl: HTMLElement
    clickHandler?: any
  }
}
