import TWEEN from '@tweenjs/tween.js'

const hasDom = (typeof window) !== 'undefined'

const requestAnimationFrame = (function () {
  if (hasDom) {
    return (
      window.requestAnimationFrame ||
            function (callback) {
              window.setTimeout(callback, 1000 / 60)
            }
    )
  } else {
    return () => {}
  }
})()

function animate (): void {
  if (TWEEN.update()) {
    requestAnimationFrame(animate)
  }
}

requestAnimationFrame(animate)

export const Easing = TWEEN.Easing

export function scrollWithAnimation (
  scrollEl: any,
  current: any,
  target: any,
  time: any,
  easing: any
): void {
  new TWEEN.Tween({ postion: current })
    .to({ postion: target }, time)
    .easing(easing || Easing.Cubic.In)
    .onUpdate(function (val: any) {
      scrollEl.scrollTop = val.postion
    })
    .start()

  animate()
}
