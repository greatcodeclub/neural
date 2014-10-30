function Neuron(inputs) {
  this.weights = new Array(inputs)
  for (var i = 0; i < this.weights.length; i++) {
    this.weights[i] = Math.random() * 0.4 - 0.2 // Random weight between -0.2 and 0.2
  }
}

Neuron.prototype.process = function(inputs) {
  var sum = 0
  for (var i = 0; i < inputs.length; i++) {
    var input = inputs[i]
    var weight = this.weights[i]
    sum += this.thresold(input * weight)
  }
  return sum
}

Neuron.prototype.thresold = function(x) {
  // Sigmoid function: 1 / ( 1 + e^-x )
  return 1 / (1 + Math.pow(Math.E, -x))
}


function NeuralLayer(neurons, inputs) {
  this.neurons = new Array(neurons)
  for (var i = 0; i < this.neurons.length; i++) {
    this.neurons[i] = new Neuron(inputs)
  }
}

NeuralLayer.prototype.process = function(inputs) {
  return this.neurons.map(function(neuron) {
    return neuron.process(inputs)
  })
}


function NeuralNetwork() {
  this.layers = []
}

NeuralNetwork.prototype.addLayer = function(neurons, inputs) {
  if (inputs == null) {
    // Default number of inputs to number of neurons in previous layer.
    var previousLayer = this.layers[this.layers.length - 1]
    inputs = previousLayer.neurons.length
  }
  this.layers.push(new NeuralLayer(neurons, inputs))
}

NeuralNetwork.prototype.process = function(inputs) {
  var outputs = inputs
  this.layers.forEach(function(layer) {
    outputs = layer.process(outputs)
  })
  return outputs
}

NeuralNetwork.prototype.train = function(examples) {
  // TODO
}


var brain = new NeuralNetwork()

// Layers
// 1  2  3
// o
// o  o
// o  o
// o  o
// o  o  o
brain.addLayer(5, 2) // 1. Input layer:  5 neurons, 2 inputs each (# inputs = # inputs to process)
brain.addLayer(4)    // 2. Hidden layer: 4 neurons
brain.addLayer(1)    // 3. Output layer: 1 neuron, outputting the result

brain.train([
  // Training examples
  // inputs   outputs
  [  [0, 0],  [0]  ],
  [  [0, 1],  [1]  ],
  [  [1, 0],  [1]  ],
  [  [1, 1],  [0]  ]
])

var output = brain.process([1, 0]) // => [0]
console.log(output)
