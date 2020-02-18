var expect = chai.expect;
var spy = chai.spy;
var Health = PhaserHealth;

var game;
var scene;
var sprite;

mocha.setup('bdd');

describe('Phaser', function () {
  it('is an object', function () {
    expect(Phaser).is.an('object');
  });

  it('is version 3.22.0', function () {
    expect(Phaser).has.property('VERSION', '3.22.0');
  });
});

describe('PhaserHealth', function () {
  it('is an object', function () {
    expect(PhaserHealth).is.an('object');
  });
});

describe('hooks', function () {
  before('create game', function (done) {
    game = new Phaser.Game({
      type: Phaser.HEADLESS,
      scene: {
        init: function () {
          scene = this;
          done();
        }
      },
      callbacks: {
        postBoot: function () {
          game.loop.stop();
        }
      }
    });
  });

  after('destroy game', function () {
    game.destroy(true, true);
    game.runDestroy();
  });

  beforeEach('create sprite and add health', function () {
    sprite = scene.add.sprite();
    Health.AddTo(sprite);
  });

  afterEach('destroy sprite', function () {
    sprite.destroy();
  });

  describe('Health.AddTo()', function () {
    context('passing a game object', function () {
      it('adds the component methods to the object', function () {
        expect(sprite)
          .respondsTo('damage').and
          .respondsTo('getHealth').and
          .respondsTo('heal').and
          .respondsTo('isAlive').and
          .respondsTo('isDead').and
          .respondsTo('revive').and
          .respondsTo('reviveAtMaxHealth').and
          .respondsTo('setHealth').and
          .respondsTo('setMaxHealth');
      });

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
          Health.AddTo(sprite, 2);
          expect(sprite.getHealth()).equals(2);
        });
      });

      context('passing maxHealth', function () {
        it('sets maxHealth', function () {
          Health.AddTo(sprite, 2, 3);
          expect(sprite.getMaxHealth()).equals(3);
        });
      });
    });

    context('passing an object (with the required methods)', function () {
      it('adds the component methods to the object', function () {
        var thing = {
          data: null,
          events: new Phaser.Events.EventEmitter(),
          getData: Phaser.GameObjects.GameObject.prototype.getData,
          setData: Phaser.GameObjects.GameObject.prototype.setData,
          setDataEnabled: Phaser.GameObjects.GameObject.prototype.setDataEnabled
        };

        thing.data = new Phaser.Data.DataManager(thing, thing.events);

        Health.AddTo(thing);

        expect(thing)
          .respondsTo('damage').and
          .respondsTo('getHealth').and
          .respondsTo('heal').and
          .respondsTo('isAlive').and
          .respondsTo('isDead').and
          .respondsTo('revive').and
          .respondsTo('reviveAtMaxHealth').and
          .respondsTo('setHealth').and
          .respondsTo('setMaxHealth');
      });
    });
  });

  describe('Health.Dump()', function () {
    it('prints to console (without error)', function () {
      expect(function () {
        Health.Dump([sprite]);
      }).not.to.throw();
    });
  });

  describe('Health.Damage()', function () {
    context('passing no amount', function () {
      it('decreases the target’s health by 1', function () {
        expect(function () {
          Health.Damage(sprite);
        })
          .decreases(function () { return sprite.getHealth(); })
          .by(1);
      });
    });

    context('passing nonzero amount', function () {
      it('decreases the target’s health by amount', function () {
        expect(function () {
          Health.Damage(sprite, 2);
        })
          .decreases(function () { return sprite.getHealth(); })
          .by(2);
      });
    });
  });

  describe('Health.Heal()', function () {
    context('passing no amount', function () {
      it('increases the target’s health by 1', function () {
        expect(function () {
          Health.Heal(sprite);
        })
          .increases(function () {
            return sprite.getHealth();
          })
          .by(1);
      });
    });

    context('passing a nonzero amount', function () {
      it('increases the target’s health by the amount', function () {
        expect(function () {
          Health.Heal(sprite, 2);
        })
          .increases(function () {
            return sprite.getHealth();
          })
          .by(2);
      });
    });
  });

  describe('Health.IsAlive()', function () {
    context('when health > 0', function () {
      it('returns true', function () {
        sprite.setHealth(1);
        expect(Health.IsAlive(sprite)).is.true;
      });
    });

    context('when health is 0', function () {
      it('returns false', function () {
        sprite.setHealth(0);
        expect(Health.IsAlive(sprite)).is.false;
      });
    });

    context('when health < 0', function () {
      it('returns false', function () {
        sprite.setHealth(-1);
        expect(Health.IsAlive(sprite)).is.false;
      });
    });
  });

  describe('Health.IsDead()', function () {
    context('when health > 0', function () {
      it('returns false', function () {
        sprite.setHealth(1);
        expect(Health.IsDead(sprite)).is.false;
      });
    });

    context('when health is 0', function () {
      it('returns true', function () {
        sprite.setHealth(0);
        expect(Health.IsDead(sprite)).is.true;
      });
    });

    context('when health < 0', function () {
      it('returns true', function () {
        sprite.setHealth(-1);
        expect(Health.IsDead(sprite)).is.true;
      });
    });
  });

  describe('Health.Kill()', function () {
    it('changes the target’s health to 0', function () {
      Health.Kill(sprite);
      expect(sprite.getHealth()).to.equal(0);
    });
  });

  describe('Health.MixinTo()', function () {
    context('passing a class', function () {
      it('adds the component methods to the class', function () {
        var Thing = function () {
          this.events = new Phaser.Events.EventEmitter();
          this.data = new Phaser.Data.DataManager(this, this.events);
        };

        Object.assign(Thing.prototype, {
          getData: Phaser.GameObjects.GameObject.prototype.getData,
          setData: Phaser.GameObjects.GameObject.prototype.setData,
          setDataEnabled: Phaser.GameObjects.GameObject.prototype.setDataEnabled
        });

        Health.MixinTo(Thing);

        expect(Thing)
          .respondsTo('damage').and
          .respondsTo('getHealth').and
          .respondsTo('heal').and
          .respondsTo('isAlive').and
          .respondsTo('isDead').and
          .respondsTo('revive').and
          .respondsTo('reviveAtMaxHealth').and
          .respondsTo('setHealth').and
          .respondsTo('setMaxHealth');
      });
    });
  });

  describe('Health.Revive()', function () {
    context('passing no amount', function () {
      it('sets the target’s health to 1', function () {
        sprite.setHealth(0);
        expect(sprite.getHealth()).equals(0);
        Health.Revive(sprite);
        expect(sprite.getHealth()).equals(1);
      });
    });

    context('passing an amount', function () {
      it('sets the target’s health to the amount', function () {
        sprite.setHealth(0);
        expect(sprite.getHealth()).equals(0);
        Health.Revive(sprite, 2);
        expect(sprite.getHealth()).equals(2);
      });
    });
  });

  describe('Health.ReviveAtMaxHealth()', function () {
    it('sets the target’s health to its maximum', function () {
      sprite.setHealth(0);
      expect(sprite.getHealth()).equals(0);
      Health.ReviveAtMaxHealth(sprite);
      expect(sprite.getHealth()).equals(100);
    });
  });

  describe('Health.Actions.Damage()', function () {
    context('passing no amount', function () {
      it('decreases each target’s health by 1', function () {
        expect(function () {
          Health.Actions.Damage([sprite]);
        })
          .decreases(function () {
            return sprite.getHealth();
          })
          .by(1);
      });
    });

    context('passing nonzero amount', function () {
      it('decreases each target’s health by amount', function () {
        expect(function () {
          Health.Actions.Damage([sprite], 2);
        })
          .decreases(function () {
            return sprite.getHealth();
          })
          .by(2);
      });
    });
  });

  describe('Health.Actions.Heal()', function () {
    context('passing no amount', function () {
      it('increases each target’s health by 1', function () {
        expect(function () {
          Health.Actions.Heal([sprite]);
        })
          .increases(function () {
            return sprite.getHealth();
          })
          .by(1);
      });
    });

    context('passing a nonzero amount', function () {
      it('increases each target’s health by the amount', function () {
        expect(function () {
          Health.Actions.Heal([sprite], 2);
        })
          .increases(function () {
            return sprite.getHealth();
          })
          .by(2);
      });
    });
  });

  describe('Health.Actions.Kill()', function () {
    it('changes each target’s health to 0', function () {
      Health.Actions.Kill([sprite]);
      expect(sprite.getHealth()).to.equal(0);
    });
  });

  describe('Health.Actions.Revive()', function () {
    context('passing no amount', function () {
      it('sets each target’s health to 1', function () {
        sprite.setHealth(0);
        expect(sprite.getHealth()).equals(0);
        Health.Actions.Revive([sprite]);
        expect(sprite.getHealth()).equals(1);
      });
    });

    context('passing an amount', function () {
      it('sets each target’s health to the amount', function () {
        sprite.setHealth(0);
        expect(sprite.getHealth()).equals(0);
        Health.Actions.Revive([sprite], 2);
        expect(sprite.getHealth()).equals(2);
      });
    });
  });

  describe('Health.Actions.ReviveAtMaxHealth()', function () {
    it('sets the target’s health to its maximum', function () {
      sprite.setHealth(0);
      expect(sprite.getHealth()).equals(0);
      Health.ReviveAtMaxHealth(sprite);
      expect(sprite.getHealth()).equals(100);
    });
  });

  describe('Health.Actions.SetHealth()', function () {
    context('passing health', function () {
      it('sets the health of each object', function () {
        sprite.setHealth(1);
        Health.Actions.SetHealth([sprite], 2);
        expect(sprite.getHealth()).equals(2);
      });
    });

    context('passing maxHealth', function () {
      it('sets the maxHealth of each object', function () {
        sprite.setMaxHealth(3);
        Health.Actions.SetHealth([sprite], 1, 4);
        expect(sprite.getMaxHealth()).equals(4);
      });
    });
  });

  describe('Health.Events.DAMAGE', function () {
    it('is `damage`', function () {
      expect(Health.Events.DAMAGE).equals('damage');
    });
  });

  describe('Health.Events.DIE', function () {
    it('is `die`', function () {
      expect(Health.Events.DIE).equals('die');
    });
  });

  describe('Health.Events.HEAL', function () {
    it('is `heal`', function () {
      expect(Health.Events.HEAL).equals('heal');
    });
  });

  describe('Health.Events.HEALTH_CHANGE', function () {
    it('is `healthchange`', function () {
      expect(Health.Events.HEALTH_CHANGE).equals('healthchange');
    });
  });

  describe('Health.Events.REVIVE', function () {
    it('is `revive`', function () {
      expect(Health.Events.REVIVE).equals('revive');
    });
  });

  describe('Health.HealthComponent#getHealth()', function () {
    it('returns health', function () {
      expect(sprite.getHealth()).equals(1);
    });
  });

  describe('Health.HealthComponent#getHealthFrac()', function () {
    it('returns (health / maxHealth)', function () {
      sprite.setMaxHealth(100);
      sprite.setHealth(100);
      expect(sprite.getHealthFrac()).equals(1);
      sprite.setHealth(10);
      expect(sprite.getHealthFrac()).equals(0.1);
      sprite.setHealth(0);
      expect(sprite.getHealthFrac()).equals(0);
      sprite.setHealth(-10);
      expect(sprite.getHealthFrac()).equals(-0.1);
    });
  });

  describe('Health.HealthComponent#getMaxHealth()', function () {
    it('returns maxHealth', function () {
      expect(sprite.getMaxHealth()).equals(100);
    });
  });

  describe('Health.HealthComponent#isAlive()', function () {
    context('when health > 0', function () {
      it('returns true', function () {
        sprite.setHealth(1);
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

  describe('Health.HealthComponent#isDead()', function () {
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

  describe('Health.HealthComponent#setHealth()', function () {
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

  describe('Health.HealthComponent#setMaxHealth()', function () {
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

      it('fires `healthchange`, passing the object, change amount, health, and maxHealth', function () {
        var healthchange = spy();
        sprite.setHealth(3).once('healthchange', healthchange).setMaxHealth(2);
        expect(healthchange).is.called.with.exactly(sprite, -1, 2, 2);
      });
    });
  });

  describe('Health.HealthComponent#damage()', function () {
    context('passing no amount', function () {
      it('decreases health by 1', function () {
        expect(function () { sprite.damage(); })
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

    context('passing nonzero amount', function () {
      it('decreases health by amount', function () {
        expect(function () { sprite.damage(2); })
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

  describe('Health.HealthComponent#heal()', function () {
    context('passing no amount', function () {
      it('increases health by 1', function () {
        expect(function () { sprite.heal(); })
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

    context('passing nonzero amount', function () {
      it('increases health by amount', function () {
        expect(function () { sprite.heal(2); })
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

    context('passing silent = true', function () {
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

  describe('Health.HealthComponent#kill()', function () {
    context('when object is alive', function () {
      it('sets health to 0', function () {
        sprite.setHealth(1);
        sprite.kill();
        expect(sprite.getHealth()).equals(0);
      });
    });
    context('when object is dead', function () {
      it('does not change health', function () {
        sprite.setHealth(-1);
        sprite.kill();
        expect(sprite.getHealth()).equals(-1);
      });
    });
  });

  describe('Health.HealthComponent#revive()', function () {
    context('passing no amount', function () {
      context('when object is alive', function () {
        it('does not change health', function () {
          sprite.setHealth(2);
          sprite.revive();
          expect(sprite.getHealth()).equals(2);
        });
      });
      context('when object is dead', function () {
        it('sets health to 1', function () {
          sprite.kill();
          sprite.revive();
          expect(sprite.getHealth()).equals(1);
        });
      });
    });

    context('passing an amount', function () {
      context('when object is alive', function () {
        it('does not change health', function () {
          sprite.setHealth(1);
          sprite.revive(2);
          expect(sprite.getHealth()).equals(1);
        });
      });
      context('when object is dead', function () {
        it('sets health to the amount', function () {
          sprite.kill();
          sprite.revive(2);
          expect(sprite.getHealth()).equals(2);
        });
      });
    });
  });

  describe('Health.HealthComponent#reviveAtMaxHealth()', function () {
    context('when object is alive', function () {
      it('does not change health', function () {
        sprite.setHealth(1);
        sprite.reviveAtMaxHealth();
        expect(sprite.getHealth()).equals(1);
      });
    });
    context('when object is dead', function () {
      it('sets health to maximum', function () {
        sprite.kill();
        sprite.reviveAtMaxHealth();
        expect(sprite.getHealth()).equals(100);
      });
    });
  });
});

mocha.checkLeaks();
mocha.globals(['Phaser']);
mocha.run();
