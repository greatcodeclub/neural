var NeuralNetwork = require('../lib/neural').Network
var network = new NeuralNetwork()

// Layers
network.addLayer(7, 15)
network.addLayer(2)

var one = [
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
]

var two = [
  1, 1, 1,
  0, 0, 1,
  0, 1, 0,
  1, 0, 0,
  1, 1, 1,
]

var three = [
  1, 1, 0,
  0, 0, 1,
  0, 1, 0,
  0, 0, 1,
  1, 1, 0,
]

network.errorThreshold = 0.0001

network.train([
  // Training examples
  // inputs   outputs
  [  one,     [0, 1]  ],
  [  two,     [1, 0]  ],
  [  three,   [1, 1]  ],
])

// Querying the network
var output = network.process([
  1, 1, 1,
  1, 0, 1,
  0, 1, 0,
  1, 0, 0,
  1, 1, 0,
])
var bits = output.map(function(v) { return Math.round(v) }).join("")
console.log("Recognized", parseInt(bits, 2), output)
