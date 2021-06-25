import Phaser from "phaser";
import bgImage from "./assets/bg.png";
import groundImage from "./assets/ground.png";
import catSitImage from "./assets/cat-black-sit.png";
import catWalkImage from "./assets/cat-black-walk.png";

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
  }

  create() {
    this.cameras.main.setBounds(0, 0, 552 * this.screenSize, 176);

    for (let x = 0; x < this.screenSize; x++) {
      this.add.image(552 * x, 0, "bg").setOrigin(0);
    }

    this.platforms = this.physics.add.staticGroup();
    for (let x = 0; x < this.screenSize; x++) {
        this.platforms.create(552 * x, 393, 'ground').refreshBody();
    }

    this.cursors = this.input.keyboard.createCursorKeys();

    this.player = this.physics.add.sprite(100, 150, 'cat-walk');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);

    this.cameras.main.startFollow(this.player, true);

  }

  update() {
    const cam = this.cameras.main;

    if (this.moveCam) {
        this.player.setVelocityX(80);
    }
    this.player.setInteractive().on("pointerdown", () => {
        // star cat moving 
        this.moveCam = true;
        
        if (this.player.body.touching.down) {
            this.player.setVelocityY(-250);
        }
    });

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
