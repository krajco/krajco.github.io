import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

var container = document.getElementById("container");
var rect = container.getBoundingClientRect();

var width = rect.width;
var height = rect.height;

console.log("Width: " + width);
console.log("Height: " + height);

var aspect = width/height;
console.log('aspect:' + aspect);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xabcdef)
const camera = new THREE.PerspectiveCamera( 130, aspect, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( width, height );
renderer.useLegacyLights = false;
container.appendChild( renderer.domElement);

camera.position.z = 5;

// const loader = new GLTFLoader();
// var object;
// loader.load( '../public/che.glb'
//   , function ( gltf ) {
//     object = gltf.scene;
//     scene.add(object);
//   }
//   , undefined
//   , function ( error ) {
// 	  console.error( error );
//   } 
// );


let object;
function loadModel() {

  object.position.y = - 0.95;
  object.scale.setScalar( 0.01 );
  scene.add( object );
  animate();
}
const manager = new THREE.LoadingManager( loadModel );

const loader = new OBJLoader( manager );
loader.load( '../public/test.obj', function ( obj ) {
  object = obj;
}, onProgress, onError );

function onProgress( xhr ) {
  if ( xhr.lengthComputable ) {
    const percentComplete = xhr.loaded / xhr.total * 100;
    console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );
  }
}

function onError() {}

// function render() {
//   renderer.render( scene, camera );
// }

let mouseDown = false;
let lastMouseX = 0;
let lastMouseY = 0;
let rotation = false;
let clickMove = false;

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
  let scrollIndex = 0.003;
  camera.position.z = camera.position.z + event.deltaY * scrollIndex;
  updateCamera(event.deltaY * scrollIndex);
  console.log('Scrolujeme');
}

function onWindowResize() {
  var rect = container.getBoundingClientRect();

  camera.aspect = rect.width / rect.height;
  camera.updateProjectionMatrix();
  renderer.setSize(rect.width, rect.height);
}
container.addEventListener('mousedown', onMouseDown);
container.addEventListener('mouseup', onMouseUp);
container.addEventListener('mousemove', onMouseMove);
container.addEventListener('wheel', onScroll);

container.addEventListener( 'resize', onWindowResize );
window.addEventListener( 'resize', onWindowResize );
animate();
