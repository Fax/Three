///<reference path="../../typings/index.d.ts" />
namespace ThreeTest {
  export class BaseCamera {
    public camera: THREE.PerspectiveCamera;
    /**
     *
     */
    constructor(w: number,h: number, z: number) {
      this.camera = new THREE.PerspectiveCamera( 
        90, 
        1, 
        0.001, 
        700);

        this.camera.position.set (0,10,0);
    }

  }
}