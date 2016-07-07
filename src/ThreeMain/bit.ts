///<reference path="../../typings/index.d.ts" />
namespace ThreeTest {
  export class Bit {
    
    private geometry: any;
    private texture: THREE.Texture;
    public material: THREE.MeshBasicMaterial;
    public mesh: THREE.Mesh;
    /**
     *
     */
    constructor() {
      
        this.geometry = new THREE.BoxBufferGeometry(10, 10, 10);
        
    }

    public SetTexture(url:string): void{
     this.texture = new THREE.TextureLoader().load( url );
     this.material = new THREE.MeshBasicMaterial({ map: this.texture });
     this.GetMesh();   
    }

    public GetMesh(){
      if(this.mesh===undefined){
        this.mesh = new THREE.Mesh( this.geometry, this.material ); 
      }
      return this.mesh;
    }
    
    public SetPosition(x: number, y: number, z: number) {
        this.mesh.position.set(x, y, z);
    } 

  }
}