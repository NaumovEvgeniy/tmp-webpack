"use strict";
/*function component() {
    const element = document.createElement('div');

    element.innerHTML = ['Hello', 'world!'].join(',');

    return element;
}

document.body.appendChild(component());
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Examples
/*
enum Genres {
  Comedy= 'Comedy',
  Musical = 'Musical',
  Drama = 'Drama'
}

class Program {
  name: string;
  genre = Genres.Comedy;

  constructor(theName: string, theGenre: Genres) {
    this.name = theName;
    this.genre = theGenre;
  }

  duration(timeInMins: number = 60) {
    console.log(`${this.name} runs for ${timeInMins}mins. [${this.genre}]`);
  }
}

class Serie extends Program {
  constructor(name: string, genre: Genres) { super(name, genre); }

  duration(timeInMins: number = 40) {
    super.duration(timeInMins);
  }
}

class Movie extends Program {
  constructor(name: string, genre: Genres) { super(name, genre); }

  duration(timeInMins: number = 120) {
    super.duration(timeInMins);
  }
}

let lucifer = new Serie ("Lucifer", Genres.Drama);
let myJam = new Program("That's my jam", Genres.Musical);
let ellen: Program = new Movie ("Ellen DeGeneres: Relatable", Genres.Comedy);

lucifer.duration();
ellen.duration(90);
myJam.duration(50);
*/
require("./style.css");
const babylonjs_1 = require("babylonjs");
const car_1 = __importDefault(require("./car"));
const socket_io_client_1 = require("socket.io-client");
let usersCars = {};
//кнопки
var buttons = {};
var theta = 0; //угол поворота пер колеса
var deltaTheta = 0;
var D = 0; //скорость (ед в сек)
var R = 50; //расстояние от центра вращения до внутренней опоры
var NR; //новый радиус круга вращения
var A = 4; //длина оси
var L = 4; //расстояние м/у центрами вращения колес
var r = 1.5; //радиус колес
var psi, psiBackLeft, psiBackRight, psiFrontLeft, psiFrontRight; //поворот колес
var phi; //при повороте машины (за кадр)
var F; //фреймы в сек
var distance; //пройденное расстояние
const canvas = document.getElementById('canvas');
const engine = new babylonjs_1.Engine(canvas, true);
const axesFront = [
    new babylonjs_1.Vector3(-4.5, -1, -3.5),
    new babylonjs_1.Vector3(-4.5, -1, 3.5)
];
const axesBack = [
    new babylonjs_1.Vector3(2.5, -1, -3.8),
    new babylonjs_1.Vector3(2.5, -1, 3.8)
];
let pivotFrontLeft;
let pivotFrontRight;
let wheelFrontLeft;
let wheelFrontRight;
let wheelBackLeft;
let wheelBackRight;
let pivot;
let carTop;
let camera;
const createMaterialTexture = (name, scn, path) => {
    let material = new babylonjs_1.StandardMaterial(name, scn);
    material.diffuseTexture = new babylonjs_1.Texture(path, scn);
    return material;
};
const createMaterialColor = (name, scn, color) => {
    let material = new babylonjs_1.StandardMaterial(name, scn);
    material.diffuseColor = color;
    material.backFaceCulling = false;
    return material;
};
const rotateAllWheels = (wheelFrontLeft, wheelFrontRight, wheelBackLeft, wheelBackRight, angleFrontLeft, angleFrontRight, angleBackLeft, angleBackRight) => {
    wheelFrontLeft.rotate(babylonjs_1.Axis.Y, angleFrontLeft, babylonjs_1.Space.LOCAL);
    wheelFrontRight.rotate(babylonjs_1.Axis.Y, angleFrontRight, babylonjs_1.Space.LOCAL);
    wheelBackLeft.rotate(babylonjs_1.Axis.Y, angleBackLeft, babylonjs_1.Space.LOCAL);
    wheelBackRight.rotate(babylonjs_1.Axis.Y, angleBackRight, babylonjs_1.Space.LOCAL);
};
const pressedKey = (delta, pivotFrontLeft, pivotFrontRight, pivot, carTop) => {
    deltaTheta = delta;
    theta += deltaTheta;
    pivotFrontLeft.rotate(babylonjs_1.Axis.Y, deltaTheta, babylonjs_1.Space.LOCAL); //поворот передних
    pivotFrontRight.rotate(babylonjs_1.Axis.Y, deltaTheta, babylonjs_1.Space.LOCAL);
    //когда не близко к 0, вычисляем новый радиус вращения
    if (Math.abs(theta) > 0.00000001) {
        NR = A / 2 + L / Math.tan(theta);
    }
    else {
        theta = 0;
        NR = 0;
    }
    pivot.translate(babylonjs_1.Axis.Z, NR - R, babylonjs_1.Space.LOCAL); //перевести ось поворота в центр вращения из текущего положения
    carTop.translate(babylonjs_1.Axis.Z, R - NR, babylonjs_1.Space.LOCAL); //вернуть машину туда, где она была
    R = NR;
};
let car1 = new car_1.default(new babylonjs_1.Vector3(0, 2, 0), new babylonjs_1.Vector3(0, 0, -1.8), new babylonjs_1.Vector3(0, 0, 1.8), new babylonjs_1.Vector3(2.5, -1, -3.8), new babylonjs_1.Vector3(2.5, -1, 3.8), new babylonjs_1.Vector3(-4.5, -1, -2), new babylonjs_1.Vector3(-4.5, -1, 2), 50, new babylonjs_1.Vector3(0, 0, -50));
function afterRender(car) {
    F = engine.getFps();
    if (buttons[" "] && D < 40) {
        D += 1;
    }
    ;
    if (D > 0.15) {
        D -= 0.15;
    }
    else {
        D = 0;
    }
    distance = D / F;
    psi = D / (r * F);
    if ((buttons["a"] || buttons["A"]) && -Math.PI / 6 < theta) {
        pressedKey(-Math.PI / 252, car.pivotL, car.pivotR, car.pivot, car.topCar);
    }
    ;
    if ((buttons["d"] || buttons["D"]) && theta < Math.PI / 6) {
        pressedKey(Math.PI / 252, car.pivotL, car.pivotR, car.pivot, car.topCar);
    }
    ;
    if ((buttons["s"] || buttons["S"])) {
        D -= 0.5;
    }
    if (D > 0) {
        phi = D / (R * F);
        if (Math.abs(theta) > 0) {
            car.pivot.rotate(babylonjs_1.Axis.Y, phi, babylonjs_1.Space.WORLD);
            psiBackLeft = D / (r * F);
            psiBackRight = D * (R + A) / (r * F);
            psiFrontLeft = D * Math.sqrt(R * R + L * L) / (r * F);
            psiFrontRight = D * Math.sqrt((R + A) * (R + A) + L * L) / (r * F);
            rotateAllWheels(car.wheelFL, car.wheelFR, car.wheelBL, car.wheelBR, psiFrontLeft, psiFrontRight, psiBackLeft, psiBackRight);
        }
        else {
            car.pivot.translate(babylonjs_1.Axis.X, -distance, babylonjs_1.Space.LOCAL);
            rotateAllWheels(car.wheelFL, car.wheelFR, car.wheelBL, car.wheelBR, psi, psi, psi, psi);
        }
    }
}
const assembleCar = (car, color, scene) => {
    //Корпус машины
    let materialTop = createMaterialColor("materialtop", scene, color);
    carTop = car.createTop(3.0, 10.0, 4.0, "carTop", car.top, materialTop, scene);
    camera.parent = carTop;
    //Колеса
    let materialWheel = createMaterialTexture("texturew", scene, "/img/wheel.jpg");
    const colorWheel = [];
    colorWheel[1] = new babylonjs_1.Color4(0, 0, 0);
    pivotFrontLeft = car.createFrontPivotL("pivotFrontLeft", scene, carTop, car.pivotLeft);
    wheelFrontLeft = car.createFirstWheel(3, 1, 24, colorWheel, "wheelFrontLeft", scene, materialWheel, pivotFrontLeft, car.wheelFrontLeft);
    pivotFrontRight = car.createFrontPivotR("pivotFrontRight", scene, carTop, car.pivotRight);
    wheelFrontRight = car.createFRWheel(wheelFrontLeft, "wheelFrontRight", pivotFrontRight, car.wheelFrontRight);
    wheelBackLeft = car.createBLWheel(wheelFrontLeft, "wheelBackLeft", carTop, car.wheelBackLeft);
    wheelBackRight = car.createBRWheel(wheelFrontLeft, "wheelBackRight", carTop, car.wheelBackRight);
    pivot = car.createPivot("pivot", 0.1, scene, car.pivotZ);
    carTop.parent = pivot;
    carTop.position = car.topNew;
    //перегородки
    let materialTube = createMaterialColor("materialt", scene, new babylonjs_1.Color3(0, 0, 0));
    const tubeFront = car.createTube(0.15, "tubeFront", axesFront, materialTube, carTop, scene);
    const tubeBack = car.createTube(0.15, "tubeBack", axesBack, materialTube, carTop, scene);
};
const unassembleCar = (car) => {
    car.topCar.dispose();
};
const createScene = () => {
    const scene = new babylonjs_1.Scene(engine);
    scene.clearColor = new babylonjs_1.Color4(0.5, 0.8, 1);
    camera = new babylonjs_1.ArcRotateCamera("camera", 0, Math.PI / 2, 30, new babylonjs_1.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);
    const light = new babylonjs_1.HemisphericLight("light", new babylonjs_1.Vector3(1, 1, 0), scene);
    const ground = babylonjs_1.MeshBuilder.CreateGround("ground", { width: 3000, height: 1500 }, scene);
    ground.position = new babylonjs_1.Vector3(0, -2.5, 0);
    let materialGround = createMaterialTexture("textureg", scene, "/img/grass.jpg");
    ground.material = materialGround;
    //Окружение
    const frameRate = 10;
    const xSlide = new babylonjs_1.Animation("xSlide", "position.x", frameRate, babylonjs_1.Animation.ANIMATIONTYPE_FLOAT, babylonjs_1.Animation.ANIMATIONLOOPMODE_CYCLE);
    const keyFrames = [];
    keyFrames.push({
        frame: 0,
        value: 2,
    });
    keyFrames.push({
        frame: frameRate,
        value: -2,
    });
    keyFrames.push({
        frame: 2 * frameRate,
        value: 2,
    });
    xSlide.setKeys(keyFrames);
    const obj = babylonjs_1.MeshBuilder.CreateCylinder("obj", { diameter: 1.3, height: 1.2, tessellation: 3 });
    obj.scaling.x = 0.75;
    obj.rotation.z = Math.PI / 2;
    obj.position = new babylonjs_1.Vector3(0, -2, 10);
    const box = babylonjs_1.MeshBuilder.CreateBox("box", { height: 1.5, width: 3.0, depth: 2.0 });
    box.position = new babylonjs_1.Vector3(0, -2, -10);
    obj.animations.push(xSlide);
    box.animations.push(xSlide);
    scene.beginAnimation(obj, 0, 2 * frameRate, true);
    scene.beginAnimation(box, 0, 2 * frameRate, true);
    //assembleCar(car1, new Color3(Math.random(), Math.random(), Math.random()), scene);
    assembleCar(car1, new babylonjs_1.Color3(0, 0, 1), scene);
    ///////////////
    scene.actionManager = new babylonjs_1.ActionManager(scene);
    scene.actionManager.registerAction(new babylonjs_1.ExecuteCodeAction(babylonjs_1.ActionManager.OnKeyDownTrigger, function (evt) {
        buttons[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
    scene.actionManager.registerAction(new babylonjs_1.ExecuteCodeAction(babylonjs_1.ActionManager.OnKeyUpTrigger, function (evt) {
        buttons[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
    //движение
    scene.registerAfterRender(() => {
        afterRender(car1);
    });
    return scene;
};
window.onload = function () {
    const socket = (0, socket_io_client_1.io)('http://localhost:3000');
    /*socket.emit('clientToServer', "Hi, server!");
  
    socket.on('serverToClient', (data: any) => {
      alert(data);
    })*/
    let newCar = car1;
    socket.emit('newUser', { newCar });
    socket.on('updateUsers', (users) => {
        let usersFound = {};
        //добавляем нового
        for (let id in users) {
            if (usersCars[id] === undefined && id !== socket.id) {
                usersCars[id] = newCar;
                assembleCar(usersCars[id], new babylonjs_1.Color3(1, 0, 0), scene);
            }
            usersFound[id] = true;
        }
        //отсоединяем пользователя
        for (let id in usersCars) {
            if (!usersFound[id]) {
                //здесь нужно убирать машину с канваса
                //unassembleCar(usersCars[id]);
                delete usersCars[id];
            }
        }
    });
};
const scene = createScene();
engine.runRenderLoop(() => {
    scene.render();
});
window.addEventListener("resize", () => {
    engine.resize();
});
