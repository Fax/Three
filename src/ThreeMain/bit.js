///<reference path="../../typings/index.d.ts" />
var ThreeTest;
(function (ThreeTest) {
    var Bit = (function () {
        /**
         *
         */
        function Bit() {
            this.geometry = new THREE.BoxBufferGeometry(10, 10, 10);
        }
        Bit.prototype.SetTexture = function (url) {
            this.texture = new THREE.TextureLoader().load(url);
            this.material = new THREE.MeshBasicMaterial({ map: this.texture });
            this.GetMesh();
        };
        Bit.prototype.GetMesh = function () {
            if (this.mesh === undefined) {
                this.mesh = new THREE.Mesh(this.geometry, this.material);
            }
            return this.mesh;
        };
        Bit.prototype.SetPosition = function (x, y, z) {
            this.mesh.position.set(x, y, z);
        };
        return Bit;
    }());
    ThreeTest.Bit = Bit;
})(ThreeTest || (ThreeTest = {}));
