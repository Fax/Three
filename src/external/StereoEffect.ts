namespace THREE {
	var Math = window.Math;
	/**
 * @author alteredq / http://alteredqualia.com/
 * @authod mrdoob / http://mrdoob.com/
 * @authod arodic / http://aleksandarrodic.com/
 * @authod fonserbc / http://fonserbc.github.io/
 *
 * Off-axis stereoscopic effect based on http://paulbourke.net/stereographics/stereorender/
 */

export class StereoEffect {

	public renderer: THREE.WebGLRenderer;

	private _width;
	private _height;

	private _position = new THREE.Vector3();
	private _quaternion = new THREE.Quaternion();
	private _scale = new THREE.Vector3();

	private _cameraL = new THREE.PerspectiveCamera();
	private _cameraR = new THREE.PerspectiveCamera();

	private _fov;
	private _outer;
	private _inner;
	private _top;
	private _bottom;
	private _ndfl;
	private _halfFocalWidth;
	private _halfFocalHeight;
	private _innerFactor;
	private _outerFactor;
	

	private separation: number;
	private focalLength: number;

	/**
	 *
	 */
	constructor(renderer: any) {
		
		// API

	this.separation = 3;

	/*
	 * Distance to the non-parallax or projection plane
	 */
	this.focalLength = 15;

		// internals

		// initialization
		this.renderer = renderer;
		this.renderer.autoClear = false;
	}
	

	public setSize = function ( width, height ) {

		this._width = width / 2;
		this._height = height;

		this.renderer.setSize( width, height );

	};

	public render = function ( scene, camera ) {

		scene.updateMatrixWorld();

		if ( camera.parent === undefined ) camera.updateMatrixWorld();
	
		camera.matrixWorld.decompose( this._position, this._quaternion, this._scale );

		// Stereo frustum calculation

		// Effective fov of the camera
		this._fov = THREE.Math.radToDeg( 2 * Math.atan( Math.tan( THREE.Math.degToRad( camera.fov ) * 0.5 ) ) );

		this._ndfl = camera.near / this.focalLength;
		this._halfFocalHeight = Math.tan( THREE.Math.degToRad( this._fov ) * 0.5 ) * this.focalLength;
		this._halfFocalWidth = this._halfFocalHeight * 0.5 * camera.aspect;

		this._top =this. _halfFocalHeight * this._ndfl;
		this._bottom = -this._top;
		this._innerFactor = ( this._halfFocalWidth + this.separation / 2.0 ) / ( this._halfFocalWidth * 2.0 );
		this._outerFactor = 1.0 - this._innerFactor;

		this._outer = this._halfFocalWidth * 2.0 * this._ndfl * this._outerFactor;
		this._inner = this._halfFocalWidth * 2.0 * this._ndfl * this._innerFactor;

		// left

		this._cameraL.projectionMatrix.makeFrustum(
			-this._outer,
			this._inner,
			this._bottom,
			this._top,
			camera.near,
			camera.far
		);

		this._cameraL.position.copy( this._position );
		this._cameraL.quaternion.copy( this._quaternion );
		this._cameraL.translateX( - this.separation / 2.0 );

		// right

		this._cameraR.projectionMatrix.makeFrustum(
			-this._inner,
			this._outer,
			this._bottom,
			this._top,
			camera.near,
			camera.far
		);

		this._cameraR.position.copy( this._position );
		this._cameraR.quaternion.copy( this._quaternion );
		this._cameraR.translateX( this.separation / 2.0 );

		//

		this.renderer.setViewport( 0, 0, this._width * 2, this._height );
		this.renderer.clear();

		this.renderer.setViewport( 0, 0, this._width, this._height );
		this.renderer.render( scene, this._cameraL );

		this.renderer.setViewport( this._width, 0, this._width, this._height );
		this.renderer.render( scene, this._cameraR );

	};

};
}