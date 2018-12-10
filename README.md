## Introduction/Description
This is my final project for CS486: Computer Graphics. The project models a low poly pig, and procedurally modelled trees with basic keyboard functions. Basically, it is a little pig running through a forest.

### Project Specifics
Project Option Chosen: Option 1 - Modeling  
Manual Modeling & Procedural Modeling

Primitives Used:
* Sphere
* Cylinder
* Cone

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

![Model of Pig](ComputerGraphicsProject/images/modeledPig.JPG)

### Modeling the Forest, Adding keyboard controls, Shadows, Collision Detection
For the majority of the effects, I used [Creating a Simple 3D Endless Runner Game Using Three.js](https://gamedevelopment.tutsplus.com/tutorials/creating-a-simple-3d-endless-runner-game-using-three-js--cms-29157).  
Fog Effect: `scene.fog = new THREE.FogExp2(0xff66b2, 0.14);`


## Technical Issues Faced

## Sources Used
* Hierarchial Transformation lab - used for modeling the pig  
* [Mastering Markdown](https://guides.github.com/features/mastering-markdown/) - used to create the GitHub Page  
* [Creating a Simple 3D Endless Runner Game Using Three.js](https://gamedevelopment.tutsplus.com/tutorials/creating-a-simple-3d-endless-runner-game-using-three-js--cms-29157) - tutorial used for a majority of the effects

## Vocabulary
* low poly: is a polygon mesh in 3D computer graphics that has a relatively small number of polygons.
