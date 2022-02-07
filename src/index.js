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
const carcoords_1 = __importDefault(require("./carcoords"));
const topofcar_1 = __importDefault(require("./topofcar"));
const tubesofCar_1 = __importDefault(require("./tubesofCar"));
const wheelsofcar_1 = __importDefault(require("./wheelsofcar"));
let usersCars = {};
const canvas = document.getElementById('canvas');
const engine = new babylonjs_1.Engine(canvas, true);
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
let car1 = new carcoords_1.default(new babylonjs_1.Vector3(0, 2, 0), new babylonjs_1.Vector3(0, 0, -1.8), new babylonjs_1.Vector3(0, 0, 1.8), new babylonjs_1.Vector3(2.5, -1, -3.8), new babylonjs_1.Vector3(2.5, -1, 3.8), new babylonjs_1.Vector3(-4.5, -1, -2), new babylonjs_1.Vector3(-4.5, -1, 2), 50, new babylonjs_1.Vector3(0, 0, -50));
const assembleCar = (car, scene) => {
    //Корпус машины
    let materialTop = createMaterialColor("materialtop", scene, new babylonjs_1.Color3(0, 0, 0.25));
    const topCr = new topofcar_1.default(3.0, 10.0, 4.0);
    carTop = topCr.renderTop("carTop", car.top, materialTop, scene);
    camera.parent = carTop;
    //Колеса
    let materialWheel = createMaterialTexture("texturew", scene, "/img/wheel.jpg");
    const colorWheel = [];
    colorWheel[1] = new babylonjs_1.Color4(0, 0, 0);
    const wheels = new wheelsofcar_1.default(3, 1, 24, colorWheel);
    pivotFrontLeft = wheels.renderFrontPivot("pivotFrontLeft", scene, carTop, car.pivotLeft);
    wheelFrontLeft = wheels.renderFirstWheel("wheelFrontLeft", scene, materialWheel, pivotFrontLeft, car.wheelFrontLeft);
    pivotFrontRight = wheels.renderFrontPivot("pivotFrontRight", scene, carTop, car.pivotRight);
    wheelFrontRight = wheels.renderOtherWheel(wheelFrontLeft, "wheelFrontRight", pivotFrontRight, car.wheelFrontRight);
    wheelBackLeft = wheels.renderOtherWheel(wheelFrontLeft, "wheelBackLeft", carTop, car.wheelBackLeft);
    wheelBackRight = wheels.renderOtherWheel(wheelFrontLeft, "wheelBackRight", carTop, car.wheelBackRight);
    pivot = wheels.renderPivot("pivot", 0.1, scene, car.pivotZ);
    carTop.parent = pivot;
    carTop.position = car.topNew;
    //перегородки
    let materialTube = createMaterialColor("materialt", scene, new babylonjs_1.Color3(0, 0, 0));
    const tubes = new tubesofCar_1.default(0.15);
    const tubeFront = tubes.renderTube("tubeFront", axesFront, materialTube, carTop, scene);
    const tubeBack = tubes.renderTube("tubeBack", axesBack, materialTube, carTop, scene);
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
    assembleCar(car1, scene);
    ///////////////
    //кнопки
    var buttons = {};
    scene.actionManager = new babylonjs_1.ActionManager(scene);
    scene.actionManager.registerAction(new babylonjs_1.ExecuteCodeAction(babylonjs_1.ActionManager.OnKeyDownTrigger, function (evt) {
        buttons[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
    scene.actionManager.registerAction(new babylonjs_1.ExecuteCodeAction(babylonjs_1.ActionManager.OnKeyUpTrigger, function (evt) {
        buttons[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
    scene.onBeforeRenderObservable.add(() => {
    });
    //движение
    scene.registerAfterRender(function () {
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
            pressedKey(-Math.PI / 252, pivotFrontLeft, pivotFrontRight, pivot, carTop);
        }
        ;
        if ((buttons["d"] || buttons["D"]) && theta < Math.PI / 6) {
            pressedKey(Math.PI / 252, pivotFrontLeft, pivotFrontRight, pivot, carTop);
        }
        ;
        if ((buttons["s"] || buttons["S"])) {
            D -= 0.5;
        }
        if (D > 0) {
            phi = D / (R * F);
            if (Math.abs(theta) > 0) {
                pivot.rotate(babylonjs_1.Axis.Y, phi, babylonjs_1.Space.WORLD);
                psiBackLeft = D / (r * F);
                psiBackRight = D * (R + A) / (r * F);
                psiFrontLeft = D * Math.sqrt(R * R + L * L) / (r * F);
                psiFrontRight = D * Math.sqrt((R + A) * (R + A) + L * L) / (r * F);
                rotateAllWheels(wheelFrontLeft, wheelFrontRight, wheelBackLeft, wheelBackRight, psiFrontLeft, psiFrontRight, psiBackLeft, psiBackRight);
            }
            else {
                pivot.translate(babylonjs_1.Axis.X, -distance, babylonjs_1.Space.LOCAL);
                rotateAllWheels(wheelFrontLeft, wheelFrontRight, wheelBackLeft, wheelBackRight, psi, psi, psi, psi);
            }
        }
    });
    return scene;
};
window.onload = function () {
    const socket = io.connect('http://localhost:5500');
    socket.on('serverToClient', (data) => {
        alert(data);
    });
    socket.emit('clientToServer', "Hi, server!");
    /*
    let newCar = car1;
    socket.emit('newUser', { newCar });
  
    socket.on('updateUsers', (users: any) => {
      let usersFound: any = {};
  
      //добавляем нового
      for(let id in users){
        if(usersCars[id] === undefined && id !== socket.id){
          usersCars[id] = newCar;
          assembleCar(usersCars[id], scene);
        }
        usersFound[id] = true;
      }
  
      //отсоединяем пользователя
      for(let id in usersCars){
        if(!usersFound[id]){
          usersCars[id].remove();
          delete usersCars[id];
        }
      }
    })
    */
};
const scene = createScene();
engine.runRenderLoop(() => {
    scene.render();
});
window.addEventListener("resize", () => {
    engine.resize();
});
/*
enum BodyTypes {
  Micro = 'Micro',
  Sedan = 'Sedan',
  SUV = 'SUV',
  Cabriolet = 'Cabriolet',
  Pickup = 'Pickup'
}

class Car {
  protected model: string;
  protected bodywork = BodyTypes.Sedan;
  private wheels: string;
  private speedTop: number;
  private litersType: string;
  private fuelTankCapacity: number;
  private accelerationMax: number;
  length: number;
  height: number;
  fuelCurrent: number;
  speedCurrent: number;
  accelerationCurrent: number;
  color: string;

  constructor(theModel: string, theBodywork: BodyTypes, theWheels: string, theSpeedTop: number, theLitersType: string, theAcceleration: number, theTankCapacity: number, theFuel: number, theSpeed: number, theAcc: number, theLength: number, theHeight: number, theColor: string) {
    this.model = theModel;
    this.bodywork = theBodywork;
    this.wheels = theWheels;
    this.speedTop = theSpeedTop;
    this.litersType = theLitersType;
    this.accelerationMax = theAcceleration;
    this.fuelTankCapacity = theTankCapacity;
    this.fuelCurrent = theFuel;
    this.speedCurrent = theSpeed;
    this.accelerationCurrent = theAcc;
    this.length = theLength;
    this.height = theHeight;
    this.color = theColor;
  }

  getInfo() {
    return this.model + " " + this.bodywork + " " + this.wheels + " " + this.litersType;
  }

  getTopSpeed() {
    return this.speedTop;
  }

  getFuelCapacity() {
    return this.fuelTankCapacity;
  }

  getAccelerationMax() {
    return this.accelerationMax;
  }

  getLength() {
    return this.length;
  }

  getHeight() {
    return this.height;
  }

  getSpeed() {
    return this.speedCurrent;
  }

  getFuel() {
    return this.fuelCurrent;
  }

  getAcceleration() {
    return this.accelerationCurrent;
  }

  setFuel(fuel: number) {
    this.fuelCurrent = fuel;
  }

  setSpeed(spd: number) {
    this.speedCurrent = spd;
  }

  setAcceleration(acclrt: number) {
    this.accelerationCurrent = acclrt;
  }
}

let bmw = new Car ("330i", BodyTypes.Sedan, "18 x 7.5", 130, "2.0-liter BMW TwinPower Turbo inline 4-cylinder", 5.6, 15.6, 10, 75, 2, 185.7, 56.8, "black");

let mercedez = new Car ("GLB 250", BodyTypes.SUV, "18 x 7.5", 221, "2.0L inline-4 turbo", 6.9, 15.9, 15, 175, 6, 183, 66, "blue");

let ferrari = new Car ("612 Scaglietti", BodyTypes.Cabriolet, "245/40 ZR 19", 320, "2.0L inline-4 turbo", 4, 108, 105, 200, 2, 200, 90, "red");

const cars = [bmw, mercedez, ferrari];

const canvas = <HTMLCanvasElement>document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function renderCar(carname: Car) {
  const speed = document.getElementById('speed__number');
  const acceleration = document.getElementById('acceleration__number');
  const fuel = document.getElementById('fuel__number');
  const info = document.body.querySelector('.info');

  if (info) {
    info.textContent = carname.getInfo();
  }

  if (speed) {
    speed.textContent = carname.getSpeed().toString();
  }

  if (acceleration) {
    acceleration.textContent = carname.getAcceleration().toString();
  }

  if (fuel) {
    fuel.textContent = carname.getFuel().toString();
  }

  if(canvas) {
    if (ctx) {
      //ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = carname.color;
      ctx.fillStyle = carname.color;
      ctx.moveTo(0, 0);
      ctx.lineTo(0, carname.getHeight());
      ctx.lineTo(carname.getLength(), carname.getHeight());
      ctx.lineTo(carname.getLength(), 0);
      ctx.lineTo(0, 0);
      ctx.stroke();
      ctx.fill();
    }
  }

  const fasterSpeed = document.getElementById('fasterSpeed');
  const slowerSpeed = document.getElementById('slowerSpeed');
  const fasterAcceleration = document.getElementById('fasterAcceleration');
  const slowerAcceleration = document.getElementById('slowerAcceleration');
  const fasterFuel = document.getElementById('fasterFuel');
  const slowerFuel = document.getElementById('slowerFuel');

  if (fasterSpeed) {
    fasterSpeed.addEventListener("click", () => {
      if (carname.getSpeed() < carname.getTopSpeed()) {
        carname.setSpeed(carname.getSpeed() + 1);
        if (speed) {
          speed.textContent = carname.getSpeed().toString();
        }
      }
    })
  }

  if (slowerSpeed) {
    slowerSpeed.addEventListener("click", () => {
      if (carname.getSpeed() > 0) {
        carname.setSpeed(carname.getSpeed() - 1);
        if (speed) {
          speed.textContent = carname.getSpeed().toString();
        }
      }
    })
  }

  if (fasterAcceleration) {
    fasterAcceleration.addEventListener("click", () => {
      if (carname.getAcceleration() < carname.getAccelerationMax()) {
        carname.setAcceleration(Number((carname.getAcceleration() + 0.1).toFixed(1)));
        if (acceleration) {
          acceleration.textContent = carname.getAcceleration().toFixed(1);
        }
      }
    })
  }

  if (slowerAcceleration) {
    slowerAcceleration.addEventListener("click", () => {
      if (carname.getAcceleration() > 0) {
        carname.setAcceleration(Number((carname.getAcceleration() - 0.1).toFixed(1)));
        if (acceleration) {
          acceleration.textContent = carname.getAcceleration().toFixed(1);
        }
      }
    })
  }

  if (fasterFuel) {
    fasterFuel.addEventListener("click", () => {
      if (carname.getFuel() < carname.getFuelCapacity()) {
        carname.setFuel(Number((carname.getFuel() + 0.1).toFixed(1)));
        if (fuel) {
          fuel.textContent = carname.getFuel().toFixed(1);
        }
      }
    })
  }

  if (slowerFuel) {
    slowerFuel.addEventListener("click", () => {
      if (carname.getFuel() > 0) {
        carname.setFuel(Number((carname.getFuel() - 0.1).toFixed(1)));
        if (fuel) {
          fuel.textContent = carname.getFuel().toFixed(1);
        }
      }
    })
  }
}

window.onload = function() {
  let i = 0;

  renderCar(cars[i]);

  const next = document.body.querySelector('.next');
  const prev = document.body.querySelector('.prev');

  if (next) {
    next.addEventListener("click", () => {
      if (i >= 0 && i < cars.length - 1) {
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        i++;
        renderCar(cars[i]);
      }
    })
  }

  if (prev) {
    prev.addEventListener("click", () => {
      if (i > 0 && i <= cars.length) {
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        i--;
        renderCar(cars[i]);
      }
    })
  }
}
 */ 
