// Utility functions
function rand() {
  return Math.random() * 0.4 - 0.2 // Random weight between -0.2 and 0.2
}

// Mean squared error
function mse(errors) {
  // mean squared error
  var sum = errors.reduce(function(sum, i) { return sum + Math.pow(i, 2) }, 0)
  return sum / errors.length
}

function sum(array) {
  return array.reduce(function(sum, i) { return sum + i }, 0)
}

function sigmoid(x) {
  // Sigmoid function: 1 / ( 1 + e^-x )
  return 1 / (1 + Math.pow(Math.E, -x))
}


function Neuron(inputs) {
  this.weights = new Array(inputs)
  this.bias = rand()

  for (var i = 0; i < this.weights.length; i++) {
    this.weights[i] = rand()
  }
}

Neuron.prototype.process = function(inputs) {
  this.lastInputs = inputs // Remember, for training

  var sum = this.bias
  for (var i = 0; i < inputs.length; i++) {
    var input = inputs[i]
    var weight = this.weights[i]
    sum += input * weight
  }

  return this.lastOutput = sigmoid(sum)
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
  var layer = new NeuralLayer(neurons, inputs)
  this.layers.push(layer)

  this.outputLayer = layer // Last layer is output layer
}

NeuralNetwork.prototype.process = function(inputs) {
  var outputs = inputs
  this.layers.forEach(function(layer, i) {
    outputs = layer.process(outputs)
  })
  return outputs
}

NeuralNetwork.prototype.train = function(examples) {
  var iterations = 500000
  var errorThreshold = 0.005
  var learningRate = 0.3

  // Derivative of the sigmoid threshold function
  function dThreshold(output) {
    return output * (1 - output)
  }

  for (var it = 0; it < iterations; it++) {
    for (var e = 0; e < examples.length; e++) {
      var example = examples[e]
      var inputs = example[0]
      var targets = example[1]

      var outputs = this.process(inputs)

      // Compute the delta for the output units, using observed error.
      for (var i = 0; i < this.outputLayer.neurons.length; i++) {
        var neuron = this.outputLayer.neurons[i]

        neuron.error = targets[i] - outputs[i]
        neuron.delta = dThreshold(neuron.lastOutput) * neuron.error
      }

      // Back propagate the errors to the previous layers
      for (var l = this.layers.length - 2; l >= 0; l--) {
        for (var j = 0; j < this.layers[l].neurons.length; j++) {
          var neuron = this.layers[l].neurons[j]

          neuron.error = sum(this.layers[l + 1].neurons.map(function(n) { return n.weights[j] * n.delta }))
          neuron.delta = dThreshold(neuron.lastOutput) * neuron.error

          for (var i = 0; i < this.layers[l + 1].neurons.length; i++) {
            var neuron = this.layers[l + 1].neurons[i]

            for (var w = 0; w < neuron.weights.length; w++) {
              neuron.weights[w] += learningRate * neuron.lastInputs[w] * neuron.delta
            }
            neuron.bias += learningRate * neuron.delta
          }
        }
      }

    } // for examples

    // Check if mean error squared has reached threshold
    var error = mse(this.outputLayer.neurons.map(function(n) { return n.error }))

    if (error <= errorThreshold) {
      console.log("Error threshold reached at iteration", it)
      return
    }

    if (it % 10000 == 0) {
      console.log({ mse: error, iteration: it })
    }

  } // for iterations
}


var brain = new NeuralNetwork()

// Layers
brain.addLayer(5, 2) // Hidden layer: 5 neurons, 2 inputs each (# inputs = # inputs to process)
brain.addLayer(4)    // Hidden layer: 4 neurons
brain.addLayer(1)    // Output layer: 1 neuron, outputting the result

brain.train([
  // Training examples
  // inputs   outputs
  [  [0, 0],  [0]  ],
  [  [0, 1],  [1]  ],
  [  [1, 0],  [1]  ],
  [  [1, 1],  [0]  ]
])

var output = brain.process([1, 0]) // => [1]
console.log(output, Math.round(output))
var output = brain.process([0, 0]) // => [0]
console.log(output, Math.round(output))
var output = brain.process([1, 1]) // => [0]
console.log(output, Math.round(output))
