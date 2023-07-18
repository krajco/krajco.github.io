import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

const loader = new GLTFLoader();

var object;
loader.load( '../public/che.glb', function ( gltf ) {
    object = gltf.scene;
    scene.add(object);
}, undefined, function ( error ) {
	console.error( error );
} );


var scrollSpeed = 0.01; // Adjust this value to control the zoom speed

window.addEventListener('wheel', onScroll);

function onScroll(event) {
  var delta = event.deltaY;
  updateCamera(delta);
}

function updateCamera(delta) {
    // Adjust camera position or FOV based on the scroll wheel delta
    // You can modify the camera's position or FOV to achieve the desired zoom effect
  
    // Example 1: Adjust camera position along the z-axis
    camera.position.z += delta * scrollSpeed;
  
    // Example 2: Modify camera FOV
    camera.fov += delta * scrollSpeed;
    camera.fov = Math.max(minFOV, Math.min(maxFOV, camera.fov)); // Clamp the FOV within a certain range
    camera.updateProjectionMatrix(); // Update the camera's projection matrix after modifying the FOV
}

function onMouseDown(event) {
    if (event.button === 2) {
        mouseDown = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }
  }
  
  function onMouseUp(event) {
    if (event.button === 2) {
        mouseDown = false;
    }
  }
  
  function onMouseMove(event) {
    if (mouseDown) {
        var deltaX = event.clientX - lastMouseX;
        var deltaY = event.clientY - lastMouseY;
    
        object.rotation.y += deltaX * 0.01;
        object.rotation.x += deltaY * 0.01;
    
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }
  }

var mouseDown = false;
var lastMouseX = 0;
var lastMouseY = 0;

document.addEventListener('mousedown', onMouseDown);
document.addEventListener('mouseup', onMouseUp);
document.addEventListener('mousemove', onMouseMove);
window.addEventListener('scroll', onScroll);

animate();
