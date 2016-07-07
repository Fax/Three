///<reference path="../../typings/index.d.ts" />
var ThreeTest;
(function (ThreeTest) {
    var Math = window.Math;
    var ThreeJSTest = (function () {
        function ThreeJSTest(w, h) {
            var _this = this;
            this.Loop = function () {
                requestAnimationFrame(_this.Loop);
                _this.mesh.rotation.x += 0.005;
                _this.mesh.rotation.y += 0.01;
                _this.camera.camera.updateProjectionMatrix();
                _this.effect.render(_this.scene, _this.camera.camera);
            };
            this.renderer = new THREE.WebGLRenderer({ alpha: true });
            this.renderer.setSize(w, h);
            this.renderer.setClearColor(0xAAAAFF, 1);
            this.clock = new THREE.Clock();
            this.camera = new ThreeTest.BaseCamera(w, h, 400);
            this.scene = new THREE.Scene();
            this.scene.add(this.camera.camera);
            var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
            this.scene.add(light);
            var geo = new ThreeTest.Bit();
            geo.SetTexture('/img/box.jpg');
            this.mesh = geo.GetMesh();
            this.mesh.position.set(0, 20, -20);
            this.scene.add(this.mesh);
            var texture = THREE.ImageUtils.loadTexture('img/checker.png');
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat = new THREE.Vector2(50, 50);
            texture.anisotropy = this.renderer.getMaxAnisotropy();
            var geometry = new THREE.PlaneGeometry(1000, 1000);
            var material = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                specular: 0xffffff,
                shininess: 20,
                shading: THREE.FlatShading,
                map: texture
            });
            var mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x = -Math.PI / 2;
            this.scene.add(mesh);
            this.effect = new THREE.StereoEffect(this.renderer);
            this.effect.setSize(w, h);
            document.body.appendChild(this.renderer.domElement);
        }
        ThreeJSTest.prototype.start = function () {
            this.renderer.clear();
            this.Loop();
        };
        return ThreeJSTest;
    }());
    ThreeTest.ThreeJSTest = ThreeJSTest;
})(ThreeTest || (ThreeTest = {}));
