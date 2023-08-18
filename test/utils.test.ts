import { describe, it, expect } from 'vitest'
import { getOffsetTop } from '~/utils'

describe('getOffsetTop', () => {
  it('should calculate offsetTop without untilParent', () => {
    const mockElem = {
      offsetTop: 100,
      offsetParent: {
        offsetTop: 50,
        offsetParent: null
      }
    }
    const offsetTop = getOffsetTop(mockElem)
    expect(offsetTop).toBe(150)
  })

  it('should calculate offsetTop with untilParent', () => {
    const mockElem = {
      offsetTop: 100,
      offsetParent: {
        offsetTop: 50,
        offsetParent: {
          offsetTop: 25,
          offsetParent: null
        }
      }
    }
    const mockUntilParent = mockElem.offsetParent
    const offsetTop = getOffsetTop(mockElem, mockUntilParent)
    expect(offsetTop).toBe(100)
  })

  it('should handle case where elem is null', () => {
    const offsetTop = getOffsetTop(null)
    expect(offsetTop).toBe(0)
  })

  it('should handle case where elem has no offsetTop', () => {
    const mockElem = {
      offsetTop: undefined,
      offsetParent: {
        offsetTop: 50,
        offsetParent: null
      }
    }
    const offsetTop = getOffsetTop(mockElem)
    expect(offsetTop).toBe(50)
  })

  it('should handle case where untilParent is null', () => {
    const mockElem = {
      offsetTop: 100,
      offsetParent: {
        offsetTop: 50,
        offsetParent: null
      }
    }
    const offsetTop = getOffsetTop(mockElem, null)
    expect(offsetTop).toBe(150)
  })

  it('should handle case where untilParent is same as elem', () => {
    const mockElem = {
      offsetTop: 100,
      offsetParent: {
        offsetTop: 50,
        offsetParent: null
      }
    }
    const offsetTop = getOffsetTop(mockElem, mockElem)
    expect(offsetTop).toBe(150)
  })
})
