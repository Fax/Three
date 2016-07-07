var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var Math = window.Math;
    /**
   * @author qiao / https://github.com/qiao
   * @author mrdoob / http://mrdoob.com
   * @author alteredq / http://alteredqualia.com/
   * @author WestLangley / http://github.com/WestLangley
   * @author erich666 / http://erichaines.com
   */
    /*global THREE, console */
    // This set of controls performs orbiting, dollying (zooming), and panning. It maintains
    // the "up" direction as +Y, unlike the TrackballControls. Touch on tablet and phones is
    // supported.
    //
    //    Orbit - left mouse / touch: one finger move
    //    Zoom - middle mouse, or mousewheel / touch: two finger spread or squish
    //    Pan - right mouse, or arrow keys / touch: three finter swipe
    //
    // This is a drop-in replacement for (most) TrackballControls used in examples.
    // That is, include this js file and wherever you see:
    //      controls = new THREE.TrackballControls( camera );
    //      controls.target.z = 150;
    // Simple substitute "OrbitControls" and the control should work as-is.
    var OrbitControls = (function (_super) {
        __extends(OrbitControls, _super);
        /**
         *
         */
        function OrbitControls(object, domElement) {
            _super.call(this);
            this.enabled = true;
            this.target = new THREE.Vector3();
            this.center = this.target;
            this.pan = new THREE.Vector3();
            this.noZoom = false;
            this.zoomSpeed = 1.0;
            // Limits to how far you can dolly in and out
            this.minDistance = 0;
            this.maxDistance = Infinity;
            // Set to true to disable this control
            this.noRotate = false;
            this.rotateSpeed = 1.0;
            // Set to true to disable this control
            this.noPan = false;
            this.keyPanSpeed = 7.0; // pixels moved per arrow key push
            // Set to true to automatically rotate around the target
            this.autoRotate = false;
            this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60
            // How far you can orbit vertically, upper and lower limits.
            // Range is 0 to Math.PI radians.
            this.minPolarAngle = 0; // radians
            this.maxPolarAngle = 3.14; // radians
            // Set to true to disable use of the keys
            this.noKeys = false;
            // The four arrow keys
            this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };
            this.scope = this;
            this.EPS = 0.000001;
            this.rotateStart = new THREE.Vector2();
            this.rotateEnd = new THREE.Vector2();
            this.rotateDelta = new THREE.Vector2();
            this.panStart = new THREE.Vector2();
            this.panEnd = new THREE.Vector2();
            this.panDelta = new THREE.Vector2();
            this.panOffset = new THREE.Vector3();
            this.offset = new THREE.Vector3();
            this.dollyStart = new THREE.Vector2();
            this.dollyEnd = new THREE.Vector2();
            this.dollyDelta = new THREE.Vector2();
            this.phiDelta = 0;
            this.thetaDelta = 0;
            this.scale = 1;
            this.lastPosition = new THREE.Vector3();
            this.STATE = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY: 4, TOUCH_PAN: 5 };
            this.state = this.STATE.NONE;
            // events
            this.changeEvent = { type: 'change' };
            this.startEvent = { type: 'start' };
            this.endEvent = { type: 'end' };
            this.object = object;
            this.domElement = (domElement !== undefined) ? domElement : document;
            this.target0 = this.target.clone();
            this.position0 = this.object.position.clone();
            this.quat = new THREE.Quaternion().setFromUnitVectors(this.object.up, new THREE.Vector3(0, 1, 0));
            this.quatInverse = this.quat.clone().inverse();
            // so camera.up is the orbit axis
            this.domElement.addEventListener('contextmenu', function (event) { event.preventDefault(); }, false);
            this.domElement.addEventListener('mousedown', this.onMouseDown, false);
            this.domElement.addEventListener('mousewheel', this.onMouseWheel, false);
            this.domElement.addEventListener('DOMMouseScroll', this.onMouseWheel, false); // firefox
            this.domElement.addEventListener('touchstart', this.touchstart, false);
            this.domElement.addEventListener('touchend', this.touchend, false);
            this.domElement.addEventListener('touchmove', this.touchmove, false);
            window.addEventListener('keydown', this.onKeyDown, false);
            // force an update at start
            this.update();
        }
        OrbitControls.prototype.rotateLeft = function (angle) {
            if (angle === undefined) {
                angle = this.getAutoRotationAngle();
            }
            this.thetaDelta -= angle;
        };
        ;
        OrbitControls.prototype.rotateUp = function (angle) {
            if (angle === undefined) {
                angle = this.getAutoRotationAngle();
            }
            this.phiDelta -= angle;
        };
        ;
        // pass in distance in world space to move left
        OrbitControls.prototype.panLeft = function (distance) {
            var te = this.object.matrix.elements;
            // get X column of matrix
            this.panOffset.set(te[0], te[1], te[2]);
            this.panOffset.multiplyScalar(-distance);
            this.pan.add(this.panOffset);
        };
        ;
        // pass in distance in world space to move up
        OrbitControls.prototype.panUp = function (distance) {
            var te = this.object.matrix.elements;
            // get Y column of matrix
            this.panOffset.set(te[4], te[5], te[6]);
            this.panOffset.multiplyScalar(distance);
            this.pan.add(this.panOffset);
        };
        ;
        // pass in x,y of change desired in pixel space,
        // right and down are positive
        OrbitControls.prototype.panAmount = function (deltaX, deltaY) {
            var element = this.domElement === document ? this.domElement.body : this.domElement;
            if (this.object.fov !== undefined) {
                // perspective
                var position = this.object.position;
                var offset = position.clone().sub(this.target);
                var targetDistance = offset.length();
                // half of the fov is center to top of screen
                targetDistance *= Math.tan((this.object.fov / 2) * Math.PI / 180.0);
                // we actually don't use screenWidth, since perspective camera is fixed to screen height
                this.panLeft(2 * deltaX * targetDistance / element.clientHeight);
                this.panUp(2 * deltaY * targetDistance / element.clientHeight);
            }
            else if (this.object.top !== undefined) {
                // orthographic
                this.panLeft(deltaX * (this.object.right - this.object.left) / element.clientWidth);
                this.panUp(deltaY * (this.object.top - this.object.bottom) / element.clientHeight);
            }
            else {
                // camera neither orthographic or perspective
                console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');
            }
        };
        ;
        OrbitControls.prototype.dollyIn = function (dollyScale) {
            if (dollyScale === void 0) { dollyScale = undefined; }
            if (dollyScale === undefined) {
                dollyScale = this.getZoomScale();
            }
            this.scale /= dollyScale;
        };
        ;
        OrbitControls.prototype.dollyOut = function (dollyScale) {
            if (dollyScale === void 0) { dollyScale = undefined; }
            if (dollyScale === undefined) {
                dollyScale = this.getZoomScale();
            }
            this.scale *= dollyScale;
        };
        ;
        OrbitControls.prototype.update = function () {
            var position = this.object.position;
            var offset = this.offset;
            offset.copy(position).sub(this.target);
            // rotate offset to "y-axis-is-up" space
            offset.applyQuaternion(this.quat);
            // angle from z-axis around y-axis
            var theta = Math.atan2(offset.x, offset.z);
            // angle from y-axis
            var phi = Math.atan2(Math.sqrt(offset.x * offset.x + offset.z * offset.z), offset.y);
            if (this.autoRotate) {
                this.rotateLeft(this.getAutoRotationAngle());
            }
            theta += this.thetaDelta;
            phi += this.phiDelta;
            // restrict phi to be between desired limits
            phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, phi));
            // restrict phi to be betwee EPS and PI-EPS
            phi = Math.max(this.EPS, Math.min(Math.PI - this.EPS, phi));
            var radius = offset.length() * this.scale;
            // restrict radius to be between desired limits
            radius = Math.max(this.minDistance, Math.min(this.maxDistance, radius));
            // move target to panned location
            this.target.add(this.pan);
            offset.x = radius * Math.sin(phi) * Math.sin(theta);
            offset.y = radius * Math.cos(phi);
            offset.z = radius * Math.sin(phi) * Math.cos(theta);
            // rotate offset back to "camera-up-vector-is-up" space
            offset.applyQuaternion(this.quatInverse);
            position.copy(this.target).add(offset);
            this.object.lookAt(this.target);
            this.thetaDelta = 0;
            this.phiDelta = 0;
            this.scale = 1;
            this.panAmount(0, 0); //???
            if (this.lastPosition.distanceToSquared(this.object.position) > this.EPS) {
                this.dispatchEvent(this.changeEvent);
                this.lastPosition.copy(this.object.position);
            }
        };
        ;
        OrbitControls.prototype.reset = function () {
            this.state = this.STATE.NONE;
            this.target.copy(this.target0);
            this.object.position.copy(this.position0);
            this.update();
        };
        ;
        OrbitControls.prototype.getAutoRotationAngle = function () {
            return 2 * Math.PI / 60 / 60 * this.autoRotateSpeed;
        };
        OrbitControls.prototype.getZoomScale = function () {
            return Math.pow(0.95, this.zoomSpeed);
        };
        OrbitControls.prototype.onMouseDown = function (event) {
            if (this.enabled === false)
                return;
            event.preventDefault();
            if (event.button === 0) {
                if (this.noRotate === true)
                    return;
                this.state = this.STATE.ROTATE;
                this.rotateStart.set(event.clientX, event.clientY);
            }
            else if (event.button === 1) {
                if (this.noZoom === true)
                    return;
                this.state = this.STATE.DOLLY;
                this.dollyStart.set(event.clientX, event.clientY);
            }
            else if (event.button === 2) {
                if (this.noPan === true)
                    return;
                this.state = this.STATE.PAN;
                this.panStart.set(event.clientX, event.clientY);
            }
            this.domElement.addEventListener('mousemove', this.onMouseMove, false);
            this.domElement.addEventListener('mouseup', this.onMouseUp, false);
            this.dispatchEvent(this.startEvent);
        };
        OrbitControls.prototype.onMouseMove = function (event) {
            if (this.enabled === false)
                return;
            event.preventDefault();
            var element = this.domElement === document ? this.domElement.body : this.domElement;
            if (this.state === this.STATE.ROTATE) {
                if (this.noRotate === true)
                    return;
                this.rotateEnd.set(event.clientX, event.clientY);
                this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart);
                // rotating across whole screen goes 360 degrees around
                this.rotateLeft(2 * Math.PI * this.rotateDelta.x / element.clientWidth * this.rotateSpeed);
                // rotating up and down along whole screen attempts to go 360, but limited to 180
                this.rotateUp(2 * Math.PI * this.rotateDelta.y / element.clientHeight * this.rotateSpeed);
                this.rotateStart.copy(this.rotateEnd);
            }
            else if (this.state === this.STATE.DOLLY) {
                if (this.noZoom === true)
                    return;
                this.dollyEnd.set(event.clientX, event.clientY);
                this.dollyDelta.subVectors(this.dollyEnd, this.dollyStart);
                if (this.dollyDelta.y > 0) {
                    this.dollyIn();
                }
                else {
                    this.dollyOut();
                }
                this.dollyStart.copy(this.dollyEnd);
            }
            else if (this.state === this.STATE.PAN) {
                if (this.noPan === true)
                    return;
                this.panEnd.set(event.clientX, event.clientY);
                this.panDelta.subVectors(this.panEnd, this.panStart);
                this.panAmount(this.panDelta.x, this.panDelta.y);
                this.panStart.copy(this.panEnd);
            }
            this.update();
        };
        OrbitControls.prototype.onMouseUp = function () {
            if (this.enabled === false)
                return;
            this.domElement.removeEventListener('mousemove', this.onMouseMove, false);
            this.domElement.removeEventListener('mouseup', this.onMouseUp, false);
            this.dispatchEvent(this.endEvent);
            this.state = this.STATE.NONE;
        };
        OrbitControls.prototype.onMouseWheel = function (event) {
            if (this.enabled === false || this.noZoom === true)
                return;
            event.preventDefault();
            event.stopPropagation();
            var delta = 0;
            if (event.wheelDelta !== undefined) {
                delta = event.wheelDelta;
            }
            else if (event.detail !== undefined) {
                delta = -event.detail;
            }
            if (delta > 0) {
                this.dollyOut();
            }
            else {
                this.dollyIn();
            }
            this.update();
            this.dispatchEvent(this.startEvent);
            this.dispatchEvent(this.endEvent);
        };
        OrbitControls.prototype.onKeyDown = function (event) {
            if (this.enabled === false || this.noKeys === true || this.noPan === true)
                return;
            switch (event.keyCode) {
                case this.keys.UP:
                    this.panAmount(0, this.keyPanSpeed);
                    this.update();
                    break;
                case this.keys.BOTTOM:
                    this.panAmount(0, -this.keyPanSpeed);
                    this.update();
                    break;
                case this.keys.LEFT:
                    this.panAmount(this.keyPanSpeed, 0);
                    this.update();
                    break;
                case this.keys.RIGHT:
                    this.panAmount(-this.keyPanSpeed, 0);
                    this.update();
                    break;
            }
        };
        OrbitControls.prototype.touchstart = function (event) {
            if (this.enabled === false)
                return;
            switch (event.touches.length) {
                case 1:
                    if (this.noRotate === true)
                        return;
                    this.state = this.STATE.TOUCH_ROTATE;
                    this.rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);
                    break;
                case 2:
                    if (this.noZoom === true)
                        return;
                    this.state = this.STATE.TOUCH_DOLLY;
                    var dx = event.touches[0].pageX - event.touches[1].pageX;
                    var dy = event.touches[0].pageY - event.touches[1].pageY;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    this.dollyStart.set(0, distance);
                    break;
                case 3:
                    if (this.noPan === true)
                        return;
                    this.state = this.STATE.TOUCH_PAN;
                    this.panStart.set(event.touches[0].pageX, event.touches[0].pageY);
                    break;
                default:
                    this.state = this.STATE.NONE;
            }
            this.dispatchEvent(this.startEvent);
        };
        OrbitControls.prototype.touchmove = function (event) {
            if (this.enabled === false)
                return;
            event.preventDefault();
            event.stopPropagation();
            var element = this.domElement === document ? this.domElement.body : this.domElement;
            switch (event.touches.length) {
                case 1:
                    if (this.noRotate === true)
                        return;
                    if (this.state !== this.STATE.TOUCH_ROTATE)
                        return;
                    this.rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);
                    this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart);
                    // rotating across whole screen goes 360 degrees around
                    this.rotateLeft(2 * Math.PI * this.rotateDelta.x / element.clientWidth * this.rotateSpeed);
                    // rotating up and down along whole screen attempts to go 360, but limited to 180
                    this.rotateUp(2 * Math.PI * this.rotateDelta.y / element.clientHeight * this.rotateSpeed);
                    this.rotateStart.copy(this.rotateEnd);
                    this.update();
                    break;
                case 2:
                    if (this.noZoom === true)
                        return;
                    if (this.state !== this.STATE.TOUCH_DOLLY)
                        return;
                    var dx = event.touches[0].pageX - event.touches[1].pageX;
                    var dy = event.touches[0].pageY - event.touches[1].pageY;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    this.dollyEnd.set(0, distance);
                    this.dollyDelta.subVectors(this.dollyEnd, this.dollyStart);
                    if (this.dollyDelta.y > 0) {
                        this.dollyOut();
                    }
                    else {
                        this.dollyIn();
                    }
                    this.dollyStart.copy(this.dollyEnd);
                    this.update();
                    break;
                case 3:
                    if (this.noPan === true)
                        return;
                    if (this.state !== this.STATE.TOUCH_PAN)
                        return;
                    this.panEnd.set(event.touches[0].pageX, event.touches[0].pageY);
                    this.panDelta.subVectors(this.panEnd, this.panStart);
                    this.panAmount(this.panDelta.x, this.panDelta.y);
                    this.panStart.copy(this.panEnd);
                    this.update();
                    break;
                default:
                    this.state = this.STATE.NONE;
            }
        };
        OrbitControls.prototype.touchend = function () {
            if (this.enabled === false)
                return;
            this.dispatchEvent(this.endEvent);
            this.state = this.STATE.NONE;
        };
        return OrbitControls;
    }(THREE.EventDispatcher));
    THREE.OrbitControls = OrbitControls;
    ;
})(THREE || (THREE = {}));
