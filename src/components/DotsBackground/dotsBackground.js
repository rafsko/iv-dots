import React, { useRef, useEffect } from "react"
import styled from "styled-components"

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  max-width: 100vw;
  width: 100%;
  height: 100vh;
`

export const DotsBackground = ({ theme }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    let canvas = canvasRef.current,
      ctx = canvas.getContext("2d"),
      w = (canvas.width = window.innerWidth),
      h = (canvas.height = window.innerHeight),
      dots = [],
      int = 0,
      max = 700,
      canvasDots = document.createElement("canvas"),
      ctx2 = canvasDots.getContext("2d")
    canvasDots.width = 15
    canvasDots.height = 15

    let half = canvasDots.width / 2,
      gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half)
    gradient2.addColorStop(1, "rgb(93,0,226)")
    ctx2.fillStyle = gradient2
    ctx2.beginPath()
    ctx2.arc(half, half, half, 0, Math.PI * 2)
    ctx2.fill()

    function random(min, max) {
      if (arguments.length < 2) {
        max = min
        min = 0
      }

      if (min > max) {
        let hold = max
        max = min
        min = hold
      }

      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    function orbit(x, y) {
      let max = Math.max(x, y),
        diameter = Math.round(Math.sqrt(max * max + max * max))
      return diameter / 2
    }

    let Dot = function () {
      this.orbitRadius = random(orbit(w, h))
      this.radius = random(5, this.orbitRadius) / 70
      this.locX = w / 2
      this.locY = h / 2
      this.randMax = random(0, max)
      this.speed = random(this.orbitRadius) / 500000
      this.alpha = random(2, 8) / 8
      this.flip = true
      int++
      dots[int] = this
    }

    Dot.prototype.draw = function () {
      let x = Math.sin(this.randMax) * this.orbitRadius + this.locX,
        y = Math.cos(this.randMax) * this.orbitRadius + this.locY,
        randInt = random(10)

      if (randInt === 1 && this.alpha > 0 && this.flip === false) {
        this.alpha -= 0.05
      } else if (randInt === 2 && this.alpha < 1 && this.flip === false) {
        this.alpha += 0.05
      }

      ctx.globalAlpha = this.alpha
      ctx.drawImage(
        canvasDots,
        x - this.radius / 10,
        y - this.radius / 10,
        this.radius,
        this.radius
      )
      this.randMax -= this.speed
    }

    Dot.prototype.stop = function (int) {
      this.flip = true
      this.speed = 0
    }

    Dot.prototype.continue = function (int) {
      this.flip = false
      this.speed = random(this.orbitRadius) / 700000
    }

    Dot.prototype.spin = function () {
      let x = Math.sin(this.randMax) * this.orbitRadius + this.locX,
        y = Math.cos(this.randMax) * this.orbitRadius + this.locY

      this.alpha = 1

      ctx.globalAlpha = this.alpha
      ctx.drawImage(
        canvasDots,
        x - this.radius / 10,
        y - this.radius / 10,
        this.radius,
        this.radius
      )
      this.randMax -= this.speed
    }

    for (let i = 0; i < max; i++) {
      new Dot()
    }

    function begin() {
      ctx.globalCompositeOperation = "source-over"
      ctx.globalAlpha = 1
      ctx.fillStyle = theme
      ctx.fillRect(0, 0, w, h)

      for (let i = 1, l = dots.length; i < l; i++) {
        dots[i].draw()
      }

      window.requestAnimationFrame(begin)
    }

    begin()
  }, [])

  return (
    <Wrapper>
      <canvas ref={canvasRef} />
    </Wrapper>
  )
}
