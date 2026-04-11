const GameProgress = {
    courses: { 1: false, 2: false, 3: false, 4: false },
    complete: function(course) { this.courses[course] = true; },
    allCompleted: function() { return this.courses[1] && this.courses[2] && this.courses[3] && this.courses[4]; },
    reset: function() { this.courses = { 1: false, 2: false, 3: false, 4: false }; }
};

export class HubScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HubScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#2d2d4a');
        this.add.rectangle(400, 80, 600, 120, 0x8B0000, 0.3);
        this.add.text(400, 60, 'OBShchAGA', { fontSize: '48px', color: '#ffdd99', fontStyle: 'bold' }).setOrigin(0.5);
        this.add.text(400, 110, 'Room 313', { fontSize: '18px', color: '#aaa' }).setOrigin(0.5);
        this.add.text(400, 170, 'Choose course (1-4):', { fontSize: '20px', color: '#fff' }).setOrigin(0.5);
        
        const courses = [
            { n: 1, c: 0x44aa44, x: 180 },
            { n: 2, c: 0xaaaa44, x: 300 },
            { n: 3, c: 0xaa6644, x: 420 },
            { n: 4, c: 0xaa4444, x: 540 }
        ];
        
        courses.forEach(c => {
            const completed = GameProgress.courses[c.n];
            const color = completed ? 0x555555 : c.c;
            const btn = this.add.rectangle(c.x, 280, 100, 80, color, 0.8);
            
            if (!completed) {
                btn.setInteractive();
                btn.on('pointerdown', () => this.scene.start('DungeonScene', { course: c.n, room: 1 }));
                btn.on('pointerover', () => btn.setFillStyle(c.c, 1));
                btn.on('pointerout', () => btn.setFillStyle(c.c, 0.8));
            }
            
            this.add.text(c.x, 265, c.n.toString(), { fontSize: '28px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
            this.add.text(c.x, 290, 'Course', { fontSize: '16px', color: '#fff' }).setOrigin(0.5);
            
            if (completed) {
                this.add.text(c.x, 315, '✓ DONE', { fontSize: '12px', color: '#0f0' }).setOrigin(0.5);
            }
        });
        
        const diplomaUnlocked = GameProgress.allCompleted();
        const diplomaColor = diplomaUnlocked ? 0xffaa00 : 0x555555;
        const completedCount = Object.values(GameProgress.courses).filter(v => v).length;
        const diplomaText = diplomaUnlocked ? '🎓 DIPLOM' : `🔒 DIPLOM (${completedCount}/4)`;
        
        const diplomaBtn = this.add.rectangle(400, 420, 200, 60, diplomaColor, 0.8);
        if (diplomaUnlocked) {
            diplomaBtn.setInteractive();
            diplomaBtn.on('pointerdown', () => this.scene.start('BossScene'));
            diplomaBtn.on('pointerover', () => diplomaBtn.setFillStyle(0xffcc00, 1));
            diplomaBtn.on('pointerout', () => diplomaBtn.setFillStyle(0xffaa00, 0.8));
        }
        this.add.text(400, 420, diplomaText, { fontSize: '24px', color: diplomaUnlocked ? '#fff' : '#999' }).setOrigin(0.5);
        
        this.add.text(400, 550, 'WASD: move | Mouse: shoot | SPACE: dash | ESC: back', { fontSize: '14px', color: '#888' }).setOrigin(0.5);
    }
}