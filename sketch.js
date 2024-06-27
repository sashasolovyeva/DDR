let keys = [37, 38, 39, 40];

let arrowX = 200;
let arrowY = 0;
let arrow_inc = 100;
let arrowSize = 150;
let dir;
let arrowsArray = [];

let hydra;
let hc;
let osc = [];

var selectMode = true;
var playMode;

let arrow;
let arrowCount = 1;

let audio = {
    raymode: [],
    normalmode: [60, 64, 68, 69],
    alicemode: [],
    catmode: []
};

let alicePics = [];
let lucya;

let monoSynth;
let soundOsc = [];

let reverbEffects = [];

function preload() {
    // arrow images
    arrow = loadImage('assets/arrow.svg');

    lucya = loadImage('assets/catmode.png');

    for(let i = 0; i < 4; i++) {
        audio.raymode[i] = loadSound('assets/raymode_' + i + '.wav');
        alicePics[i] = loadImage('assets/alicemode_' + i + '.png');
        audio.alicemode[i] = loadSound('assets/alicemode_' + i + '.mp3');
        audio.catmode[i] = loadSound('assets/catmode_' + i + '.wav');
    }
}

function setup() {
    // p5 setup
    let p5Canvas = createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    imageMode(CENTER);

    // hydra setup
    let hydraCanvas = document.getElementById("hydraCanvas");
    hydraCanvas.width = windowWidth;
    hydraCanvas.height = windowHeight;
    hc = select("#hydraCanvas");
    hc.hide();
    hydra = new Hydra({ canvas: hydraCanvas, detectAudio: false });
    hydra.synth.s0.init({src: p5Canvas.canvas});
    hydra.synth.osc(10, .1, () => 3 * mouseX / windowWidth).diff(s0).rotate(.1, .1).scale(() => 1 + 0.1 * (mouseY / windowHeight)).kaleid().out();

    // audio effects initialize
    // monoSynth = new p5.MonoSynth();
    for(let i = 0; i < 4; i++) {
        soundOsc.push(new p5.TriOsc());
        soundOsc[i].start();
        soundOsc[i].amp(0);
    }
}

function draw() {
    image(hc, width / 2, height / 2);

    for (let i = 0; i < arrowsArray.length; i++) {
        arrowsArray[i].display();

        if (arrowsArray[i].move() > height) {
            arrowsArray.splice(i, 1);
        }
    }
}

function keyPressed() {
    switch (keyCode) {
        case 37:
            order = 0;
            break;
        case 40:
            order = 1;
            break;
        case 38:
            order = 2;
            break;
        case 39:
            order = 3;
            break;
        default:
            break;
    }

    if (playMode) {
        let newArrow = new Arrow(arrow_inc + arrowX * order, arrowY, order);
        arrowsArray.push(newArrow);
        newArrow.playSound();

        arrowCount++;
        console.log(arrowCount);
    }

    if(arrowCount % 24 == 0) {
        for(let i = 0; i < audio.normalmode.length; i++) {
            console.log(audio.normalmode[i]);
            // if(audio.normalmode[i] < 115) {
            //     audio.normalmode[i] += 12;
            // }
        }
    }
}

function keyReleased() {
    switch (keyCode) {
        case 37:
            order = 0;
            break;
        case 40:
            order = 1;
            break;
        case 38:
            order = 2;
            break;
        case 39:
            order = 3;
            break;
        default:
            break;
    }

    if (playMode) {
        for (let i = 0; i < arrowsArray.length; i++) {
            if (order === arrowsArray[i].direction) {
                arrowsArray[i].stopSound();
            }
        }
    }
}

class Arrow {
    constructor(x, y, order) {
        this.x = x;
        this.y = y;
        this.speed = 5;
        this.direction = order;
        let angles = [0, -90, 90, 180];
        this.angle = angles[this.direction];
    }

    display() {
        push();
        translate(this.x, this.y);
        rotate(this.angle);
        if(playMode === 'alicemode') {
            alicePics[this.direction].mask(arrow);
            image(arrow, 0, 0, arrowSize, arrowSize);
            image(alicePics[this.direction], 0, 0, arrowSize, arrowSize);
        } else if (playMode === 'catmode') {
            image(lucya, 0, 0, arrowSize, arrowSize);
        } else {
            image(arrow, 0, 0, arrowSize, arrowSize);
        }
        pop();
    }

    move() {
        this.y += 5;
        return this.y;
    }

    playSound() {
        if (playMode === 'raymode') {
            // let reverbEffect = new p5.Reverb();
            // audio.raymode[this.direction].disconnect();
            // reverbEffect.process(audio.raymode[this.direction], 3, 2);
            // audio.raymode[this.direction].setVolume(1);
            audio.raymode[this.direction].play();
            // reverbEffects.push(reverbEffect);

        } else if (playMode === 'normalmode') {
            let frequency = midiToFreq(audio.normalmode[this.direction]);
            soundOsc[this.direction].freq(frequency);
            soundOsc[this.direction].fade(1, 0.4);

        } else if (playMode === 'alicemode') {
            audio.alicemode[this.direction].play();
            audio.alicemode[this.direction].setVolume(0.2);

        } else if (playMode === 'catmode') {
            audio.catmode[this.direction].play();
            audio.catmode[this.direction].setVolume(0.2);
        }
    }

    stopSound() {
        if (playMode === 'raymode') {
            // audio.raymode[this.direction].setVolume(0);
            audio.raymode[this.direction].stop();
            // let reverbEffect = reverbEffects.pop();
            // reverbEffect.set(1, 2);

        } else if (playMode === 'normalmode') {
            soundOsc[this.direction].fade(0, 2);
        }
    }
}
