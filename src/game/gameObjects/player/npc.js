import Phaser from "phaser"
import { getRandomDirection } from "./utils.js"
import Player from "./player.js"

export default class NPC extends Phaser.Physics.Arcade.Sprite {
  hp = 3
  maxHp = 3
  #speed = 50
  stepsLeft = 60
  move = "left"
  attackPower = 1
  isInvulnerable = false

  constructor(scene, x, y, properties = {}) {
    super(scene, x, y, properties, "npc")
    this.scene.add.existing(this)
    this.scene.physics.add.existing(this, false)
    this.body.collideWorldBounds = false
    this.setOrigin(0.5, 0.5)
    this.setSize(24, 24, false)
    this.setOffset(4, 8)

    this.props = {}

    if (properties != null) {
      if (properties instanceof Array) {
        properties.forEach((prop) => {
          this.props[prop.name] = prop.value
        })
      } else {
        this.props = properties
      }
    }  // ✅ props speichern
  }

  /**
   * Setze die Geschwindigkeit des Spielers. Kann nicht grösser als 960 sein, da
   * der Spieler sonst durch die Spielobjekte geht. Kann auch nicht kleiner als
   * 0 sein.
   *
   * @param {integer} value Die Geschwindigkeit der Spielers.
   */
  set speed(value) {
    this.#speed = Math.min(value, 960)
    this.#speed = Math.max(0, this.#speed)
  }

  /** Geschwindigkeit des Spielers. */
  get speed() {
    return this.#speed
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
      if (isIdle) this.anims.play("npc_left", true)
      isIdle = false
    }
    if (this.move === "right") {
      this.body.setVelocityX(this.speed)
      if (isIdle) this.anims.play("npc_right", true)
      isIdle = false
    }

    if (this.move === "up") {
      body.setVelocityY(-this.speed)
      if (isIdle) this.anims.play("npc_up", true)
      isIdle = false
    }
    if (this.move === "down") {
      body.setVelocityY(this.speed)
      if (isIdle) this.anims.play("npc_down", true)
      isIdle = false
    }

    if (isIdle) {
      this.anims.play("npc_idle", true)
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

  heal(value) {
    if (value == null) value = 0
    this.hp = this.hp + value
    if (this.hp > this.maxHp) {
      this.hp = this.maxHp
    }
  }

  damage(value) {
    if (this.isInvulnerable) return

    this.isInvulnerable = true
    this.scene.time.delayedCall(500, () => {
      this.isInvulnerable = false
    })

    if (value == null) value = 0
    this.hp -= value

    if (this.hp <= 0) {
      this.scene.player.enemiesKilled += 1
      console.log(this.props)
      if (this.props.keyName) {
        this.scene.player.addKey(this.props.keyName)
      }
      this.destroy()
    }
  }


  onCollide(actor) {
    if (actor instanceof Player) {
      actor.damage(this.attackPower)
    }
  }


}
