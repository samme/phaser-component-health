export const dumpMap = function (obj) {
  return {
    name: obj.name,
    alive: obj.isAlive(),
    health: obj.getHealth(),
    minHealth: obj.getMinHealth(),
    maxHealth: obj.getMaxHealth()
  };
};
