
import * as THREE from 'three';

import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera, scene, renderer, container;

let object;

init();


function init() {
    container = document.getElementById("container");
    let rect = container.getBoundingClientRect();

    camera = new THREE.PerspectiveCamera( 45, rect.width/ rect.height, 0.1, 20 );
    camera.position.z = 4;

    // scene

    scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight( 0xffffff );
    scene.add( ambientLight );

    const pointLight = new THREE.PointLight( 0xffffff, 15 );
    camera.add( pointLight );
    scene.add( camera );
    scene.background = new THREE.Color(0xabcdef);
    // manager

    function loadModel() {

        object.traverse( function ( child ) {

            if ( child.isMesh ) child.material.map = texture;

        } );

        // object.position.y = - 0.95;
        object.scale.setScalar( 0.005 );
        scene.add( object );

        render();

    }

    const manager = new THREE.LoadingManager( loadModel );

    // texture

    const textureLoader = new THREE.TextureLoader( manager );
    const texture = textureLoader.load( 'textures/uv_grid_opengl.jpg', render );
    texture.colorSpace = THREE.SRGBColorSpace;

    // model

    function onProgress( xhr ) {

        if ( xhr.lengthComputable ) {

            const percentComplete = xhr.loaded / xhr.total ;
            console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );

        }

    }

    function onError() {}

    const loader = new OBJLoader( manager );
    loader.load( 'public/tomastest.obj', function ( obj ) {

        object = obj;

    }, onProgress, onError );

    //

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( rect.width, rect.height );
    renderer.useLegacyLights = false;

    container.appendChild( renderer.domElement );

    //

    const controls = new  OrbitControls( camera, renderer.domElement );
    // controls.minDistance = 2;
    // controls.maxDistance = 5;
    controls.addEventListener( 'change', render );

    //

    container.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {
    let rect = document.getElementById("container").getBoundingClientRect();

    camera.aspect =  rect.width/rect.height;
    camera.updateProjectionMatrix();
    renderer.setSize( rect.width, rect.height );

    const windowCenterX = rect.width / 2;
    const windowCenterY = rect.height / 2;
  
    // Získajte stredové súradnice objektu vzhľadom na scénu
    const objectCenter = new THREE.Vector3();
    const objectBoundingBox = new THREE.Box3().setFromObject(object);
    objectBoundingBox.getCenter(objectCenter);
    objectCenter.applyMatrix4(object.matrixWorld);
  
    // Vypočítajte posunutie objektu, aby bol vycentrovaný na stred okna
    const xOffset = windowCenterX - objectCenter.x;
    const yOffset = windowCenterY - objectCenter.y;
  
    // Posuňte objekt na nové pozície
    object.position.x += xOffset;
    object.position.y += yOffset;

}

function render() {
    renderer.render( scene, camera );
}