var neural = require('../lib/neural')
var network = new neural.Network()

network.addLayer(10, 20) // Hidden layer, 10 neurons, 20 inputs
network.addLayer(2)      // Output layer, 2 neurons

// Querying the network
var outputs = network.process([
  1, 1, 1, 1,
  1, 0, 0, 1,
  0, 0, 1, 0,
  0, 1, 0, 0,
  1, 1, 1, 0
])
// outputs === [~1, ~0]

// Convert the output to binary (base 2) and then to decimal (base 10).
var binary  = outputs.map(function(v) { return Math.round(v) }).join("")
var decimal = parseInt(binary, 2)

console.log("Recognized", decimal, outputs)
