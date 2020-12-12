var expect = chai.expect;
var spy = chai.spy;
var Health = PhaserHealth;

var game;
var scene;
var sprite;

mocha.setup({
  allowUncaught: true,
  bail: true,
  ui: 'bdd'
});

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

  beforeEach('create sprite and add health component', function () {
    sprite = scene.add.sprite();
    Health.AddTo(sprite);
  });

  afterEach('destroy sprite', function () {
    sprite.destroy();
  });

  describe('AddTo()', function () {
    context('passing a game object', function () {
      it('adds the component methods to the object', function () {
        expect(sprite)
          .respondsTo('damage').and
          .respondsTo('getHealth').and
          .respondsTo('getHealthFrac').and
          .respondsTo('getMaxHealth').and
          .respondsTo('getMinHealth').and
          .respondsTo('heal').and
          .respondsTo('isAlive').and
          .respondsTo('isDead').and
          .respondsTo('revive').and
          .respondsTo('reviveAtMaxHealth').and
          .respondsTo('setHealth').and
          .respondsTo('setMaxHealth').and
          .respondsTo('setMinHealth');
      });

      context('passing no health', function () {
        it('sets health to 1', function () {
          expect(sprite.getHealth()).equals(1);
        });

        it('sets minHealth to -Infinity', function () {
          expect(sprite.getMinHealth()).equals(-Infinity);
        });

        it('sets maxHealth to 100', function () {
          expect(sprite.getMaxHealth()).equals(100);
        });
      });

      context('passing health (only)', function () {
        it('sets health', function () {
          Health.AddTo(sprite, 2);
          expect(sprite.getHealth()).equals(2);
        });

        it('sets minHealth to -Infinity', function () {
          Health.AddTo(sprite, 2);
          expect(sprite.getMinHealth()).equals(-Infinity);
        });

        it('sets maxHealth to 100', function () {
          Health.AddTo(sprite, 2);
          expect(sprite.getMaxHealth()).equals(100);
        });
      });

      context('passing minHealth', function () {
        it('sets minHealth', function () {
          Health.AddTo(sprite, 2, 0);
          expect(sprite.getMinHealth()).equals(0);
        });
      });

      context('passing maxHealth', function () {
        it('sets maxHealth', function () {
          Health.AddTo(sprite, 2, undefined, 3);
          expect(sprite.getMaxHealth()).equals(3);
        });
      });
    });

    context('passing an object (with the required methods)', function () {
      it('adds the component methods to the object', function () {
        var thing = {
          data: null,
          getData: Phaser.GameObjects.GameObject.prototype.getData,
          setData: Phaser.GameObjects.GameObject.prototype.setData,
          setDataEnabled: Phaser.GameObjects.GameObject.prototype.setDataEnabled
        };

        Object.assign(thing, Object.getPrototypeOf(Phaser.Events.EventEmitter.prototype));

        Phaser.Events.EventEmitter.call(thing);

        thing.data = new Phaser.Data.DataManager(thing);

        Health.AddTo(thing);

        expect(thing)
          .respondsTo('damage').and
          .respondsTo('getHealth').and
          .respondsTo('getHealthFrac').and
          .respondsTo('getMaxHealth').and
          .respondsTo('getMinHealth').and
          .respondsTo('heal').and
          .respondsTo('isAlive').and
          .respondsTo('isDead').and
          .respondsTo('revive').and
          .respondsTo('reviveAtMaxHealth').and
          .respondsTo('setHealth').and
          .respondsTo('setMaxHealth').and
          .respondsTo('setMinHealth');
      });
    });

    context('passing an object (custom implementation)', function () {
      it('adds the component methods to the object', function () {
        // eslint-disable-next-line no-new-func
        var noop = new Function();
        var thing = {
          data: new Map(),
          emit: noop,
          off: noop,
          on: noop,
          once: noop,
          getData: function (key) {
            return this.data.get(key);
          },
          setData: function (key, val) {
            return this.data.set(key, val);
          },
          setDataEnabled: noop
        };

        Health.AddTo(thing);

        expect(thing)
          .respondsTo('damage').and
          .respondsTo('getHealth').and
          .respondsTo('getHealthFrac').and
          .respondsTo('getMaxHealth').and
          .respondsTo('getMinHealth').and
          .respondsTo('heal').and
          .respondsTo('isAlive').and
          .respondsTo('isDead').and
          .respondsTo('revive').and
          .respondsTo('reviveAtMaxHealth').and
          .respondsTo('setHealth').and
          .respondsTo('setMaxHealth').and
          .respondsTo('setMinHealth');

        thing.setHealth(2);
        expect(thing.getHealth()).equals(2);
      });
    });
  });

  describe('Dump()', function () {
    it('prints to console (without error)', function () {
      expect(function () {
        Health.Dump([sprite]);
      }).not.to.throw();
    });
  });

  describe('Damage()', function () {
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

  describe('Heal()', function () {
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

  describe('IsAlive()', function () {
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

  describe('IsDead()', function () {
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

  describe('Kill()', function () {
    it('changes the target’s health to 0', function () {
      Health.Kill(sprite);
      expect(sprite.getHealth()).to.equal(0);
    });
  });

  describe('MixinTo()', function () {
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

  describe('Revive()', function () {
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

  describe('ReviveAtMaxHealth()', function () {
    it('sets the target’s health to its maximum', function () {
      sprite.setHealth(0);
      expect(sprite.getHealth()).equals(0);
      Health.ReviveAtMaxHealth(sprite);
      expect(sprite.getHealth()).equals(100);
    });
  });

  describe('Actions.Damage()', function () {
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

  describe('Actions.Heal()', function () {
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

  describe('Actions.Kill()', function () {
    it('changes each target’s health to 0', function () {
      Health.Actions.Kill([sprite]);
      expect(sprite.getHealth()).to.equal(0);
    });
  });

  describe('Actions.Revive()', function () {
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

  describe('Actions.ReviveAtMaxHealth()', function () {
    it('sets the target’s health to its maximum', function () {
      sprite.setHealth(0);
      expect(sprite.getHealth()).equals(0);
      Health.ReviveAtMaxHealth(sprite);
      expect(sprite.getHealth()).equals(100);
    });
  });

  describe('Actions.SetHealth()', function () {
    context('passing health', function () {
      it('sets the health of each object', function () {
        sprite.setHealth(1);
        Health.Actions.SetHealth([sprite], 2);
        expect(sprite.getHealth()).equals(2);
      });
    });

    context('passing minHealth', function () {
      it('sets the minHealth of each object', function () {
        sprite.setMinHealth(-10);
        Health.Actions.SetHealth([sprite], 1, 0, 4);
        expect(sprite.getMinHealth()).equals(0);
      });
    });

    context('passing maxHealth', function () {
      it('sets the maxHealth of each object', function () {
        sprite.setMaxHealth(3);
        Health.Actions.SetHealth([sprite], 1, undefined, 4);
        expect(sprite.getMaxHealth()).equals(4);
      });
    });
  });

  describe('Events.DAMAGE', function () {
    it('is `damage`', function () {
      expect(Health.Events.DAMAGE).equals('damage');
    });
  });

  describe('Events.DIE', function () {
    it('is `die`', function () {
      expect(Health.Events.DIE).equals('die');
    });
  });

  describe('Events.HEAL', function () {
    it('is `heal`', function () {
      expect(Health.Events.HEAL).equals('heal');
    });
  });

  describe('Events.HEALTH_CHANGE', function () {
    it('is `healthchange`', function () {
      expect(Health.Events.HEALTH_CHANGE).equals('healthchange');
    });
  });

  describe('Events.REVIVE', function () {
    it('is `revive`', function () {
      expect(Health.Events.REVIVE).equals('revive');
    });
  });

  describe('getHealth()', function () {
    it('returns health', function () {
      expect(sprite.getHealth()).equals(1);
    });
  });

  describe('getHealthFrac()', function () {
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

  describe('getMaxHealth()', function () {
    it('returns maxHealth', function () {
      expect(sprite.getMaxHealth()).equals(100);
    });
  });

  describe('isAlive()', function () {
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

      it('fires `healthchange`, passing the object, change amount, health, minHealth, and maxHealth', function () {
        var onHealthChange = spy();
        sprite.once('healthchange', onHealthChange).setHealth(2);
        expect(onHealthChange).is.called.with.exactly(sprite, 1, 2, -Infinity, 100);
      });
    });

    context('passing health amount greater than maxHealth', function () {
      it('sets health equal to maxHealth, not the greater amount', function () {
        sprite.setMaxHealth(100).setHealth(101);
        expect(sprite.getHealth()).equals(100);
      });

      it('fires `healthchange`, passing the actual change amount', function () {
        var onHealthChange = spy();
        sprite.once('healthchange', onHealthChange).setMaxHealth(100).setHealth(101);
        expect(onHealthChange).is.called.with.exactly(sprite, 99, 100, -Infinity, 100);
      });
    });

    context('passing health amount less than minHealth', function () {
      it('sets health equal to minHealth, not the lesser amount', function () {
        sprite.setMinHealth(0).setHealth(-1);
        expect(sprite.getHealth()).equals(0);
      });

      it('fires `healthchange`, passing the actual change amount', function () {
        var onHealthChange = spy();
        sprite.once('healthchange', onHealthChange).setMinHealth(0).setHealth(-1);
        expect(onHealthChange).is.called.with.exactly(sprite, -1, 0, 0, 100);
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
        sprite.once('healthchange', healthchange).setHealth(2, undefined, undefined, true);
        expect(healthchange).is.not.called();
      });
    });

    context('health decreases to 0', function () {
      it('fires `die`, passing the object', function () {
        var onDie = spy();
        sprite.setHealth(1).on('die', onDie).setHealth(0);
        expect(onDie).is.called.with.exactly(sprite);
      });
    });

    context('health decreases below 0', function () {
      it('fires `die`, passing the object', function () {
        var onDie = spy();
        sprite.setHealth(1).on('die', onDie).setHealth(-1);
        expect(onDie).is.called.with.exactly(sprite);
      });
    });

    context('health increases above 0', function () {
      it('fires `revive`, passing the object', function () {
        var onRevive = spy();
        sprite.setHealth(-1).on('revive', onRevive).setHealth(1);
        expect(onRevive).is.called.with.exactly(sprite);
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

    context('passing amount less than current health', function () {
      it('reduces health to maxHealth', function () {
        sprite.setHealth(3).setMaxHealth(2);
        expect(sprite.getHealth()).equals(2);
      });

      it('fires `healthchange`, passing the object, change amount, health, minHealth, and maxHealth', function () {
        var healthchange = spy();
        sprite.setHealth(3).once('healthchange', healthchange).setMaxHealth(2);
        expect(healthchange).is.called.with.exactly(sprite, -1, 2, -Infinity, 2);
      });
    });
  });

  describe('damage()', function () {
    context('passing no amount', function () {
      it('decreases health by 1', function () {
        expect(function () { sprite.damage(); })
          .decreases(function () { return sprite.getHealth(); })
          .by(1);
      });

      it('fires `damage`, passing the object and absolute damage amount', function () {
        var onDamage = spy();
        sprite.once('damage', onDamage).damage();
        expect(onDamage).is.called.with.exactly(sprite, 1);
      });

      it('fires `healthchange`, passing the object, change amount, health, minHealth, and maxHealth', function () {
        var onHealthChange = spy();
        sprite.once('healthchange', onHealthChange).damage();
        expect(onHealthChange).is.called.with.exactly(sprite, -1, 0, -Infinity, 100);
      });
    });

    context('passing nonzero amount', function () {
      it('decreases health by amount', function () {
        expect(function () { sprite.damage(2); })
          .decreases(function () { return sprite.getHealth(); })
          .by(2);
      });

      it('fires `damage`, passing the object and absolute damage amount', function () {
        var onDamage = spy();
        sprite.once('damage', onDamage).damage(2);
        expect(onDamage).is.called.with.exactly(sprite, 2);
      });

      it('fires `healthchange`, passing the object, change amount, health, minHealth, and maxHealth', function () {
        var onHealthChange = spy();
        sprite.once('healthchange', onHealthChange).damage(2);
        expect(onHealthChange).is.called.with.exactly(sprite, -2, -1, -Infinity, 100);
      });
    });

    context('passing amount = 0', function () {
      it('does not fire `damage`', function () {
        var onDamage = spy();
        sprite.once('damage', onDamage).damage(0);
        expect(onDamage).is.not.called();
      });

      it('does not fire `healthchange`', function () {
        var onHealthChange = spy();
        sprite.once('healthchange', onHealthChange).damage(0);
        expect(onHealthChange).is.not.called();
      });
    });

    context('passing amount greater than (minHealth - health)', function () {
      it('fires `damage` with the actual damage amount, not the greater amount', function () {
        var onDamage = spy();
        sprite.on('damage', onDamage).setMinHealth(0).damage(100);
        expect(onDamage).is.called.with.exactly(sprite, 1);
      });

      it('fires `healthchange` with the actual change amount', function () {
        var onHealthChange = spy();
        sprite.on('healthchange', onHealthChange).setMinHealth(0).damage(100);
        expect(onHealthChange).is.called.with.exactly(sprite, -1, 0, 0, 100);
      });
    });

    context('passing silent = true', function () {
      it('does not fire `damage`', function () {
        var onDamage = spy();
        sprite.once('damage', onDamage).damage(1, true);
        expect(onDamage).is.not.called();
      });

      it('does not fire `healthchange`', function () {
        var onHealthChange = spy();
        sprite.once('healthchange', onHealthChange).damage(1, true);
        expect(onHealthChange).is.not.called();
      });
    });
  });

  describe('heal()', function () {
    context('passing no amount', function () {
      it('increases health by 1', function () {
        expect(function () { sprite.heal(); })
          .increases(function () { return sprite.getHealth(); })
          .by(1);
      });

      it('fires `heal`, passing the object and heal amount', function () {
        var onHeal = spy();
        sprite.once('heal', onHeal).heal();
        expect(onHeal).is.called.with.exactly(sprite, 1);
      });

      it('fires `heal` after health changes', function () {
        expect(sprite.getHealth()).equals(1);
        sprite.once('heal', function () {
          expect(sprite.getHealth()).equals(2);
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
        var onHeal = spy();
        sprite.once('heal', onHeal).heal(2);
        expect(onHeal).is.called.with.exactly(sprite, 2);
      });
    });

    context('passing amount = 0', function () {
      it('does not fire `heal`', function () {
        var onHeal = spy();
        sprite.once('heal', onHeal).heal(0);
        expect(onHeal).is.not.called();
      });

      it('does not fire `healthchange`', function () {
        var onHealthChange = spy();
        sprite.once('healthchange', onHealthChange).heal(0);
        expect(onHealthChange).is.not.called();
      });
    });

    context('passing amount greater than (maxHealth - health)', function () {
      it('fires `heal` with the actual heal amount', function () {
        var onHeal = spy();
        sprite.on('heal', onHeal).heal(100);
        expect(onHeal).is.called.with.exactly(sprite, 99);
      });

      it('fires `healthchange` with the actual change amount', function () {
        var onHealthChange = spy();
        sprite.on('healthchange', onHealthChange).heal(100);
        expect(onHealthChange).is.called.with.exactly(sprite, 99, 100, -Infinity, 100);
      });
    });

    context('passing silent = true', function () {
      it('does not fire `heal`', function () {
        var onHeal = spy();
        sprite.once('heal', onHeal).heal(1, true);
        expect(onHeal).is.not.called();
      });

      it('does not fire `healthchange`', function () {
        var onHealthChange = spy();
        sprite.once('healthchange', onHealthChange).heal(1, true);
        expect(onHealthChange).is.not.called();
      });
    });
  });

  describe('kill()', function () {
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

  describe('revive()', function () {
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

  describe('reviveAtMaxHealth()', function () {
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
