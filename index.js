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
    constructor(name, health, attackDamage) {
      super(name, health, attackDamage);
      this.level = 1;
      this.exp = 0;
      this.expToLevelUp = 15;
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
        this.expToLevelUp = Math.floor(this.expToLevelUp * 1.05) + 5;
        console.log(`${this.name} needs ${this.expToLevelUp} experience points to level up.`);
        this.savePlayerData();
      }
    
      savePlayerData() {
        localStorage.setItem('playerData', JSON.stringify({
          level: this.level,
          exp: this.exp
        }));
      }
    
      static loadPlayerData() {
        const data = JSON.parse(localStorage.getItem('playerData'));
        if (data) {
          return new Player("Player", 100, 20, data.level, data.exp);
        } else {
          return new Player("Player", 100, 20);
        }
    }
  }
  
  const player = new Player("Player", 100, 20);
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