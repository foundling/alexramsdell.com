const log = console.log;
const Player = function(imgs, ctx, coordinates, mass) {

    if (!imgs || !imgs.length) throw new Error('Player object needs one or more images with source properties.');
    if (!ctx || !ctx.canvas) throw new Error('Player object must be instantiated with a canvas object reference');
    if (!(coordinates.x && coordinates.y)) throw new Error('Player object must be instantiated with x and y coordinates.');

    let images = {
        left: imgs[0],
        right: imgs[1]
    };
    let imageDirection = 'right';
    let img = images[imageDirection];

    const GRAVITY = 0.5;
    let velocity = { x: 0, y: 0 };
    let inAir = false;

    function dispatch (event) {

        switch(event.key) {

            case 'ArrowUp':     jump();
                                break;

            case 'ArrowLeft':   moveLeft();
                                break;

            case 'ArrowRight':  moveRight();
                                break;

        }
    } 
    function jump(e) {
        if (!inAir) { 
            velocity.y = -20;
            velocity.x = 0;
            inAir = true;
            animate();
        }
    }
    function moveLeft(e) {
        updateDirection('left');
        velocity.x = -50;
        if (!inAir) {
            velocity.y = 0;
            animate();
        }
    }
    function moveRight(e) {
        updateDirection('right');
        velocity.x = 50;
        if (!inAir) {
            velocity.y = 0;
        }
        animate();
    }

    document.addEventListener('keydown', dispatch);

    function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, coordinates.x, coordinates.y); 
    }
    function updateState() {
        velocity.y += GRAVITY;
        coordinates.y += velocity.y;
        coordinates.x += velocity.x;  
    }
    function animate() {
        let intervalHandle = setInterval(function() {

            updateState();
            redraw();

            if (coordinates.y >= 150) {
                coordinates.y = 150;
                velocity.y = -20;
                clearInterval(intervalHandle);
                inAir = false;
            } 

        }, 1000/60); 

    }
    function updateDirection(key) {

        if (imageDirection === 'right' && key === 'left') {

            imageDirection = 'left';
            img = images[imageDirection];
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, coordinates.x, coordinates.y);

        } else if (imageDirection === 'left' && key === 'right') {

            imageDirection = 'right';
            img = images[imageDirection];
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, coordinates.x, coordinates.y);

        }

    }
    function init() {
        ctx.drawImage(img, coordinates.x, coordinates.y); 
    }

    return {
        init,
        updateState
    };

};

function run() {

    log('Initializing Calvin ...');

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const imgs = [ new Image(), new Image() ];
    let imagesLoaded = 0;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    imgs[0].src = canvas.dataset.playerLeftSrc;
    imgs[1].src = canvas.dataset.playerRightSrc;

    imgs.forEach(function(img) {

        img.addEventListener('load', function() {

            if ( ++imagesLoaded < 2 ) return;

            const calvin = new Player(imgs, ctx, {x: 100, y: 150}, 100);
            calvin.init();

        });

    });
}

run();
