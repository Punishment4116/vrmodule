/*
This is your site JavaScript code - you can add interactivity and carry out processing
- Initially the JS writes a message to the console, and moves a button you can add from the README
*/

// Print a message in the browser's dev tools console each time the page loads
// Use your menus or right-click / control-click and choose "Inspect" > "Console"
console.log("Hello 🌎");

/* 
Make the "Click me!" button move when the visitor clicks it:
- First add the button to the page by following the "Next steps" in the README
*/
document.getElementById('basketball').setAttribute('position', '10 10 10');

var player = document.querySelector('#player')
var basketball = document.querySelector('#basketball')
var counter = 1;
var holding = document.getElementById('basketball');

var rotationOfPlayerOnYAxisInRadians; // This will keep track of how much the player has turned (or "spinned"). More specifically, it will keep track of how much the player has turned on his or her Y axis. If you don't understand radians, don't worry, they're pretty simple: 360 degrees = 2 PI radians (or about 6.28 radians); 180 degrees = PI radians; 90 degrees = PI/2 radians; etc.)

var firstComponentOfPlayerRotation; // "Component" here does NOT refer to an A-Frame component/attribute.  Instead, "component" here refers to the components of a VECTOR.  You can think of a vector as the hypotenuse of a right triangle.  A vector's components are simply the other two sides of the right triangle (more below).  In other words, vector components/sides allow us to more easily work with diagonal things (e.g. diagonal movements, diagonal velocities, etc.).  Vectors are the main building blocks of every physics engine!

var secondComponentOfPlayerRotation; // This variable and the one above are the most complicated part of the whole program!  Here's an explanation:

if (basketball.addEventListener) {
	// IE9, Chrome, Safari, Opera
    player.addEventListener("mousewheel", MouseWheelHandler, false);
	basketball.addEventListener("mousewheel", MouseWheelHandler, false);
    document.getElementById('turnhalle').addEventListener('mousewheel', MouseWheelHandler, false)
	// Firefox
	basketball.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
    console.log(1)
}
// IE 6/7/8
else {
    basketball.attachEvent("onmousewheel", MouseWheelHandler);
    console.log(2)
}

function MouseWheelHandler(e) {

	// cross-browser wheel delta
	var e = window.event || e; // old IE support
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    console.log(e);
    console.log(delta);
    delta = Math.sign(delta);
    //getting the mouse wheel change (120 or -120 and normalizing it to 1 or -1)
    console.log(basketball.getAttribute('position').x)
    var rawPos = basketball.getAttribute('position')+'';
    var oldPos = rawPos.split(' ');
    var finalZoom=Number(oldPos[2])+delta;
    //limiting the zoom so it doesnt zoom too much in or out
    if(finalZoom<1)
      finalZoom=1;
    if(finalZoom>5)
      finalZoom=5;  

    //setting the camera element
    var pos = oldPos[0] + " " + oldPos[1] + " " + finalZoom;
    document.getElementById('basketball').setAttribute('position','3 3 3')
    console.log(holding.getAttribute('position'));
    console.log(finalZoom);
    console.log(pos);
    console.log(oldPos)

	return false;
}

var tickerCounter = 0;
  AFRAME.registerComponent('player-monitor', { // If you haven't read about how make your own components/attributes in A-Frame, take a look at the documentation. (Note: Here I'm back to talking about "components" as ATTRIBUTES. It's a bit confusing!)

    tick: function(){ // A tick is a single redraw of the entire scene.  Tick functions are called 90 times every second. (In other words: the rate at which A-Frame redraws everything.)  If you need a variable to be constantly updated, then you need to add at least one tick function to your scene's script.
      tickerCounter++; // For debugging purposes

      rotationOfPlayerOnYAxisInRadians = this.el.object3D.rotation.y; //This is how we access the rotation of an object along an axis.  Since I attached this component/attribute to the player, I can use "this.el...".

      firstComponentOfPlayerRotation = Math.sin(rotationOfPlayerOnYAxisInRadians); //Here's the trigonomtey discussed above
      secondComponentOfPlayerRotation = Math.cos(rotationOfPlayerOnYAxisInRadians);

       //The ball actually starts as static-body underneath the green platform.  Once I turn this boolean variable to false, the ball begins to follow the player. (Note: It's still a static-body when following the player!)
        var playerXposition = this.el.object3D.position.x;
        var playerYposition = this.el.object3D.position.y; // We use these variables to access the player's position;
        var playerZposition = this.el.object3D.position.z;

        basketball.setAttribute("position", `${playerXposition} ${playerYposition} ${playerZposition - 2}`);
      

      if (tickerCounter === 89){ // For debugging purposes
        console.log("-----One second just passed-----");
        console.log("First component of player rotation: " + firstComponentOfPlayerRotation);
        console.log("Second component of player rotation: " + secondComponentOfPlayerRotation);
        console.log("Xpos: " + playerXposition);
        console.log("Ypos: " + playerYposition);
        console.log("Zpos: " + playerZposition);
        tickerCounter = 0;
      }
    }
  });

AFRAME.registerComponent('abc',{
    init: function () {
        document.addEventListener("mousedown", function(){
            //this.el.parentNode.removeChild(this.el);
        });
    } 
});

AFRAME.registerComponent('spawnbutton', {
    init: function () {
        var basketbutton = document.querySelector('#basketbutton');
        basketbutton.addEventListener("mousedown",function(evt){
            basketbutton.setAttribute('material', 'color',"red");
            let ball = document.createElement('a-sphere');
            ball.setAttribute('id', createId());
            ball.setAttribute('position', '-3 3 0');
            ball.setAttribute('radius', 0.35);
            ball.setAttribute('src', '#ball');
            ball.setAttribute('dynamic-body','linear-damping',0.05);
            ball.setAttribute('dynamic-body','mass',0.01);
            document.querySelector('#turnhalle').appendChild(ball);
        });
        basketbutton.addEventListener("mouseup",function(evt){
            basketbutton.setAttribute('material', 'color',"blue");
        });
        basketbutton.addEventListener("mouseenter", function (evt) {
            basketbutton.setAttribute('material', 'color', 'green');
        });
        basketbutton.addEventListener("mouseleave", function (evt) {
           basketbutton.setAttribute('material', 'color', 'blue');
        });
    }
});

AFRAME.registerComponent('startbutton', {
    init: function () {
        var cube = document.querySelector("#test");
        cube.addEventListener("mousedown",function(evt){
            cube.setAttribute('material', 'color',"red");
        });
        cube.addEventListener("mouseup",function(evt){
            cube.setAttribute('material', 'color',"blue");
        });
        
        var Xpush = firstComponentOfPlayerRotation * -22;
        var Zpush = secondComponentOfPlayerRotation * -22; //Since we used a hypotenuse of 1 to calculate these vector components, we now need to multiply each one before using them in a "push" vector (see below).  Otherwise, the push vector might be very weak.

        //I'm honestly not sure why we need NEGATIVE 22 here.  Regular 22 was sending it in exactly the opposite direction that I wanted, so I just made it negative.

        var push = new CANNON.Vec3(Xpush, 0, Zpush); //This is how you create a vector.  Try playing around with this push vector by substituting your own numbers.  Note that the Y-component of the vector is kept at zero, since we don't want the ball to move up or down.

        console.log(push);
        //document.getElementById('basketball').body.velocity = push;
        cube.body.velocity = push; //This is how you actually APPLY the vector.  (There may additional ways to apply this vector that I don't understand yet.)  Basically, you're setting the ball's velocity to the vector you created.  This means the ball will immediately start moving at this new velocity.  However, it's velocity will also immediately begin to slow down, since other vectors (namely, friction & drag vectors built into the physics engine) will work against velocity.
        
    }
});

function appendObject(id, position, radius, material) {
    $('<a-sphere/>', {
      id: id,
      position: position,  // doesn't seem to do anything, known issue
      radius: radius,
      material: material,
      appendTo : $('#turnhalle')
    });
   document.getElementById(id).setAttribute("position", position); // this does set position as a workaround
}

function createId(){
    var id = "ball";
    return id+counter++;
}