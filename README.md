# Gravity Simulator
A gravity simulator, built to understand how celestial bodies warp the fabric of space-time and interact with each other. 
Inspired by [particle.js](https://github.com/VincentGarreau/particles.js/) and the recently released photograph of a black hole 
by the EHT research group.

## Usage
Before using the simulator, there are a few things that need to be defined. In the `startSimulation` function, define:
<br />
<ul>
<li><code>id</code>   - Your chosen canvas' id</li>
<li><code>size</code> - Size of your canvas</li>
<li><code>amountOfObjects</code> - The number of objects to be rendered initially. I reccomend about 80-100</li>
<li><code>g</code> - The gravitational constant </li>
<li><code>slowDown</code> - A numerical factor used to slow down the animation</li>
</ul>

Call `stopSimulation` to stop the simulation
