"use strict";
const babylonjs_1 = require("babylonjs");
class car {
    constructor(theTop, theWheelFL, theWheelFR, theWheelBL, theWheelBR, thePivotLeft, thePivotRight, thePivotZ, theTopNew, theTopCar, theWheelFLMesh, theWheelFRMesh, theWheelBLMesh, theWheelBRMesh, thePivotL, thePivotR, thePivot) {
        this._top = theTop;
        this._wheelFrontLeft = theWheelFL;
        this._wheelFrontRight = theWheelFR;
        this._wheelBackLeft = theWheelBL;
        this._wheelBackRight = theWheelBR;
        this._pivotLeft = thePivotLeft;
        this._pivotRight = thePivotRight;
        this._pivotZ = thePivotZ;
        this._topNew = theTopNew;
        this._topCar = theTopCar;
        this._wheelFL = theWheelFLMesh;
        this._wheelFR = theWheelFRMesh;
        this._wheelBL = theWheelBLMesh;
        this._wheelBR = theWheelBRMesh;
        this._pivotL = thePivotL;
        this._pivotR = thePivotR;
        this._pivot = thePivot;
    }
    createTop(theHeight, theWidth, theDepth, name, position, material, scn) {
        this._topCar = babylonjs_1.MeshBuilder.CreateBox(name, { height: theHeight, width: theWidth, depth: theDepth }, scn);
        this._topCar.position = position;
        this._topCar.material = material;
        return this._topCar;
    }
    createTube(tubeRadius, name, path, material, parent, scn) {
        const tube = babylonjs_1.MeshBuilder.CreateTube(name, { path: path, radius: tubeRadius, sideOrientation: babylonjs_1.Mesh.DOUBLESIDE }, scn);
        tube.material = material;
        tube.parent = parent;
        return tube;
    }
    createPivot(name, diameter, scn, positionZ) {
        this._pivot = babylonjs_1.MeshBuilder.CreateSphere(name, { diameter: diameter }, scn);
        this._pivot.position.z = positionZ;
        return this._pivot;
    }
    createFrontPivotL(name, scn, parent, position) {
        this._pivotL = new babylonjs_1.Mesh(name, scn);
        this._pivotL.parent = parent;
        this._pivotL.position = position;
        return this._pivotL;
    }
    createFrontPivotR(name, scn, parent, position) {
        this._pivotR = new babylonjs_1.Mesh(name, scn);
        this._pivotR.parent = parent;
        this._pivotR.position = position;
        return this._pivotR;
    }
    createFirstWheel(wheelDiameter, wheelHeight, wheelTessellation, wheelColor, name, scn, material, parent, position) {
        this._wheelFL = babylonjs_1.MeshBuilder.CreateCylinder(name, { diameter: wheelDiameter, height: wheelHeight, tessellation: wheelTessellation, faceColors: wheelColor }, scn);
        this._wheelFL.material = material;
        this._wheelFL.rotate(babylonjs_1.Axis.X, Math.PI / 2, babylonjs_1.Space.WORLD);
        this._wheelFL.parent = parent;
        this._wheelFL.position = position;
        return this._wheelFL;
    }
    createFRWheel(wheelFrom, name, parent, position) {
        this._wheelFR = wheelFrom.createInstance(name);
        this._wheelFR.parent = parent;
        this._wheelFR.position = position;
        return this._wheelFR;
    }
    createBLWheel(wheelFrom, name, parent, position) {
        this._wheelBL = wheelFrom.createInstance(name);
        this._wheelBL.parent = parent;
        this._wheelBL.position = position;
        return this._wheelBL;
    }
    createBRWheel(wheelFrom, name, parent, position) {
        this._wheelBR = wheelFrom.createInstance(name);
        this._wheelBR.parent = parent;
        this._wheelBR.position = position;
        return this._wheelBR;
    }
    get topCar() {
        return this._topCar;
    }
    get wheelFL() {
        return this._wheelFL;
    }
    get wheelFR() {
        return this._wheelFR;
    }
    get wheelBL() {
        return this._wheelBL;
    }
    get wheelBR() {
        return this._wheelBR;
    }
    get pivotL() {
        return this._pivotL;
    }
    get pivotR() {
        return this._pivotR;
    }
    get pivot() {
        return this._pivot;
    }
    get top() {
        return this._top;
    }
    get wheelFrontLeft() {
        return this._wheelFrontLeft;
    }
    get wheelFrontRight() {
        return this._wheelFrontRight;
    }
    get wheelBackLeft() {
        return this._wheelBackLeft;
    }
    get wheelBackRight() {
        return this._wheelBackRight;
    }
    get pivotLeft() {
        return this._pivotLeft;
    }
    get pivotRight() {
        return this._pivotRight;
    }
    get pivotZ() {
        return this._pivotZ;
    }
    get topNew() {
        return this._topNew;
    }
    set top(val) {
        this._top = val;
    }
    set wheelFrontLeft(val) {
        this._wheelFrontLeft = val;
    }
    set wheelFrontRight(val) {
        this._wheelFrontRight = val;
    }
    set wheelBackLeft(val) {
        this._wheelBackLeft = val;
    }
    set wheelBackRight(val) {
        this._wheelBackRight = val;
    }
    set pivotLeft(val) {
        this._pivotLeft = val;
    }
    set pivotRight(val) {
        this._pivotRight = val;
    }
    set pivotZ(val) {
        this._pivotZ = val;
    }
    set topNew(val) {
        this._topNew = val;
    }
}
module.exports = car;
