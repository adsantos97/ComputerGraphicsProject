## Introduction/Description
This is my final project for CS486: Computer Graphics. The project models a low poly pig, and procedurally modelled trees with basic keyboard functions. Basically, it is a little pig running through a forest.

### Project Specifics
Project Option Chosen: Option 1 - Modeling  
Manual Modeling & Procedural Modeling

Primitives Used:
* Sphere
* Cylinder
* Cone
* Box

Effects Used:
* Shadows
* Particle System
* Keyboard Interaction
* Collision Detection/Physics

## Implementation
Plateus:
* Model the Pig
* Model the Forest (procedural)
* Add keyboard controls to move the Pig
* Shadows
* Collision detection/physics
* Add other effects if there is time

### Modeling the Pig
I modelled the pig separately with the help of the AxesHelper() and GridHelper() from our class labs.  
I created a pig group, which would be the group that would return at the end of generatePig().  
The following groups were added to the pig group:
* head
* body  

The head group consists of adding:
* eyes
* ears
* snout group
* nostrils (added to the snout group)

The body group consists of adding:
* leg1 group
* leg2 group
* leg3 group
* leg4 group

![Model of Pig](https://github.com/adsantos97/ComputerGraphicsProject/blob/master/images/modeledPig.JPG) 
<a href="https://imgur.com/X84ahlO"><img src="https://i.imgur.com/X84ahlO.jpg" title="source: imgur.com" /></a>

Extra GUI controls for FUN:  
```
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
 ```

### Modeling the Forest, Adding keyboard controls, Shadows, Collision Detection
For the majority of the effects, I used [Creating a Simple 3D Endless Runner Game Using Three.js](https://gamedevelopment.tutsplus.com/tutorials/creating-a-simple-3d-endless-runner-game-using-three-js--cms-29157).  
![Example Model](https://github.com/adsantos97/ComputerGraphicsProject/blob/master/images/example.JPG)  
<a href="https://imgur.com/LrqsAHP"><img src="https://i.imgur.com/LrqsAHP.jpg" title="source: imgur.com" /></a>
**Fog Effect:** `scene.fog = new THREE.FogExp2(0xff66b2, 0.14);`  
**Shadows:** Manipulate `receiveShadow` and `castShadow` on meshes for objects.  
To enable shadows on the scene:  
```
renderer.shadowMap.enabled = true; 
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
```
**Modeling the Trees:** Use `createTree()`, `blowUpTree()`, and `tightenTree()`. These methods use vertex manipulation. Use `addWorldTrees()`, `addTree()`, `addPathTree()`, `createTreesPool()`, and `doTreeLogic()` for placement of trees.  
**Keyboard Controls:**  
* `keyEvent.keyCode === 66` - "b" to rotate the pig
* `keyEvent.keyCode === 37` - left arrow to move left
* `keyEvent.keyCode === 39` - right arrow to move right
* `keyEvent.keyCode === 38` - up arrow to jump  

**Collision Detection & Particle Explosion:** `doTreeLogic()` checks if the Pig is close to a tree. `explode()` and `doExplosionLogic()` are called when Pig collides. `addExplosion()` creates a pixelated explosion using `ParticleBasicMaterial` and `Points`.  

**Add Extra Particle System:** Used in the background.  
```
function drawStars() {
  stars = new THREE.Group();
  scene.add(particles);

  var star_geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);

  var i;
  for(i = 0; i < particles; i++) {
    var star_material = new THREE.MeshPhongMaterial({
      color: 0x2D6905,
      shading: THREE.FlatShading
    });

    var star_mesh = new THREE.Mesh(star_geometry, star_material);
    star_mesh.position.set((Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);

    star_mesh.updateMatrix();
    star_mesh.matrixAutoUpdate = false;
    stars.add(star_mesh);
    scene.add(stars);
  }
```

**Video Demo**
[Pig Three.js](https://youtu.be/6Kiu6m2S1z4)  

## Technical Issues Faced
- Images won't show up on GitHub Page
- Legs won't pivot correctly on the pig. I chose to omit their movement.
- I changed the Orbit Control keys to change the camera. Both those keys and the keys to move the pig shift the screen a bit.
- The background particles collide with the world.

## Sources Used
* Hierarchial Transformation lab - used for modeling the pig  
* [Mastering Markdown](https://guides.github.com/features/mastering-markdown/) - used to create the GitHub Page  
* [Creating a Simple 3D Endless Runner Game Using Three.js](https://gamedevelopment.tutsplus.com/tutorials/creating-a-simple-3d-endless-runner-game-using-three-js--cms-29157) - tutorial used for a majority of the effects
* [Beginning with 3D WebGL](https://codepen.io/rachsmith/post/beginning-with-3d-webgl-pt-1-the-scene) - beginning reference
* [Animating Scenes with WebGL + Three.js](https://www.august.com.au/blog/animating-scenes-with-webgl-three-js/) - beginning reference
* [Particles Example](https://threejs.org/examples/?q=partic#webgl_buffergeometry_custom_attributes_particles) - used for background particles
* [w3schools](https://www.w3schools.com/jsref/dom_obj_style.asp) - help with HTML
* [Three.js](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene) - three.js documentation to help understand various methods.  

## Vocabulary
* low poly: is a polygon mesh in 3D computer graphics that has a relatively small number of polygons.
