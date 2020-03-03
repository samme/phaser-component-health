export const dumpMap = function (obj) {
  return {
    name: obj.name,
    alive: obj.isAlive(),
    health: obj.getHealth(),
    maxHealth: obj.getMaxHealth()
  };
};
