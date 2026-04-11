import { Player } from '../entities/Player.js';
import { Enemy } from './entities/Enemy.js';
import { Lector } from '../entities/Lector.js';

const GameProgress = {
    courses: { 1: false, 2: false, 3: false, 4: false },
    complete: function(course) { this.courses[course] = true; }
};

export class DungeonScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DungeonScene' });
    }

    init(data) {
        this.course = data.course || 1;
        this.room = data.room || 1;
        this.roomCleared = false;
    }

    create() {
        this.cameras.main.setBackgroundColor('#2a2a3a');
        
        this.walls = this.physics.add.staticGroup();
        this.walls.create(16, 300, 'wall').setScale(1, 18).refreshBody();
        this.walls.create(784, 300, 'wall').setScale(1, 18).refreshBody();
        this.walls.create(400, 16, 'wall').setScale(25, 1).refreshBody();
        this.walls.create(400, 584, 'wall').setScale(25, 1).refreshBody();
        
        this.player = new Player(this, 400, 500);
        this.physics.add.collider(this.player, this.walls);
        
        this.enemies = this.physics.add.group();
        this.spawnEnemies();
        
        this.physics.add.collider(this.enemies, this.walls);
        this.physics.add.collider(this.player, this.enemies, (p, e) => {
            if (this.time.now > e.lastAttack) {
                p.takeDamage(e.damage);
                e.lastAttack = this.time.now + 1000;
            }
        });
        
        this.exitDoor = this.physics.add.sprite(750, 300, 'door').setImmovable(true);
        this.exitDoor.visible = false;
        this.exitDoor.body.enable = false;
        this.physics.add.collider(this.player, this.exitDoor, () => this.nextRoom());
        
        this.add.text(400, 30, `Course ${this.course} | Room ${this.room}`, { fontSize: '20px', color: '#fff' }).setOrigin(0.5);
        this.add.text(400, 550, 'WASD/Arrows | Mouse shoot | SPACE dash | ESC back', { fontSize: '14px', color: '#888' }).setOrigin(0.5);
        
        this.input.keyboard.on('keydown-ESC', () => this.scene.start('HubScene'));
    }

    spawnEnemies() {
        // Если 3-я комната — спавним Лектора
        if (this.room === 3) {
            const lector = new Lector(this, 400, 200);
            lector.setTarget(this.player);
            this.enemies.add(lector);
            
            // Добавляем пару обычных врагов
            for (let i = 0; i < 2; i++) {
                const e = new Enemy(this, 200 + i * 200, 350);
                e.setTarget(this.player);
                this.enemies.add(e);
            }
        } else {
            // Обычные враги
            const count = 2 + this.course;
            for (let i = 0; i < count; i++) {
                const e = new Enemy(this, 200 + i * 100, 200);
                e.setTarget(this.player);
                this.enemies.add(e);
            }
        }
    }

    update(time) {
        if (this.player) this.player.update(time, this.input.activePointer);
        this.enemies.getChildren().forEach(e => e.update(time));
        
        if (this.enemies.getLength() === 0 && !this.roomCleared) {
            this.roomCleared = true;
            this.exitDoor.visible = true;
            this.exitDoor.body.enable = true;
        }
    }

    nextRoom() {
        if (this.room < 5) {
            this.scene.restart({ course: this.course, room: this.room + 1 });
        } else {
            GameProgress.complete(this.course);
            this.scene.start('HubScene');
        }
    }
}