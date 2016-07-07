///<reference path="../../typings/index.d.ts" />
var ThreeTest;
(function (ThreeTest) {
    var BaseCamera = (function () {
        /**
         *
         */
        function BaseCamera(w, h, z) {
            this.camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
            this.camera.position.set(0, 10, 0);
        }
        return BaseCamera;
    }());
    ThreeTest.BaseCamera = BaseCamera;
})(ThreeTest || (ThreeTest = {}));
