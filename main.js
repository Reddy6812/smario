var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var cursors;
var map;
var layer;

var game = new Phaser.Game(config);

function preload() {
    this.load.tilemapTiledJSON('map', 'https://labs.phaser.io/assets/tilemaps/maps/super-mario.json');
    this.load.image('tiles', 'https://labs.phaser.io/assets/tilemaps/tiles/super-mario.png');
    this.load.spritesheet('dude', 'https://labs.phaser.io/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    map = this.make.tilemap({ key: 'map' });
    var tileset = map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');
    layer = map.createLayer('World1', tileset, 0, 0);
    layer.setCollisionByExclusion([-1]);

    player = this.physics.add.sprite(50, 450, 'dude');
    player.setBounce(0.1);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, layer);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.onFloor()) {
        player.setVelocityY(-330);
    }
} 