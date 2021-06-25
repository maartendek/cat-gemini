import Phaser from "phaser";
import bgImage from "./assets/bg.png";
import groundImage from "./assets/ground.png";
import catSitImage from "./assets/cat-black-sit.png";
import catWalkImage from "./assets/cat-black-walk.png";
import platformImage from "./assets/platform.png";

class CatGame extends Phaser.Scene {
  constructor() {
    super();
    this.moveCam = false;
    this.screenWidth = 736;
    this.screenHeight = 414;
    this.screenSize = 4;
    this.player;
    this.platforms;
    this.background;
    this.message;
  }

  preload() {
    this.gameWidth = this.screenSize * this.screenWidth;
    this.load.image("bg", bgImage);
    this.load.spritesheet("cat-walk", catWalkImage, { frameWidth: 100, frameHeight: 100 });
    this.load.image("cat-sit", catSitImage);
    this.load.image('ground', groundImage);
    this.load.image('platform', platformImage);
  }

  create() {

    this.cameras.main.setBounds(0, 0, this.gameWidth, 176);

  
    this.background = this.add.tileSprite(0, 0, this.screenWidth, this.screenHeight, "bg")
      .setOrigin(0)
      .setScrollFactor(0,1);

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 250, 'platform');
    this.platforms.create(400, 100, 'platform');
    for (let x = 0; x < this.screenSize; x++) {
        this.platforms.create(552 * x, 393, 'ground').refreshBody();
    }

    this.cursors = this.input.keyboard.createCursorKeys();

    this.player = this.physics.add.sprite(100, 150, 'cat-walk');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);

    this.cameras.main.startFollow(this.player, true);

    this.enemies = this.physics.add.group();
    this.physics.add.collider(this.enemies, this.platforms);

    this.enemies.create(200, 150, 'cat-sit');
    this.enemies.create(200, 20, 'cat-sit');

    this.physics.add.collider(this.enemies, this.player, () => {
        console.log("ouch!")
    });
    
    // this.enemy = this.physics.add.sprite(200, 150, 'cat-sit');
    // this.enemy.setCollideWorldBounds(true);
    // this.physics.add.collider(this.enemy, this.platforms);
    
    this.message = this.add.text(150, 200, "Gefeliciteerd uren code opgepakt!", { font: "30px Arial", fill: "#ff0044", align: "center" }).setVisible(false);
    this.message.setStroke('#000', 16);
  }
  
  showMessage() {
    this.message.setVisible(true);
  }
  
  hideMessage() {
    this.message.setVisible(false);
  }

  update() {
    this.background.setTilePosition(this.cameras.main.scrollX);
    const cursors = this.input.keyboard.createCursorKeys();

    this.enemies.children.each(enemy => {
        
        // if player to left of enemy AND enemy moving to right (or not moving)
        if (550 <= enemy.x && enemy.body.velocity.x >= 0) {
            // move enemy to left
            enemy.body.velocity.x = -150;
        }
        // if player to right of enemy AND enemy moving to left (or not moving)
        else if (250 >= enemy.x && enemy.body.velocity.x <= 0) {
            // move enemy to right
            enemy.body.velocity.x = 150;
        }
    })
    
    


    if (this.moveCam) {
        this.player.setVelocityX(80);
    }
    this.player.setInteractive().on("pointerdown", () => {
        // star cat moving 
        this.moveCam = true;
        console.log("player x = ", this.player.x, " | gamewidth = ", this.gameWidth)
        this.player.setVelocityY(-250);
        
    });

    if (cursors.left.isDown)
        {
            this.player.setVelocityX(0);
            this.player.setVelocityX(-160);
            this.showMessage();
        }
    else if (cursors.right.isDown)
        {
            this.player.setVelocityX(0);
            this.player.setVelocityX(160);
            this.hideMessage();
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
