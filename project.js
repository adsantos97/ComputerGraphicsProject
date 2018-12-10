/*
* Arizza Santos
* Mon Dec 10, 2018
*
* Sources:
* (1) https://codepen.io/rachsmith/post/beginning-with-3d-webgl-pt-1-the-scene
* (2) https://www.august.com.au/blog/animating-scenes-with-webgl-three-js/
* (3) https://gamedevelopment.tutsplus.com/tutorials/creating-a-simple-3d-
*     endless-runner-game-using-three-js--cms-29157
* (4) https://www.w3schools.com/jsref/dom_obj_style.asp
*/

var sceneWidth;
var sceneHeight;
var camera;
var scene;
var renderer;
var sun;
var ground;
var orbitcontrol;
var rollingGroundSphere;
var pig;
var rollingSpeed = 0.008;
var heroRollingSpeed;
var worldRadius = 26;
var heroRadius = 0.2;
var sphericalHelper;
var pathAngleValues;
var heroBaseY = 1.8;
var boundValue = 0.1;
var gravity = 0.005;
var leftLane = -1;
var rightLane = 1;
var middleLane = 0;
var currentLane;
var clock;
var jumping;
var treeReleaseInterval = 0.5;
var lastTreeReleaseTime = 0;
var treesInPath;
var treesPool;
var particleGeometry;
var particleCount = 20;
var explosionPower = 1.06;
var particles;
var scoreText;
var score;
var hasCollided;

init();

/**
 * Initialize world
 */
function init() {
  // set up the world
  createScene();

  // call world loop
  update();
}

/**
 * Create the scene for the world.
 */
function createScene() {
  hasCollided = false;
  score = 0;
  treesInPath = [];
  treesPool = [];
  clock = new THREE.Clock();
  clock.start();
  heroRollingSpeed = (rollingSpeed * worldRadius / heroRadius) / 5;
  sphericalHelper = new THREE.Spherical();
  pathAngleValues = [1.52, 1.57, 1.62];

  sceneWidth = window.innerWidth;
  sceneHeight = window.innerHeight;

  // create a scene to place objects, cameras, lighting
  scene = new THREE.Scene();
  // add fog
  scene.fog = new THREE.FogExp2(0xff66b2, 0.14);
  var aspect = sceneWidth/sceneHeight;
  camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({alpha:true});
  renderer.setClearColor(0xFCDDEB, 1);
  renderer.shadowMap.enabled = true; // enable shadow
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(sceneWidth, sceneHeight);
  document.body.appendChild(renderer.domElement);

  createTreesPool();
  addWorld();
  addPig();
  addLight();
  addExplosion();

  camera.position.z = 6.5;
  camera.position.y = 2.5;

  // Orbit controls allow to move around the scene
  orbitcontrol = new THREE.OrbitControls(camera, renderer.domElement);
  orbitcontrol.addEventListener('change', render);
  orbitcontrol.enableZoom = true;
  orbitcontrol.keys = {
    LEFT: 65, //a
    UP: 87, //w
    RIGHT: 68, //d
    BOTTOM: 83 //s
  };

  window.addEventListener('resize', onWindowResize, false);

  // handle keyboard interaction
  document.onkeydown = handleKeyDown;
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

/**
 * Create scrolling ground -> world to move on
 * Illusion of rotating a big sphere on the x axis.
 * Vertex manipulation is used to change the surface of the sphere into rough
 * terrain.
 */
function addWorld() {
  var sides = 40;
  var tiers = 40;
  var sphereGeometry = new THREE.SphereGeometry(worldRadius, sides, tiers);
  var sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xFF6C66,
    shading:THREE.FlatShading
  });

  var vertexIndex;
  var vertexVector = new THREE.Vector3();
  var nextVertexVector = new THREE.Vector3();
  var firstVertexVector = new THREE.Vector3();
  var offset = new THREE.Vector3();
  var currentTier = 1;
  var lerpValue = 0.5;
  var heightValue;
  var maxHeight = 0.07;
  for(var j = 1; j < tiers - 2; j++){
    currentTier = j;
    for(var i = 0; i < sides; i++){
      vertexIndex = (currentTier * sides) + 1;
      vertexVector = sphereGeometry.vertices[i + vertexIndex].clone();
      if(j % 2 !== 0){
        if(i == 0){
          firstVertexVector = vertexVector.clone();
        }
        nextVertexVector = sphereGeometry.vertices[i + vertexIndex + 1].clone();
        if(i == sides - 1){
          nextVertexVector=firstVertexVector;
        }
        lerpValue = (Math.random() * (0.75 - 0.25)) + 0.25;
        vertexVector.lerp(nextVertexVector, lerpValue);
      }
      heightValue = (Math.random() * maxHeight) - (maxHeight / 2);
      offset = vertexVector.clone().normalize().multiplyScalar(heightValue);
      sphereGeometry.vertices[i + vertexIndex] = (vertexVector.add(offset));
    }
  }
  rollingGroundSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	rollingGroundSphere.receiveShadow = true;
	rollingGroundSphere.castShadow = false;
	rollingGroundSphere.rotation.z = -Math.PI / 2;
	scene.add(rollingGroundSphere);
	rollingGroundSphere.position.y = -24;
	rollingGroundSphere.position.z = 2;
	addWorldTrees();
}

/**
 * Add sunlight to the scene using hemisphereLight and DirectionalLight.
 */
function addLight(){
  var hemisphereLight = new THREE.HemisphereLight(0xfffafa, 0x000000, 0.9);
  scene.add(hemisphereLight);
  sun = new THREE.DirectionalLight(0xcdc1c5, 0.9);
  sun.position.set(12, 6, -7);
  sun.castShadow = true;
  scene.add(sun);
	//Set up shadow properties for the sun light
  sun.shadow.mapSize.width = 256;
  sun.shadow.mapSize.height = 256;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 50;
}

/**
 * Use vertex manipulation on the primitives (cone & cylinder)
 */
function createTree(){
  var sides = 8;
  var tiers = 6;
  var scalarMultiplier = (Math.random() * (0.25-0.1)) + 0.05;
  var midPointVector = new THREE.Vector3();
  var vertexVector= new THREE.Vector3();

  var treeGeometry = new THREE.ConeGeometry(0.75, 1, sides, tiers);
  var treeMaterial = new THREE.MeshStandardMaterial({
    color: 0x6600CC,shading:THREE.FlatShading
  });

  var offset;
  midPointVector = treeGeometry.vertices[0].clone();
  var currentTier=0;
  var vertexIndex;
  blowUpTree(treeGeometry.vertices, sides, 0, scalarMultiplier);
  tightenTree(treeGeometry.vertices, sides, 1);
  blowUpTree(treeGeometry.vertices, sides, 2, scalarMultiplier*1.1, true);
  tightenTree(treeGeometry.vertices, sides, 3);
  blowUpTree(treeGeometry.vertices, sides, 4, scalarMultiplier*1.2);
  tightenTree(treeGeometry.vertices, sides, 5);

  var treeTop = new THREE.Mesh(treeGeometry, treeMaterial);
  treeTop.castShadow = true;
  treeTop.receiveShadow = false;
  treeTop.position.y = 0.9;
  treeTop.rotation.y=(Math.random()*(Math.PI));

  var treeTrunkGeometry = new THREE.CylinderGeometry(0.2, 0.2,0.5);
  var trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x886633,shading:THREE.FlatShading
  });
  var treeTrunk = new THREE.Mesh(treeTrunkGeometry, trunkMaterial);
  treeTrunk.position.y = 0.25;
  var tree =new THREE.Object3D();
  tree.add(treeTrunk);
  tree.add(treeTop);
  return tree;
}

/**
 * Pushes out every alternative vertex in a ring of vertices while keeping
 * the other vertices in the ring at a lesser height. This creates the pointy
 * branches on the tree.
 * Uses random rotation on the y axis to break uniformity.
 */
function blowUpTree(vertices, sides, currentTier, scalarMultiplier, odd){
  var vertexIndex;
  var vertexVector = new THREE.Vector3();
  var midPointVector = vertices[0].clone();
  var offset;
  for(var i = 0; i < sides; i++){
    vertexIndex = (currentTier * sides) + 1;
    vertexVector = vertices[i + vertexIndex].clone();
    midPointVector.y = vertexVector.y;
    offset = vertexVector.sub(midPointVector);
    if(odd){
      if(i%2 === 0){
        offset.normalize().multiplyScalar(scalarMultiplier / 6);
        vertices[i + vertexIndex].add(offset);
      } else {
        offset.normalize().multiplyScalar(scalarMultiplier);
        vertices[i + vertexIndex].add(offset);
        vertices[i + vertexIndex].y = vertices[i + vertexIndex + sides].y + 0.05;
      }
    } else {
      if(i%2 !== 0){
        offset.normalize().multiplyScalar(scalarMultiplier / 6);
        vertices[i + vertexIndex].add(offset);
      } else {
        offset.normalize().multiplyScalar(scalarMultiplier);
        vertices[i + vertexIndex].add(offset);
        vertices[i + vertexIndex].y = vertices[i + vertexIndex + sides].y + 0.05;
      }
    }
  }
}

/**
 * Shrink down the next ring of vertices.
 */
function tightenTree(vertices, sides, currentTier){
  var vertexIndex;
  var vertexVector= new THREE.Vector3();
  var midPointVector=vertices[0].clone();
  var offset;
  for(var i = 0; i < sides; i++){
    vertexIndex = (currentTier * sides) + 1;
    vertexVector = vertices[i + vertexIndex].clone();
    midPointVector.y = vertexVector.y;
    offset = vertexVector.sub(midPointVector);
    offset.normalize().multiplyScalar(0.06);
    vertices[i + vertexIndex].sub(offset);
  }
}

/**
 * Called from update() when enough time has elapsed planting the last tree.
 */
function addPathTree() {
  var options = [0, 1, 2];
  var lane = Math.floor(Math.random() * 3);
  addTree(true, lane);
  options.splice(lane, 1);
  if(Math.random() > 0.5){
    lane = Math.floor(Math.random() * 2);
    addTree(true, options[lane]);
  }
}

/**
 * Places trees not in the path of the Pig.
 */
function addWorldTrees() {
  var numTrees = 36;
  var gap = 6.28 / 36;
  for(var i = 0; i < numTrees; i++){
    addTree(false, i * gap, true);
    addTree(false, i * gap, false);
  }
}

/**
 * Place trees on the world.
 */
function addTree(inPath, row, isLeft){
  var newTree;
  if(inPath){
    if(treesPool.length == 0) return;
    newTree = treesPool.pop();
    newTree.visible = true;
    //console.log("add tree");
    treesInPath.push(newTree);
    sphericalHelper.set(worldRadius - 0.3, pathAngleValues[row],
      -rollingGroundSphere.rotation.x + 4 );
    } else {
      newTree = createTree();
      var forestAreaAngle = 0; //[1.52,1.57,1.62];
      if(isLeft){
        forestAreaAngle = 1.68 + Math.random() * 0.1;
      } else {
        forestAreaAngle = 1.46 - Math.random() * 0.1;
      }
      sphericalHelper.set(worldRadius - 0.3, forestAreaAngle, row);
    }
    newTree.position.setFromSpherical(sphericalHelper);
    var rollingGroundVector = rollingGroundSphere.position.clone().normalize();
    var treeVector = newTree.position.clone().normalize();
    newTree.quaternion.setFromUnitVectors(treeVector, rollingGroundVector);
    newTree.rotation.x += (Math.random() * (2 * Math.PI / 10)) + -Math.PI / 10;

    rollingGroundSphere.add(newTree);
  }

  /**
   * Plant the trees on the path of the Pig.
   */
   function createTreesPool() {
     var maxTreesInPool = 10;
     var newTree;
     for(var i = 0; i < maxTreesInPool; i++){
       newTree = createTree();
       treesPool.push(newTree);
     }
   }

/**
 * Returns the tree to the pool once it goes out of view.
 * Also used for collision detection; checks if the Pig is close to a tree.
 */
function doTreeLogic(){
  	var oneTree;
  	var treePos = new THREE.Vector3();
  	var treesToRemove = [];
  	treesInPath.forEach( function(element, index) {
  		oneTree = treesInPath[index];
  		treePos.setFromMatrixPosition(oneTree.matrixWorld);
  		if(treePos.z > 6 && oneTree.visible){//gone out of our view zone
  			treesToRemove.push(oneTree);
  		} else {//check collision
  			if(treePos.distanceTo(pig.position) <= 0.6){
  				console.log("hit");
  				hasCollided = true;
  				explode();
  			}
  		}
  	});
  	var fromWhere;
  	treesToRemove.forEach(function (element, index) {
  		oneTree = treesToRemove[ index ];
  		fromWhere = treesInPath.indexOf(oneTree);
  		treesInPath.splice(fromWhere, 1);
  		treesPool.push(oneTree);
  		oneTree.visible = false;
  		console.log("remove tree");
  	});
}

/**
 * Block pixel explosion effect
 */
function addExplosion(){
  particleGeometry = new THREE.Geometry();
  for(var i = 0; i < particleCount; i ++ ) {
    var vertex = new THREE.Vector3();
    particleGeometry.vertices.push(vertex);
  }
  var pMaterial = new THREE.ParticleBasicMaterial({
    color: 0xffcce5,
    size: 0.2
  });
  particles = new THREE.Points(particleGeometry, pMaterial);
  scene.add(particles);
  particles.visible = false;
}

/**
 * Called in update() to make particle object visible.
 */
function doExplosionLogic(){
  if(!particles.visible) return;
	for(var i = 0; i < particleCount; i++) {
    particleGeometry.vertices[i].multiplyScalar(explosionPower);
	}
  if(explosionPower > 1.005){
		explosionPower -= 0.001;
	} else {
		particles.visible = false;
	}
  particleGeometry.verticesNeedUpdate = true;
}

/**
 * Called when the effect needs to run.
 */
function explode() {
  particles.position.y = 2;
	particles.position.z = 4.8;
	particles.position.x = pig.position.x;
  for(var i = 0; i < particleCount; i++) {
    var vertex = new THREE.Vector3();
    vertex.x = -0.2 + Math.random() * 0.4;
		vertex.y = -0.2 + Math.random() * 0.4 ;
		vertex.z = -0.2 + Math.random() * 0.4;
		particleGeometry.vertices[i] = vertex;
	}
  explosionPower = 1.07;
	particles.visible = true;
}

/**
 * User Interaction.
 */
 function handleKeyDown(keyEvent) {
   if(jumping) return;
   var validMove = true;

   if (keyEvent.keyCode === 66) { // turn backwards
     pig.rotateY(Math.PI/2);
   }

   if (keyEvent.keyCode === 37) { //left
     if(currentLane == middleLane) {
       currentLane = leftLane;
     } else if(currentLane == rightLane) {
       currentLane = middleLane;
     } else {
       validMove = false;
     }
   } else if ( keyEvent.keyCode === 39) { //right
     if(currentLane == middleLane){
       currentLane = rightLane;
     } else if(currentLane==leftLane){
       currentLane = middleLane;
     } else {
       validMove = false;
     }
   } else {
     if(keyEvent.keyCode === 38){ //up, jump
       bounceValue = 0.1;
       jumping = true;
     }
     validMove = false;
   }

   if(validMove){
     jumping = true;
     bounceValue = 0.06;
   }
 }

/**
 * Add Pig to scene
 */
function addPig(){
  jumping = false;
  pig = generatePig();
  pig.receiveShadow = true;
  pig.castShadow = true;
  pig.rotateY(Math.PI/2);
  pig.scale.set(0.2 * 0.2, 0.2 * 0.2, 0.2 * 0.2);
  scene.add(pig);//heroSphere);

  pig.position.y = heroBaseY;
  pig.position.z = 4.8;
  currentLane = middleLane;
  pig.position.x = currentLane;
}

/**
 * Core mechanic for world loop.
 * Gets called repeatedly using requestAnimationFrame
 */
function update(){
  rollingGroundSphere.rotation.x += rollingSpeed;
  if(pig.position.y<=heroBaseY){
  	jumping = false;
  	bounceValue = (Math.random() * 0.04) + 0.005;
  }
  pig.position.y += bounceValue;
  pig.position.x = THREE.Math.lerp(pig.position.x,
  currentLane, 2 * clock.getDelta()); //clock.getElapsedTime());
  bounceValue -= gravity;
  if(clock.getElapsedTime() > treeReleaseInterval){
    clock.start();
  	addPathTree();
  }
  doTreeLogic();
  doExplosionLogic();
  render();
  requestAnimationFrame(update); //request next update
}

/**
 * Render the camera and scene combination.
 */
function render() {
  renderer.render(scene, camera);
}

/**
 * Gets called when user resizes their window.
 */
function onWindowResize() {
  sceneHeight = window.innerHeight;
  sceneWidth = window.innerWidth;
  renderer.setSize(sceneWidth, sceneHeight);
  camera.aspect = sceneWidth/sceneHeight;
  camera.updateProjectMatrix();
}
