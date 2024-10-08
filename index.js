const drumItems = [
  { id: 1, value: 'iPhone' },
  { id: 2, value: 'Samsung' },
  { id: 3, value: 'Xiaomi' },
  { id: 4, value: 'Laptop' },
  { id: 5, value: 'TV' },
  { id: 6, value: 'Watch' },
  { id: 7, value: 'Acer' },
  { id: 8, value: 'Camera' },
  { id: 9, value: 'Tablet' },
  { id: 10, value: 'Console' },
  { id: 11, value: 'Speakers' },
  { id: 12, value: 'Voucher' }
];

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = canvas.clientWidth; 
canvas.height = canvas.clientHeight;
const width = canvas.width;
const height = canvas.height;
const centerX = width / 2;
const centerY = height / 2;
const radius = width / 2;
let currentDeg = 0;
let step = 360 / drumItems.length;
let colors = ['#ed1c24', '#ffffff'];
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, '#c26102');
gradient.addColorStop(0.5, '#efd317');
gradient.addColorStop(1, '#e6d65c');
let itemDegs = {};

function toRad(deg) {
    return deg * (Math.PI / 180);
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, toRad(0), toRad(360));
    ctx.fillStyle = gradient;
    ctx.fill();

    let startDeg = currentDeg;
    for (let i = 0; i < drumItems.length; i++, startDeg += step) {
        let endDeg = startDeg + step;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 10, toRad(startDeg), toRad(endDeg));
        ctx.fillStyle = colors[i % colors.length];
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(toRad((startDeg + endDeg) / 2));
        ctx.textAlign = "center";
        ctx.fillStyle = colors[(i + 1) % colors.length];
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(drumItems[i].value, 130, 10);
        ctx.restore();

        itemDegs[drumItems[i].value] = {
            startDeg: startDeg,
            endDeg: endDeg
        };
    }
}

draw();

let speed = 0;
let maxRotation = 0;
let pause = false;

const predefinedResult = { id: 4, value: 'Laptop' };

function fetchResult() {
    return new Promise((resolve) => {
        resolve(predefinedResult);
    });
}

function animate() {
    if (pause) {
        return;
    }
    speed = easeOutSine(getPercent(currentDeg, maxRotation, 0)) * 20;
    if (speed < 0.01) {
        speed = 0;
        pause = true;
        return;
    }
    currentDeg += speed;
    draw();
    window.requestAnimationFrame(animate);
}

async function spin() {
    if (speed !== 0) {
        return;
    }

    const result = await fetchResult();
    const targetDeg = (itemDegs[result.value].startDeg + itemDegs[result.value].endDeg) / 2;

    const fullRotations = 360 * 5;

    let currentRotation = currentDeg % 360;
        
    const initialOffset = 360/drumItems.length + 2*(360/drumItems.length) * (predefinedResult.id - 1); 

    currentRotation = (currentRotation + initialOffset) % 360;
        
    if (currentRotation < 0) {
        currentRotation += 360;
    }

    let relativeTargetDeg = targetDeg - currentRotation;
        
    if (relativeTargetDeg < 0) {
        relativeTargetDeg += 360;
    }

    maxRotation = fullRotations + relativeTargetDeg;

    currentDeg = 0;
    pause = false;
    window.requestAnimationFrame(animate);
}


function easeOutSine(x) {
    return Math.sin((x * Math.PI) / 2);
}

function getPercent(input, min, max) {
    return (((input - min) * 100) / (max - min)) / 100;
}


