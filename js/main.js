import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

var container = document.getElementById("container");
var rect = container.getBoundingClientRect();

var width = rect.width;
var height = rect.height;

console.log("Width: " + width);
console.log("Height: " + height);

var aspect = width/height;
console.log('aspect:' + aspect);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 130, aspect, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( width, height );
container.appendChild( renderer.domElement);

camera.position.z = 5;

const loader = new GLTFLoader();

var object;
loader.load( '../public/che.glb'
  , function ( gltf ) {
    object = gltf.scene;
    scene.add(object);
  }
  , undefined
  , function ( error ) {
	  console.error( error );
  } 
);

var mouseDown = false;
var lastMouseX = 0;
var lastMouseY = 0;
var rotation = false;
var clickMove = false;

function updateCamera() {
  // Aktualizácia projekcie kamery
  camera.updateProjectionMatrix();
  
  // Nastavenie veľkosti renderovacej oblasti
  renderer.setSize(width, height);
}

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

function onMouseDown(event) {
  // Prave tlacidlo
  if (event.button === 2) {
      rotation = true;
      mouseDown = true;
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
  }

  // Lave tlacidlo
  if (event.button === 0) {
      clickMove = true;
      mouseDown = true;
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
  }
}
  
function onMouseUp(event) {
  // Lave tlacidlo
  if (event.button === 2) {
      mouseDown = false;
      rotation = false;
  }

  // Prave tlacidlo
  if (event.button === 0) {
      mouseDown = false;
      clickMove = false;
  }
}
  
function onMouseMove(event) {
  if (mouseDown && rotation) {
      var deltaX = event.clientX - lastMouseX;
      var deltaY = event.clientY - lastMouseY;
  
      object.rotation.y += deltaX * 0.01;
      object.rotation.x += deltaY * 0.01;
  
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
      console.log('Rotacia pravym klikom!');
  }

  if(mouseDown && clickMove) {
    var deltaX = event.clientX - lastMouseX;
    var deltaY = event.clientY - lastMouseY;
    
    camera.position.x -= deltaX * 0.02;
    camera.position.y += deltaY * 0.02;

    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    console.log('Snazim sa pohnut!');
  }
}

function onScroll(event) {
  camera.position.z = camera.position.z + event.deltaY * 0.02;
  updateCamera(delta);
  console.log('Scrolujeme');
}
container.addEventListener('mousedown', onMouseDown);
container.addEventListener('mouseup', onMouseUp);
container.addEventListener('mousemove', onMouseMove);
container.addEventListener('wheel', onScroll);

animate();
