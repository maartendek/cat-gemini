import Phaser from "phaser";
import bgImage from "./assets/bg.png";
import groundImage from "./assets/empty.png";
import catSitImage from "./assets/cat-black-sit.png";
import catWalkImage from "./assets/cat-black-walk.png";
import platformImage from "./assets/platform.png";

class CatGame extends Phaser.Scene {
  constructor() {
    super();
    this.moveCam = false;
    this.screenSize = 4;
    this.player;
    this.platforms;
  }

  preload() {
    this.load.image("bg", bgImage);
    this.load.spritesheet("cat-walk", catWalkImage, { frameWidth: 100, frameHeight: 100 });
    this.load.image("cat-sit", catSitImage);
    this.load.image('ground', groundImage);
    this.load.image('platform', platformImage);
  }

  create() {
    this.cameras.main.setBounds(0, 0, 552 * this.screenSize, 176);

    for (let x = 0; x < this.screenSize; x++) {
      this.add.image(552 * x, 0, "bg").setOrigin(0);
    }

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 250, 'platform');
    this.platforms.create(400, 100, 'platform');
    this.platforms.create(300, 400, 'platform').refreshBody();

    this.cursors = this.input.keyboard.createCursorKeys();

    this.player = this.physics.add.sprite(50, 100, 'cat-walk').setScale(0.5);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);

    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.setZoom(1);

    }

    update() {
    const cam = this.cameras.main;
    const cursors = this.input.keyboard.createCursorKeys();
    
    // this.player.setVelocity(0);

    if (this.moveCam) {
      if (this.cursors.left.isDown) {
        cam.scrollX -= 4;
      } else if (this.cursors.right.isDown) {
        cam.scrollX += 4;
      }

      if (this.cursors.up.isDown) {
        cam.scrollY -= 4;
      } else if (this.cursors.down.isDown) {
        cam.scrollY += 4;
      }
    } else {
      this.player.setInteractive().on("pointerdown", () => {
        if (this.player.body.touching.down) {
          this.player.setVelocityY(-250);
        }
      });
      this.player.setInteractive().on("keydown", () => {
        if (this.player.body.touching.down) {
          this.player.setVelocityY(-250);
        }
      });
    }
    if (cursors.left.isDown)
        {
            this.player.setVelocityX(0);
            this.player.setVelocityX(-160);
        }
        else if (cursors.right.isDown)
        {
            this.player.setVelocityX(0);
            this.player.setVelocityX(160);
        }
        else if (cursors.up.isDown)
        {
            this.player.setVelocityY(0);
            this.player.setVelocityY(-160);
        }
        else {
            // this.player.setVelocity(0);
        }
     }
}

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "phaser-example",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 736,
    height: 414,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: CatGame,
};

var moveCam = false;

const game = new Phaser.Game(config);
