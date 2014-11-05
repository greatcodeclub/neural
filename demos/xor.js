var NeuralNetwork = require('../lib/neural').Network
var network = new NeuralNetwork()

// Layers
network.addLayer(5, 2) // Hidden layer: 5 neurons, 2 inputs each (# inputs = # inputs to process)
network.addLayer(4)    // Hidden layer: 4 neurons
network.addLayer(1)    // Output layer: 1 neuron, outputting the result

network.trainingIterations = 500000

network.train([
  // Training examples
  // inputs   outputs
  [  [0, 0],  [0]  ],
  [  [0, 1],  [1]  ],
  [  [1, 0],  [1]  ],
  [  [1, 1],  [0]  ]
])

// Querying the network
var output = network.process([1, 0]) // => [1]
console.log("1 XOR 0 =", Math.round(output), output)

var output = network.process([0, 0]) // => [0]
console.log("0 XOR 0 =", Math.round(output), output)

var output = network.process([1, 1]) // => [0]
console.log("1 XOR 1 =", Math.round(output), output)
