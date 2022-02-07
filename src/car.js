"use strict";
class car {
    constructor(theTop, theWheelFL, theWheelFR, theWheelBL, theWheelBR, thePivotLeft, thePivotRight, thePivotZ, theTopNew) {
        this._top = theTop;
        this._wheelFrontLeft = theWheelFL;
        this._wheelFrontRight = theWheelFR;
        this._wheelBackLeft = theWheelBL;
        this._wheelBackRight = theWheelBR;
        this._pivotLeft = thePivotLeft;
        this._pivotRight = thePivotRight;
        this._pivotZ = thePivotZ;
        this._topNew = theTopNew;
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
