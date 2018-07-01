var expect = chai.expect;
var spy = chai.spy;

var game;
var sprite;

mocha.setup('bdd');

describe('hooks', function () {

  before('create game', function (done) {
    game = new Phaser.Game({
      type: Phaser.HEADLESS,
      scene: { init: function () { done(); } },
      callbacks: {
        postBoot: function () {
          game.loop.stop();
        }
      }
    });
  });

  after('destroy game', function () {
    game.destroy();
  });

  beforeEach('create sprite, add health', function () {
    sprite = game.scene.getScene('default').add.sprite();
    Phaser.Health.AddTo(sprite);
  });

  afterEach('destroy sprite', function () {
    sprite.destroy();
  });

  describe('AddTo()', function () {

    context('passing no health', function () {

      it('sets health to 1', function () {
        expect(sprite.getHealth()).equals(1);
      });

      it('sets maxHealth to 100', function () {
        expect(sprite.getMaxHealth()).equals(100);
      });

    });

    context('passing health', function () {

      it('sets health', function () {
        Phaser.Health.AddTo(sprite, 2);
        expect(sprite.getHealth()).equals(2);
      });

    });

    context('passing maxHealth', function () {

      it('sets maxHealth', function () {
        Phaser.Health.AddTo(sprite, 2, 3);
        expect(sprite.getMaxHealth()).equals(3);
      });

    });

  });

  describe('getHealth()', function () {

    it('returns health', function () {
      expect(sprite.getHealth()).equals(1);
    });

  });

  describe('getMaxHealth()', function () {

    it('returns maxHealth', function () {
      expect(sprite.getMaxHealth()).equals(100);
    });

  });

  describe('isAlive()', function () {

    context('when health > 0', function () {

      it('returns true', function () {
        expect(sprite.isAlive()).is.true;
      });

    });

    context('when health is 0', function () {

      it('returns false', function () {
        sprite.setHealth(0);
        expect(sprite.isAlive()).is.false;
      });

    });

    context('when health is < 0', function () {

      it('returns false', function () {
        sprite.setHealth(-1);
        expect(sprite.isAlive()).is.false;
      });

    });

  });

  describe('isDead()', function () {

    context('when health > 0', function () {

      it('returns false', function () {
        expect(sprite.isDead()).is.false;
      });

    });

    context('when health is 0', function () {

      it('returns true', function () {
        sprite.setHealth(0);
        expect(sprite.isDead()).is.true;
      });

    });

    context('when health is < 0', function () {

      it('returns true', function () {
        sprite.setHealth(-1);
        expect(sprite.isDead()).is.true;
      });

    });

  });

  describe('setHealth()', function () {

    context('passing health amount', function () {

      it('sets health', function () {
        sprite.setHealth(2);
        expect(sprite.getHealth()).equals(2);
      });

      it('fires `healthchange`, passing the object, change amount, health, and maxHealth', function () {
        var healthchange = spy();
        sprite.once('healthchange', healthchange).setHealth(2);
        expect(healthchange).is.called.with.exactly(sprite, 1, 2, 100);
      });

    });

    context('passing health amount greater than maxHealth', function () {

      it('sets health equal to maxHealth', function () {
        sprite.setHealth(101);
        expect(sprite.getHealth()).equals(100);
      });

      it('fires `healthchange`, passing the actual change amount', function () {
        var healthchange = spy();
        sprite.once('healthchange', healthchange).setHealth(101);
        expect(healthchange).is.called.with.exactly(sprite, 99, 100, 100);
      });

    });

    context('passing health amount equal to current health', function () {

      it('does not fire `healthchange`', function () {
        var healthchange = spy();
        sprite.once('healthchange', healthchange).setHealth(1);
        expect(healthchange).is.not.called();
      });

    });

    context('passing silent = true', function () {

      it('does not fire `healthchange`', function () {
        var healthchange = spy();
        sprite.once('healthchange', healthchange).setHealth(2, true);
        expect(healthchange).is.not.called();
      });

    });

    context('heal decreases to 0', function () {
      it('fires `die`, passing the object', function () {
        var die = spy();
        sprite.setHealth(1).on('die', die).setHealth(0);
        expect(die).is.called.with.exactly(sprite);
      });
    });

    context('health decreases below 0', function () {
      it('fires `die`, passing the object', function () {
        var die = spy();
        sprite.setHealth(1).on('die', die).setHealth(-1);
        expect(die).is.called.with.exactly(sprite);
      });
    });

    context('health increases above 0', function () {
      it('fires `revive`, passing the object', function () {
        var revive = spy();
        sprite.setHealth(-1).on('revive', revive).setHealth(1);
        expect(revive).is.called.with.exactly(sprite);
      });
    });

  });

  describe('setMaxHealth()', function () {

    context('passing amount', function () {

      it('sets maxHealth', function () {
        sprite.setMaxHealth(2);
        expect(sprite.getMaxHealth()).equals(2);
      });

    });

    context('passing amount smaller than current health', function () {

      it('reduces health to maxHealth', function () {
        sprite.setHealth(3).setMaxHealth(2);
        expect(sprite.getHealth()).equals(2);
      });

    });

  });

  describe('damage()', function () {

    context('passing no amount', function () {

      it('decreases health by 1', function () {
        expect(function() { sprite.damage(); })
          .decreases(function () { return sprite.getHealth(); })
          .by(1);
      });

      it('fires `damage`, passing the object and damage amount', function () {
        var damage = spy();
        sprite.once('damage', damage).damage();
        expect(damage).is.called.with.exactly(sprite, 1);
      });

      it('fires `healthchange`, passing the object, change amount, health, and maxHealth', function () {
        var healthchange = spy();
        sprite.once('healthchange', healthchange).damage();
        expect(healthchange).is.called.with.exactly(sprite, -1, 0, 100);
      });

    });

    context('passing amount', function () {

      it('decreases health by amount', function () {
        expect(function() { sprite.damage(2); })
          .decreases(function () { return sprite.getHealth(); })
          .by(2);
      });

      it('fires `damage`, passing the object and damage amount', function () {
        var damage = spy();
        sprite.once('damage', damage).damage(2);
        expect(damage).is.called.with.exactly(sprite, 2);
      });

      it('fires `healthchange`, passing the object, change amount, health, and maxHealth', function () {
        var healthchange = spy();
        sprite.once('healthchange', healthchange).damage(2);
        expect(healthchange).is.called.with.exactly(sprite, -2, -1, 100);
      });

    });

    context('passing amount = 0', function () {

      it('does not fire `damage`', function () {
        var damage = spy();
        sprite.once('damage', damage).damage(0);
        expect(damage).is.not.called();
      });

      it('does not fire `healthchange`', function () {
        var healthchange = spy();
        sprite.once('healthchange', healthchange).damage(0);
        expect(healthchange).is.not.called();
      });

    });

    context('passing silent = true', function () {

      it('does not fire `damage`', function () {
        var damage = spy();
        sprite.once('damage', damage).damage(1, true);
        expect(damage).is.not.called();
      });

      it('does not fire `healthchange`', function () {
        var healthchange = spy();
        sprite.once('healthchange', healthchange).damage(1, true);
        expect(healthchange).is.not.called();
      });

    });

  });

  describe('heal()', function () {

    context('passing no amount', function () {

      it('increases health by 1', function () {
        expect(function() { sprite.heal(); })
          .increases(function () { return sprite.getHealth(); })
          .by(1);
      });

      it('fires `heal`, passing the object and heal amount', function () {
        var heal = spy();
        sprite.once('heal', heal).heal();
        expect(heal).is.called.with.exactly(sprite, 1);
      });

      it('fires `heal` before health changes', function () {
        sprite.once('heal', function () {
          expect(sprite.getHealth()).equals(1);
        }).heal();
      });

    });

    context('passing amount', function () {

      it('increases health by amount', function () {
        expect(function() { sprite.heal(2); })
          .increases(function () { return sprite.getHealth(); })
          .by(2);
      });

      it('fires `heal`, passing the object and heal amount', function () {
        var heal = spy();
        sprite.once('heal', heal).heal(2);
        expect(heal).is.called.with.exactly(sprite, 2);
      });

    });

    context('passing amount = 0', function () {
      it('does not fire `heal`', function () {
        var heal = spy();
        sprite.once('heal', heal).heal(0);
        expect(heal).is.not.called();
      });

      it('does not fire `healthchange`', function () {
        var healthchange = spy();
        sprite.once('healthchange', healthchange).heal(0);
        expect(healthchange).is.not.called();
      });
    });

    context('passing amount larger than (maxHealth - health)', function () {
      it('fires `heal` with the heal amount', function () {
        var heal = spy();
        sprite.on('heal', heal).heal(100);
        expect(heal).is.called.with.exactly(sprite, 100);
      });

      it('fires `healthchange` with the actual change amount', function () {
        var healthchange = spy();
        sprite.on('healthchange', healthchange).heal(100);
        expect(healthchange).is.called.with.exactly(sprite, 99, 100, 100);
      });
    });

    context('passing silent true', function () {
      it('does not fire `heal`', function () {
        var heal = spy();
        sprite.once('heal', heal).heal(1, true);
        expect(heal).is.not.called();
      });

      it('does not fire `healthchange`', function () {
        var healthchange = spy();
        sprite.once('healthchange', healthchange).heal(1, true);
        expect(healthchange).is.not.called();
      });
    });

  });

  describe('kill()', function () {
    it('sets health to 0', function () {
      sprite.kill();
      expect(sprite.getHealth()).equals(0);
    });
  });

  describe('revive()', function () {

    context('passing no amount', function () {
      it('sets health to 1', function () {
        sprite.revive();
        expect(sprite.getHealth()).equals(1);
      });
    });

    context('passing an amount', function () {
      it('sets health', function () {
        sprite.revive(2);
        expect(sprite.getHealth()).equals(2);
      });
    });

  });

  describe('reviveAtMaxHealth()', function () {

    it('sets health to maximum', function () {
      sprite.reviveAtMaxHealth();
      expect(sprite.getHealth()).equals(100);
    });

  });

});

mocha.checkLeaks();
mocha.globals(['Health', 'Phaser']);
mocha.run();
