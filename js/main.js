
import * as THREE from 'three';

import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera, scene, renderer, container;

let object, object2, object3;

init();


function init() {
    const boardPath = '../public/tomastest.obj';
    const truckPath = '../public/truck.obj'
    const texturePath = '../textures/uv_grid_opengl.jpg';

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
            if(child instanceof THREE.Mesh) {
                // child.material = material;
            }
        } );

        object.position.y = 0;
        object.rotation.x = deg2rad(270);
        object.rotation.z = deg2rad(90);
        object.scale.setScalar( 0.005 );
        scene.add( object );

        object2.position.z = 1.112;
        object2.position.y = -0.12;

        object2.rotation.x = deg2rad(179);
        object2.scale.setScalar( 0.008 );
        scene.add( object2 );
        
        object3.position.z = -1.2;
        object3.position.y = -0.112;
        object3.rotation.x = deg2rad(181);
        object3.rotation.y = deg2rad(180);
        object3.scale.setScalar( 0.008 );
        scene.add( object3 );
        render();

        onModelLoaded();
    }

    const manager = new THREE.LoadingManager( loadModel );

    // texture

    // const textureLoader = new THREE.TextureLoader( manager );
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load( texturePath, render );
    console.log(texture);
    const material = new THREE.MeshBasicMaterial({ map: texture });

    // texture.colorSpace = THREE.SRGBColorSpace;

    // model

    function onProgress( xhr ) {
        if ( xhr.lengthComputable ) {
            const percentComplete = xhr.loaded / xhr.total * 100 ;
            console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );
        }
    }

    function onError() {}

    const loader = new OBJLoader( manager );
    loader.load( boardPath , function ( obj ) {
        object = obj;
    }, onProgress, onError );

    loader.load( truckPath , function ( obj ) {
        object2 = obj;
    }, onProgress, onError );
    
    loader.load( truckPath , function ( obj ) {
        object3 = obj;
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

document.getElementById('moveUP').addEventListener('click', moveUP);
document.getElementById('moveDown').addEventListener('click', moveDown);

function moveUP(){
    if(object2.position.y < 1.5) {
        object2.position.y += 0.05;
    }
    console.log(object2.position.y);
    render();
}

function moveDown(){
    if(object2.position.y > -1.5) {
        object2.position.y -= 0.05;
    }
    console.log(object2.position.y);
    render();
}

function render() {
    renderer.render( scene, camera );
}

function deg2rad(deg) {
    return 0.0175 * deg;
}

function onModelLoaded() {
    // Skrytie loading elementu
    const loadingElement = document.getElementById("loading");
    loadingElement.style.display = "none";
}