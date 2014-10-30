function rand() {
  return Math.random() * 0.4 - 0.2 // Random weight between -0.2 and 0.2
}

function Neuron(inputs) {
  this.weights = new Array(inputs)
  this.bias = rand()

  for (var i = 0; i < this.weights.length; i++) {
    this.weights[i] = rand()
  }
}

Neuron.prototype.process = function(inputs) {
  var sum = this.bias
  for (var i = 0; i < inputs.length; i++) {
    var input = inputs[i]
    var weight = this.weights[i]
    sum += input * weight
  }
  return this.thresold(sum)
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
  return // TODO

  var iterations = 1
  var errorThreshold = 0.005
  var learningRate = 0.3

  var error = 1
  for (var i = 0; i < iterations && error > errorThreshold; i++) {
    var sum = 0

    examples.forEach(function(example) {
      var inputs = example[0]
      var outputs = example[1]
      
      // TODO ...
      // forward propogate
      this.runInput(inputs)

      // back propogate
      this.calculateDeltas(outputs)
      this.adjustWeights(learningRate)

      sum += mse(this.errors[this.outputLayer])
    })

    error = sum / examples.length
  }
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
