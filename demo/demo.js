var BLUE = 0x00ffff;
var GREEN = 0x22ff00;
var RED = 0xff2200;
var Health = PhaserHealth;
var Shuffle = Phaser.Utils.Array.Shuffle;

class HealthBar {
  constructor (scene, x, y, width, height) {
    this.bg = scene.add.rectangle(x, y, width + 2, height + 2, 0, 0.6)
      .setOrigin(0, 0);

    this.bar = scene.add.rectangle(x + 1, y + 1, width, height, GREEN)
      .setOrigin(0, 0);
  }

  add (target) {
    target.on('healthchange', this.draw, this);
  }

  draw (target, change, health, max) {
    this.bar.displayWidth = Math.max(0, health);
  }
}

class Missile extends Phaser.GameObjects.Image {
  constructor (scene, frame) {
    super(scene, 0, 0, 'elves', frame);

    this.visible = false;
  }
}

class Elf extends Phaser.GameObjects.Sprite {
  constructor (scene, color, x, y) {
    super(scene, x, y, 'elves');

    this.centerX = (color === 'blue')
      ? (x - 0.25 * this.width)
      : (x + 0.25 * this.width);

    this.color = color;

    this.play(this.color + 'Idle');

    scene.add.existing(this);

    this.on('animationcomplete', this.animComplete, this);

    // (health, minHealth, maxHealth)
    this.setHealth(50, 0, 50);

    this.on('die', this.onDie, this);
    this.on('revive', this.onRevive, this);

    this.healthBar = new HealthBar(
      scene,
      this.centerX - 25,
      this.y + 75,
      this.getMaxHealth(), 20
    );
    this.healthBar.add(this);

    this.timer = null;

    this.scheduleFire();

    this.setInteractive(new Phaser.Geom.Rectangle(
      (this.color === 'blue') ? 0 : (0.6 * this.width),
      0,
      0.4 * this.width,
      this.height
    ), Phaser.Geom.Rectangle.Contains);

    this.on('pointerdown', this.onPointerDown, this);
  }

  animComplete (animation) {
    if (animation.key === (this.color + 'Attack')) {
      this.play(this.color + 'Idle');
    }
  }

  scheduleFire () {
    this.timer = this.scene.time.addEvent({
      delay: Phaser.Math.Between(1000, 3000),
      callback: this.fire,
      callbackScope: this
    });
  }

  fire () {
    if (!this.isAlive()) return;

    this.scheduleFire();

    var target = (this.color === 'blue') ? getGreen() : getBlue();

    if (target) {
      this.play(this.color + 'Attack');

      var offset = (this.color === 'blue') ? 20 : -20;
      var targetX = (this.color === 'blue') ? target.x + 30 : target.x - 30;

      this.missile.setPosition(this.x + offset, this.y + 20).setVisible(true);

      this.scene.tweens.add({
        targets: this.missile,
        x: targetX,
        ease: 'Linear',
        duration: Math.abs(this.x - target.x),
        onComplete: function (tween, targets) {
          targets[0].setVisible(false);
          target.damage(Phaser.Math.Between(1, 9));
        }
      });
    }
  }

  onDie () {
    this.play(this.color + 'Dead');
  }

  onRevive () {
    this.play(this.color + 'Idle');

    this.scheduleFire();
  }

  onPointerDown () {
    this.heal(10);
  }
}

class BlueElf extends Elf {
  constructor (scene, x, y) {
    super(scene, 'blue', x, y);

    this.missile = new Missile(scene, 'blue-missile');

    scene.add.existing(this.missile);
  }
}

class GreenElf extends Elf {
  constructor (scene, x, y) {
    super(scene, 'green', x, y);

    this.missile = new Missile(scene, 'green-missile');

    scene.add.existing(this.missile);
  }
}

Health.MixinTo(Elf);

var Counter = {
  blue: 0,

  green: 0,

  text: null,

  add: function (elf) {
    elf.on('die', this.countDeath, this);
    elf.on('revive', this.countRevive, this);
  },

  countDeath: function (elf) {
    this[elf.color]--;

    this.drawCount();
  },

  countRevive: function (elf) {
    this[elf.color]++;

    this.drawCount();
  },

  drawCount: function () {
    this.text.setText(`Blue: ${this.blue} Green: ${this.green}`);
  }
};

var Logger = {
  add: function (elf) {
    elf.on('healthchange', this.logHealthChange, this);
    elf.on('die', this.logDeath, this);
    elf.on('revive', this.logRevive, this);
    elf.on('damage', this.logDamage, this);
    elf.on('heal', this.logHeal, this);
  },

  logHealthChange: function (elf, amount) {
    console.log('healthchange', elf.name, amount);
  },

  logDeath: function (elf) {
    console.log('die', elf.name);
  },

  logRevive: function (elf) {
    console.log('revive', elf.name);
  },

  logDamage: function (elf, amount) {
    console.log('damage', elf.name, amount);
  },

  logHeal: function (elf, amount) {
    console.log('heal', elf.name, amount);
  }
};

var Texter = {
  text: null,

  add: function (elf) {
    elf.on('healthchange', this.onHealthChange, this);
  },

  onHealthChange: function (elf, change) {
    this.text
      .setPosition(elf.centerX, elf.y - 100)
      .setText(change)
      .setOrigin(0.5, 0.5);
  }
};

var Tinter = {
  add: function (elf) {
    elf.on('damage', this.tintDamage, this);
    elf.on('heal', this.tintHeal, this);
  },

  tintDamage: function (elf) {
    elf.setTint(RED);
    this.scheduleClearTint(elf);
  },

  tintHeal: function (elf) {
    elf.setTint(BLUE);
    this.scheduleClearTint(elf);
  },

  scheduleClearTint: function (elf) {
    elf.scene.time.addEvent({ delay: 200, callback: elf.clearTint, callbackScope: elf });
  }
};

var config = {
  width: 1024,
  height: 600,
  pixelArt: true,
  scene: {
    preload: preload,
    create: create
  }
};

var blues = [];
var greens = [];

// eslint-disable-next-line no-new
new Phaser.Game(config);

function preload () {
  //  The graphics used in this example were free downloads from https://craftpix.net
  //  Check out their excellent asset packs!
  this.load.image('background', 'assets/fairy-background-craft-pixel.png');
  this.load.atlas('elves', 'assets/elves-craft-pixel.png', 'assets/elves-craft-pixel.json');
}

function create () {
  this.anims.create({ key: 'greenIdle', frames: this.anims.generateFrameNames('elves', { prefix: 'green_idle_', start: 0, end: 4 }), frameRate: 10, repeat: -1 });
  this.anims.create({ key: 'blueIdle', frames: this.anims.generateFrameNames('elves', { prefix: 'blue_idle_', start: 0, end: 4 }), frameRate: 10, repeat: -1 });

  this.anims.create({ key: 'greenAttack', frames: this.anims.generateFrameNames('elves', { prefix: 'green_attack_', start: 0, end: 5 }), frameRate: 10 });
  this.anims.create({ key: 'blueAttack', frames: this.anims.generateFrameNames('elves', { prefix: 'blue_attack_', start: 0, end: 4 }), frameRate: 10 });

  this.anims.create({ key: 'greenDead', frames: this.anims.generateFrameNames('elves', { prefix: 'green_die_', start: 0, end: 4 }), frameRate: 6 });
  this.anims.create({ key: 'blueDead', frames: this.anims.generateFrameNames('elves', { prefix: 'blue_die_', start: 0, end: 4 }), frameRate: 6 });

  this.add.image(0, 0, 'background').setOrigin(0).setAlpha(0.5);

  Counter.text = this.add.text(10, 10, '', { font: '24px sans-serif' });

  Texter.text = this.add.text(0, 0, '', { font: '48px sans-serif' });

  blues.push(new BlueElf(this, 120, 476).setName('Onas'));
  blues.push(new BlueElf(this, 220, 480).setName('Aiduin'));
  blues.push(new BlueElf(this, 320, 484).setName('Kivessin'));
  blues.push(new BlueElf(this, 440, 480).setName('Respen'));

  greens.push(new GreenElf(this, 560, 486).setName('Hagduin'));
  greens.push(new GreenElf(this, 670, 488).setName('Alre'));
  greens.push(new GreenElf(this, 780, 485).setName('Akkar'));
  greens.push(new GreenElf(this, 890, 484).setName('Riluaneth'));

  Counter.blue = blues.length;
  Counter.green = greens.length;
  Counter.drawCount();

  blues.forEach(addElf);
  greens.forEach(addElf);

  console.info('Blue Elves:');

  Health.Dump(blues);

  console.info('Green Elves:');

  Health.Dump(greens);
}

function addElf (elf) {
  Counter.add(elf);
  Logger.add(elf);
  Texter.add(elf);
  Tinter.add(elf);
}

function getRandomAlive (objs) {
  return Shuffle(objs.filter(Health.IsAlive))[0] || null;
}

function getGreen () {
  return getRandomAlive(greens);
}

function getBlue () {
  return getRandomAlive(blues);
}
