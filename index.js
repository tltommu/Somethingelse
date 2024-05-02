const fs = require('fs');

class Character {
  constructor(name, health, attackDamage) {
    this.name = name;
    this.health = health;
    this.attackDamage = attackDamage;
  }

  attack(target) {
    const damage = Math.floor(Math.random() * this.attackDamage) + 1;
    target.health -= damage;
    console.log(`${this.name} attacks ${target.name} for ${damage} damage.`);
    console.log(`${target.name}'s health is now ${target.health}.`);
    if (target.health <= 0) {
      console.log(`${target.name} has been defeated!`);
      console.log(`${this.name} wins!`);
      return true;
    }
    return false;
  }
}

class Player extends Character {
  constructor(name, health, attackDamage, level, exp) {
    super(name, health, attackDamage);
    this.level = level || 1;
    this.exp = exp || 0;
    this.expToLevelUp = this.calculateExpForNextLevel();
  }

  attack(target) {
    const defeated = super.attack(target);
    if (defeated) {
      this.exp += 10;
      console.log(`${this.name} gains 10 experience points.`);
      if (this.exp >= this.expToLevelUp) {
        this.levelUp();
      } else {
        console.log(`${this.name} needs ${this.expToLevelUp - this.exp} experience points to level up.`);
        console.log(`${this.name} is currently at level ${this.level}.`);
      }
      this.savePlayerData();
    }
  }

  levelUp() {
    this.level++;
    console.log(`${this.name} leveled up to level ${this.level}!`);
    this.exp -= this.expToLevelUp;
    this.expToLevelUp = this.calculateExpForNextLevel();
    console.log(`${this.name} needs ${this.expToLevelUp} experience points to level up.`);
    this.savePlayerData();
  }

  calculateExpForNextLevel() {
    return Math.floor(this.level * (10 * Math.pow(1.05, this.level)) + 5);
  }

  savePlayerData() {
    const data = {
      level: this.level,
      exp: this.exp
    };
    fs.writeFileSync('playerData.json', JSON.stringify(data));
  }

  static loadPlayerData() {
    try {
      const data = JSON.parse(fs.readFileSync('playerData.json'));
      return new Player("Player", 100, 20, data.level, data.exp);
    } catch (error) {
      console.log("Error loading player data:", error.message);
      return new Player("Player", 100, 20);
    }
  }
}

const player = Player.loadPlayerData();
const bot = new Character("Bot", 100, 15);

let round = 1;
while (player.health > 0 && bot.health > 0) {
  console.log(`Round ${round}`);
  console.log("-----------------------------");
  if (Math.random() < 0.5) {
    player.attack(bot);
  } else {
    bot.attack(player);
  }
  console.log("-----------------------------");
  round++;
}
function displayPlayerInfo() {
  document.getElementById("playerHealth").innerText = "Health: " + player.health;
  document.getElementById("playerLevel").innerText = "Level: " + player.level;
  document.getElementById("playerExp").innerText = "Experience: " + player.exp;
}

function displayBotInfo() {
  document.getElementById("botHealth").innerText = "Health: " + bot.health;
}

function startBattle() {
  let round = 1;
  while (player.health > 0 && bot.health > 0) {
      console.log(`Round ${round}`);
      console.log("-----------------------------");
      if (Math.random() < 0.5) {
          player.attack(bot);
      } else {
          bot.attack(player);
      }
      displayPlayerInfo();
      displayBotInfo();
      console.log("-----------------------------");
      round++;
  }
}