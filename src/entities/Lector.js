import { Enemy } from '/Enemy.js';


export class Lector extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y);
        
        this.hp = 120;
        this.maxHp = 120;
        this.speed = 50;
        this.damage = 20;
        this.attackCooldown = 2000;
        this.lastAttack = 0;
        this.summonCooldown = 5000;
        this.lastSummon = 0;
        
        this.setTint(0x6633cc);
        this.setScale(1.5);
    }

    update(time) {
        if (!this.target) return;
        
        const dist = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
        
        // Держит дистанцию
        if (dist > 250) {
            this.scene.physics.moveToObject(this, this.target, this.speed);
        } else if (dist < 180) {
            const angle = Phaser.Math.Angle.Between(this.target.x, this.target.y, this.x, this.y);
            this.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);
        } else {
            this.setVelocity(0, 0);
        }
        
        this.rotation = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
        
        // Дистанционная атака
        if (time > this.lastAttack && dist < 400) {
            this.rangedAttack();
            this.lastAttack = time + this.attackCooldown;
        }
        
        // Призыв мобов
        if (time > this.lastSummon) {
            this.summonMinions();
            this.lastSummon = time + this.summonCooldown;
        }
    }

    rangedAttack() {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
        const bullet = this.scene.add.sprite(this.x, this.y, 'player');
        bullet.setTint(0x6633cc);
        bullet.setScale(0.6);
        bullet.rotation = angle;
        bullet.damage = this.damage;
        
        const distance = 400;
        const targetX = this.x + Math.cos(angle) * distance;
        const targetY = this.y + Math.sin(angle) * distance;
        
        this.scene.tweens.add({
            targets: bullet,
            x: targetX,
            y: targetY,
            duration: 800,
            onUpdate: () => {
                if (!bullet || !bullet.active) return;
                if (this.scene.player) {
                    const dist = Phaser.Math.Distance.Between(bullet.x, bullet.y, this.scene.player.x, this.scene.player.y);
                    if (dist < 30) {
                        this.scene.player.takeDamage(bullet.damage);
                        bullet.destroy();
                    }
                }
            },
            onComplete: () => { if (bullet && bullet.active) bullet.destroy(); }
        });
    }

    summonMinions() {
        for (let i = 0; i < 2; i++) {
            const angle = (i / 2) * Math.PI * 2;
            const x = this.x + Math.cos(angle) * 50;
            const y = this.y + Math.sin(angle) * 50;
            
            const minion = new Enemy(this.scene, x, y);
            minion.setTarget(this.target);
            minion.setTint(0xcc6666);
            
            if (this.scene.enemies) {
                this.scene.enemies.add(minion);
            }
        }
    }
}