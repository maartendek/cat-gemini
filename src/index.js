import Phaser from "phaser";
import bgImage from "./assets/bg.png";
import groundImage from "./assets/ground.png";
import catSitImage from "./assets/cat-black-sit.png";
import catWalkImage from "./assets/cat-black-walk-sprite-2.png";
import platformImage from "./assets/platform.png";
import clarityImage from "./assets/clarity_k52.png";

class CatGame extends Phaser.Scene {
  constructor() {
    super();
    this.lives;
    this.moveCam = false;
    this.screenWidth = 552;
    this.screenSize = 4;
    this.player;
    this.platforms;
    this.oldAnimation = '';
  }


  init ()
  {
      //  Inject our CSS
      const element = document.createElement('style');
  
      document.head.appendChild(element);
  
      const sheet = element.sheet;
  
      const styles = '@font-face { font-family: "bebasNeue"; src: url("assets/BebasNeue-Regular.ttf") format("truetype"); }\n';
  
      sheet.insertRule(styles, 0);
 
  }

  preload() {
    this.gameWidth = this.screenSize * this.screenWidth;
    this.load.image("bg", bgImage);
    this.load.spritesheet("cat-walk", catWalkImage, { frameWidth: 100, frameHeight: 100 });
    this.load.image("cat-sit", catSitImage);
    this.load.image('ground', groundImage);
    this.load.image('platform', platformImage);
    this.load.image('clarity', clarityImage);

    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    
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

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('cat-walk', { frames: [ 0, 1, 2, 3 ] }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('cat-walk', { frames: [ 0, 1, 2, 3 ] }),
      frameRate: 0,
      repeat: -1
    });
    this.player = this.physics.add.sprite(100, 150, 'cat-walk').setScale(0.5);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);

    this.cameras.main.startFollow(this.player, true);


    var graphics = this.add.circle(40, 393 - 30, 30, 0x880000);
    graphics.setInteractive().on("pointerdown", () => {
        console.log("JUMP");
        this.moveCam = true;
        console.log("player x = ", this.player.x, " | gamewidth = ", this.gameWidth)
        this.player.setVelocityY(-250);
    });


    // enemies
    this.enemies = this.physics.add.group({ allowGravity: true });
    this.enemies.add(new Enemy(this, 550, 20, 0.005), true);
    this.enemies.add(new Enemy(this, 200, 250, 0.005), true);
    this.physics.add.collider(this.enemies, this.platforms);

    this.physics.add.collider(this.enemies, this.player, () => {
        this.removeLife()
    });

    // clarity code powerups
    this.clarityCodes = this.physics.add.group({ allowGravity: false });
    this.clarityCodes.add(new ClarityCode(this, 350, 100, 100, 100, 0.005), true);
    this.clarityCodes.add(new ClarityCode(this, 600, 200, 40, 100, 0.005), true);
    this.clarityCodes.add(new ClarityCode(this, 700, 200, 40, 100, -0.005), true);
    this.clarityCodes.add(new ClarityCode(this, 800, 200, 40, 100, 0.01), true);

    this.physics.add.overlap(this.player, this.clarityCodes, function(player, code) {
        code.disableBody(true, true);
        this.showMessage();
        setTimeout(()=>{
          this.hideMessage();
        }, 1000);
    }, null, this);
    
    this.message = this.add.text(150, 200, "Gefeliciteerd uren code opgepakt!", { font: "30px Arial", fill: "#19709B",align: "center" }).setVisible(false);
    this.message.setStroke('#135677', 0);

    

    // lives left
    this.lives = 8;
    this.livesText = this.add.text(16, 16, `lives: ${this.lives}`, { fontSize: '32px', fontFamily: 'bebasNeue', fill: '#135677' });
    this.removeLife = () => {
        if (!this.hurt) {
        console.log("OUCH");
        this.lives--;
        if (this.lives < 1) {
            document.querySelector(".death-screen").style.display = "block";
        }
        this.livesText.setText(`lives: ${Math.max(0,this.lives)}`);
        this.hurt = true;
        setTimeout(() => {
            this.hurt = false;
        }, 1000);
        }
    }
  }
  
  showMessage() {
    this.message.setVisible(true);
  }
  
  hideMessage() {
    this.message.setVisible(false);  
  }

  setAnimation(animation) {
    if (this.oldAnimation === animation) return;
    this.oldAnimation = animation;
    if(animation === 'stop'){
      this.player.stop();
    } else {
      this.player.play(animation);
    }
  }

  update() {
    const cursors = this.input.keyboard.createCursorKeys();

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
            this.player.setScale(-0.5, 0.5);
            this.setAnimation('walk');
        }
    else if (cursors.right.isDown)
        {
            this.player.setVelocityX(0);
            this.player.setVelocityX(160);
            this.player.setScale(0.5, 0.5);
            this.setAnimation('walk');
        }
        else if (cursors.up.isDown)
        {
            this.player.setVelocityX(0);
            this.player.setVelocityY(-160);
            this.setAnimation('jump');
        }
        else {
          this.player.setVelocityX(0);
          this.setAnimation('stop');
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



// Clarity Code Powerup
var ClarityCode = new Phaser.Class({
    Extends: Phaser.Physics.Arcade.Sprite,
    initialize: function ClarityCode (scene, x, y, width, height, speed) {
        Phaser.Physics.Arcade.Sprite.call(this, scene, x, y, 'clarity');

        //  This is the path the sprite will follow
        this.path = new Phaser.Curves.Ellipse(x, y, width, height);
        this.pathIndex = 0;
        this.pathSpeed = speed;
        this.pathVector = new Phaser.Math.Vector2();
        this.scale = 0.5;
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
        this.scale = 0.5;
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

const start = document.querySelector(".start-screen");

start.addEventListener("click", () => {
    console.log("start the game");
    start.style.display = "none";
    const game = new Phaser.Game(config);
})