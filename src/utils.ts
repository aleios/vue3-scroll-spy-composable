export const getOffsetTop = (
  // eslint-disable-next-line
    elem: any,
  // eslint-disable-next-line
    untilParent: any = null
): number => {
  let offsetTop = 0
  if (elem === null) {
    return 0
  }
  do {
    if (!isNaN(elem.offsetTop)) {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      offsetTop += elem.offsetTop
    }
    const offsetParent = elem.offsetParent
    if (offsetParent === null) break
    elem = offsetParent
  } while ((Boolean(elem)) && elem !== untilParent)
  return offsetTop
}
