/*
* Arizza Santos
* Mon Dec 10, 2018
*
* Sources:
* (1) https://codepen.io/rachsmith/post/beginning-with-3d-webgl-pt-1-the-scene
* (2) https://www.august.com.au/blog/animating-scenes-with-webgl-three-js/
*/

// create a scene to place objects, cameras, lighting (1)
var scene = new THREE.Scene();

/* add a camera (1)
 * THREE.PerspectiveCamera(fov, aspect, near, far)
 * fov - verticle field of view
 * aspect - aspect ratio to create horizontal field based off vertical
 * near - where the camera's view begins
 * far - where the camera's view ends
 */
var aspect = window.innerWidth/window.innerHeight;
var camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);

// Reposition the camera (2)
// camera.position.set(5.0, 5.0, 5.0);  // x, y, z
// camera.position.set(0.0, 30.0, 50.0);
camera.position.set(15.0, 15.0, 15.0);

// Point the camera at a given coordinate
camera.lookAt(new THREE.Vector3(0, 0, 0));

// add a renderer - view that contains camera's "picture" (1)
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xfff6e6);

// enable shadow mapping (2)
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// add the renderer element to the DOM so it is in the page
document.body.appendChild(renderer.domElement);

// show axes
var axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

// ground plane grid
var gridHelper = new THREE.GridHelper(30, 30);
scene.add(gridHelper);

// Add an ambient lights
var ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// Add a point light that will cast shadows
var pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set( 25, 50, 25 );
//light_point.position.set(camera.position.x, camera.position.y, camera.position.z);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
scene.add( pointLight );

// A basic material that shows the geometry wireframe.
var shadowMaterial = new THREE.ShadowMaterial( { color: 0xeeeeee } );
shadowMaterial.opacity = 0.5;
var groundMesh = new THREE.Mesh(
    new THREE.BoxGeometry( 100, 0.1, 100 ),
    shadowMaterial
);
groundMesh.receiveShadow = true;
scene.add( groundMesh );

// generate pig
var pig = generatePig();
scene.add(pig);

// camera controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', function() {renderer.render(scene, camera);});

animate();

function animate() {
  // put this function in queue for another frame after this one
  requestAnimationFrame(animate);

  // update
  //light_point.position.set(camera.position.x, camera.position.y, camera.position.z);
  //controls.update();
  //stats.update();

  // render
  renderer.render(scene, camera);
}

/**
 * Generates a pig
 * @returns pig group
 */
function generatePig() {
  // Skin material of pig
  var skin_material = new THREE.MeshStandardMaterial({
      color: 0xf08080,
      shading: THREE.FlatShading ,
      metalness: 0,
      roughness: 0.8
  });

  // create pig group
  var pig = new THREE.Group();

  // Head of pig
  var head_geometry = new THREE.SphereGeometry(4);
  var head_mesh = new THREE.Mesh(head_geometry, skin_material);
  head_mesh.position.y = 7;
  head_mesh.position.x = 4;
  head_mesh.castShadow = true;
  // create head group and add head_mesh
  var head = new THREE.Group();
  head.add(head_mesh);

  // Eyes of pig
  var eye1_geometry = new THREE.CylinderGeometry(0.25, 0.25, 2);
  var eye_material = new THREE.MeshStandardMaterial({
      color: 0x000000,
      shading: THREE.FlatShading ,
      metalness: 0,
      roughness: 0.8
  });
  var eye_mesh1 = new THREE.Mesh(eye1_geometry, eye_material);
  eye_mesh1.position.y = 8;
  eye_mesh1.position.x = 6.5;
  eye_mesh1.position.z = 1.5;
  eye_mesh1.rotateZ(-Math.PI/2);
  eye_mesh1.castShadow = true;
  // add eye 1 to head group
  head.add(eye_mesh1);

  var eye2_geometry = new THREE.CylinderGeometry(0.25, 0.25, 2);
  var eye_mesh2 = new THREE.Mesh(eye2_geometry, eye_material);
  eye_mesh2.position.y = 8;
  eye_mesh2.position.x = 6.5;
  eye_mesh2.position.z = -1.5;
  eye_mesh2.rotateZ(-Math.PI/2);
  eye_mesh2.castShadow = true;
  // add eye 2 to head group
  head.add(eye_mesh2);

  // Ears of pig
  var ear1_geometry = new THREE.ConeGeometry(1, 2, 8, 1, false);
  var ear_mesh1 = new THREE.Mesh(ear1_geometry, skin_material);
  ear_mesh1.position.y = 11;
  ear_mesh1.position.x = 4;
  ear_mesh1.position.z = 2;
  ear_mesh1.rotateX(Math.PI/6);
  ear_mesh1.castShadow = true;
  // add ear 1 to head group
  head.add(ear_mesh1);

  var ear2_geometry = new THREE.ConeGeometry(1, 2, 8, 1, false);
  var ear_mesh2 = new THREE.Mesh(ear2_geometry, skin_material);
  ear_mesh2.position.y = 11;
  ear_mesh2.position.x = 4;
  ear_mesh2.position.z = -2;
  ear_mesh2.rotateX(-Math.PI/6);
  ear_mesh2.castShadow = true;
  // add ear 2 to head group
  head.add(ear_mesh2);

  // Snout (with nostrils) of pig
  var snout_geometry = new THREE.CylinderGeometry(1, 2, 5);
  var snout_mesh = new THREE.Mesh(snout_geometry, skin_material);
  snout_mesh.position.y = 7;
  snout_mesh.position.x = 6.5;
  snout_mesh.rotateZ(-Math.PI/2);
  snout_mesh.castShadow = true;
  // create snout group and add snout_mesh
  var snout = new THREE.Group();
  snout.add(snout_mesh);

  var nostril1_geometry = new THREE.CylinderGeometry(0.25, 0.25, 5);
  var nostril_material = new THREE.MeshStandardMaterial({
      color: 0x000000,
      shading: THREE.FlatShading ,
      metalness: 0,
      roughness: 0.8
  });
  var nostril_mesh1 = new THREE.Mesh(nostril1_geometry, nostril_material);
  nostril_mesh1.position.y = 7;
  nostril_mesh1.position.x = 6.5;
  nostril_mesh1.position.z = 0.5;
  nostril_mesh1.rotateZ(-Math.PI/2);
  // add nostril 1 to snout group
  snout.add(nostril_mesh1);

  var nostril2_geometry = new THREE.CylinderGeometry(0.25, 0.25, 5);
  var nostril_mesh2 = new THREE.Mesh(nostril2_geometry, nostril_material);
  nostril_mesh2.position.y = 7;
  nostril_mesh2.position.x = 6.5;
  nostril_mesh2.position.z = -0.5;
  nostril_mesh2.rotateZ(-Math.PI/2);
  // add nostril 2 to snout group
  snout.add(nostril_mesh2);
  // add snout to head
  head.add(snout);

  // add head to pig
  pig.add(head);

  // Body of pig
  var body_geometry = new THREE.CylinderGeometry(3.5, 3.5, 8);
  var body_mesh = new THREE.Mesh(body_geometry, skin_material);
  body_mesh.position.y = 3.5;
  body_mesh.rotateZ(Math.PI/2);
  body_mesh.castShadow = true;
  // create head group
  var body = new THREE.Group();
  body.add(body_mesh);

  // Legs of pig
  var leg1_geometry = new THREE.CylinderGeometry(1, 1, 2);
  var leg_mesh1 = new THREE.Mesh(leg1_geometry, skin_material);
  leg_mesh1.position.y = 1;
  leg_mesh1.position.x = -2;
  leg_mesh1.position.z = 2;
  var leg1 = new THREE.Group();
  // create leg 1 group
  leg1.add(leg_mesh1);

  var leg2_geometry = new THREE.CylinderGeometry(1, 1, 2);
  var leg_mesh2 = new THREE.Mesh(leg2_geometry, skin_material);
  leg_mesh2.position.y = 1;
  leg_mesh2.position.x = 2;
  leg_mesh2.position.z = 2;
  // create leg 2 group;
  var leg2 = new THREE.Group();
  leg2.add(leg_mesh2);

  var leg3_geometry = new THREE.CylinderGeometry(1, 1, 2);
  var leg_mesh3 = new THREE.Mesh(leg3_geometry, skin_material);
  leg_mesh3.position.y = 1;
  leg_mesh3.position.x = -2;
  leg_mesh3.position.z = -2;
  // create leg 3 group;
  var leg3 = new THREE.Group();
  leg3.add(leg_mesh3);

  var leg4_geometry = new THREE.CylinderGeometry(1, 1, 2);
  var leg_mesh4 = new THREE.Mesh(leg4_geometry, skin_material);
  leg_mesh4.position.y = 1;
  leg_mesh4.position.x = 2;
  leg_mesh4.position.z = -2;
  // create leg 4 group;
  var leg4 = new THREE.Group();
  leg4.add(leg_mesh4);

  // add legs to body
  body.add(leg1);
  body.add(leg2);
  body.add(leg3);
  body.add(leg4);

  // add body to pig
  pig.add(body);

  // gui
  var gui = new dat.GUI();
  var h = gui.addFolder("Pig Parameters");
  h.open();
  // axis, start, end, increment
  h.add(head.rotation, "y", -0.18*Math.PI, 0.18*Math.PI, 0.01).
      name("Head Side to Side");
  head.position.y = 1.0;
  head.position.x = -0.5;
  h.add(head.rotation, "z", -0.1*Math.PI, 0.08*Math.PI, 0.01).
      name("Head Bob Up & Down");

  return pig;
}
