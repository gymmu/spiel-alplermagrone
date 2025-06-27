import Phaser from "phaser"
import { getRandomDirection } from "./utils.js"
import Player from "./player.js"
import NPC from "./npc.js"

export default class NPC3 extends NPC {
  hp = 20
  maxHp = 20
  #speed = 100
  attackPower = 3

  constructor(scene, x, y, properties = {}) {
      super(scene, x, y, properties, "npc3")
      this.setScale(3)
      this.speed = 200
    }
    update() {
        const { body } = this
        let isIdle = true

        this.stepsLeft--
        if (this.stepsLeft <= 0) {
          this.move = getRandomDirection()
          this.stepsLeft = 60 + Math.floor(Math.random() * 60)
        }

        this.body.setVelocityX(0)
        this.body.setVelocityY(0)

        if (this.move === "left") {
          body.setVelocityX(-this.speed)
          if (isIdle) this.anims.play("npc3_left", true)
          isIdle = false
        }
        if (this.move === "right") {
          this.body.setVelocityX(this.speed)
          if (isIdle) this.anims.play("npc3_right", true)
          isIdle = false
        }

        if (this.move === "up") {
          body.setVelocityY(-this.speed)
          if (isIdle) this.anims.play("npc3_up", true)
          isIdle = false
        }
        if (this.move === "down") {
          body.setVelocityY(this.speed)
          if (isIdle) this.anims.play("npc3_down", true)
          isIdle = false
        }

        if (isIdle) {
          this.anims.play("npc3_idle", true)
        }

        // Wenn der NPC getroffen wurde, lasse ihn blinken
        if (this.isInvulnerable) {
          // Setze die Farbe des Spielers auf rot
          this.tint = 0xff0000
        } else {
          // Setze die Farbe des Spielers auf normal
          this.tint = 0xffffff
        }
      }
}