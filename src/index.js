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
    this.screenWidth = 552;
    this.screenSize = 4;
    this.player;
    this.platforms;
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

    for (let x = 0; x < this.screenSize; x++) {
      this.add.image(552 * x, 0, "bg").setOrigin(0);
    }

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 250, 'platform');
    this.platforms.create(400, 120, 'platform');
    for (let x = 0; x < this.screenSize; x++) {
        this.platforms.create(552 * x, 393, 'ground').refreshBody();
    }

    this.cursors = this.input.keyboard.createCursorKeys();

    this.player = this.physics.add.sprite(100, 150, 'cat-walk');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);

    this.cameras.main.startFollow(this.player, true);

    // enemies
    this.enemies = this.physics.add.group({ allowGravity: true });
    // this.enemies.create(550, 20, 'cat-sit');
    // this.enemies.create(200, 250, 'cat-sit');

    this.enemies.add(new Enemy(this, 550, 20, 0.005), true);
    this.enemies.add(new Enemy(this, 200, 250, 0.005), true);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.enemies, this.player, () => {
        console.log("ouch!")
    });

    // clarity code powerups
    this.clarityCodes = this.physics.add.group({ allowGravity: false });
    this.clarityCodes.add(new ClarityCode(this, 350, 100, 100, 100, 0.005), true);
    this.clarityCodes.add(new ClarityCode(this, 600, 200, 40, 100, 0.005), true);
    this.clarityCodes.add(new ClarityCode(this, 700, 200, 40, 100, -0.005), true);
    this.clarityCodes.add(new ClarityCode(this, 800, 200, 40, 100, 0.01), true);

    this.physics.add.overlap(this.player, this.clarityCodes, function(player, code) {
        code.disableBody(true, true);
    }, null, this);
  }

  update() {
    const cursors = this.input.keyboard.createCursorKeys();

    // this.enemies.children.each(enemy => {
        
    //     // if player to left of enemy AND enemy moving to right (or not moving)
    //     if (550 <= enemy.x && enemy.body.velocity.x >= 0) {
    //         // move enemy to left
    //         enemy.body.velocity.x = -150;
    //     }
    //     // if player to right of enemy AND enemy moving to left (or not moving)
    //     else if (250 >= enemy.x && enemy.body.velocity.x <= 0) {
    //         // move enemy to right
    //         enemy.body.velocity.x = 150;
    //     }
    // })
    
    


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

// Clarity Code Powerup
var ClarityCode = new Phaser.Class({
    Extends: Phaser.Physics.Arcade.Sprite,
    initialize: function ClarityCode (scene, x, y, width, height, speed) {
        Phaser.Physics.Arcade.Sprite.call(this, scene, x, y, 'cat-sit');

        //  This is the path the sprite will follow
        this.path = new Phaser.Curves.Ellipse(x, y, width, height);
        this.pathIndex = 0;
        this.pathSpeed = speed;
        this.pathVector = new Phaser.Math.Vector2();

        this.path.getPoint(0, this.pathVector);

        this.setPosition(this.pathVector.x, this.pathVector.y);
    },
    preUpdate: function (time, delta) {
        this.anims.update(time, delta);
        this.path.getPoint(this.pathIndex, this.pathVector);
        this.setPosition(this.pathVector.x, this.pathVector.y);
        this.pathIndex = Phaser.Math.Wrap(this.pathIndex + this.pathSpeed, 0, 1);
    }
});

// Enemy
var Enemy = new Phaser.Class({
    Extends: Phaser.Physics.Arcade.Sprite,
    initialize: function ClarityCode (scene, x, y, speed) {
        Phaser.Physics.Arcade.Sprite.call(this, scene, x, y, 'cat-sit');

    },
    preUpdate: function (t, d) {
         // if player to left of enemy AND enemy moving to right (or not moving)
         if (550 <= this.x && this.body.velocity.x >= 0) {
            // move enemy to left
            this.body.velocity.x = -150;
        }
        // if player to right of enemy AND enemy moving to left (or not moving)
        else if (250 >= this.x && this.body.velocity.x <= 0) {
            // move enemy to right
            this.body.velocity.x = 150;
        }
    }
});