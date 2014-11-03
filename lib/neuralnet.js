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

  return this.lastOutput = this.threshold(sum)
}

Neuron.prototype.threshold = function(x) {
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
  var iterations = 10
  var errorThreshold = 0.005
  var learningRate = 0.3

  for (var i = 0; i < iterations; i++) {
    var network = this

    for (var e = 0; e < examples.length; e++) {
      var example = examples[e]
      var inputs = example[0]
      var targets = example[1]
      
      var outputs = network.process(inputs)

      // Errors and prior weights of previous layer
      var errors = new Array(network.layers.length)
      var weights = new Array(network.layers.length)

      // Backpropagate the error to the output layer
      var l = network.layers.length - 1
      errors[l] = []
      weights[l] = []

      network.layers[l].neurons.forEach(function(neuron, j) {
        // var error = outputs[j] * (1 - outputs[j]) * targets[j] - outputs[j]
        var error = 0.5 * Math.pow(targets[j] - outputs[j], 2)
        console.log("Output layer error on neuron", j, error)
        errors[l].push(error)

        weights[l].push(sum(neuron.weights)) // Save up previous weights
        for (var k = 0; k < neuron.weights.length; k++) {
          var dS = outputs[j] * (1 - outputs[j]) // threshold function derivative
          neuron.weights[k] += learningRate * error * dS  * neuron.lastInputs[k]
        }
        neuron.bias += learningRate * error * dS
      })

      // Backpropagate to the other layers starting from the last
      for (var l = network.layers.length - 2; l >= 0; l--) {
        errors[l] = []
        weights[l] = []

        network.layers[l].neurons.forEach(function(neuron, j) {
          var sumErrorsWeights = 0
          for (var k = 0; k < errors[l+1].length; k++) {
            sumErrorsWeights += errors[l+1][k] * weights[l+1][k]
          }
          var error = neuron.lastOutput * (1 - neuron.lastOutput) * sumErrorsWeights // * Sum over k (errors[k] * weights[j][k])
          errors[l].push(error)

          weights[l].push(sum(neuron.weights)) // Save up previous weights
          for (var k = 0; k < neuron.weights.length; k++) {
            neuron.weights[k] += learningRate * error * neuron.lastInputs[k]
          }
          neuron.bias += learningRate * error
        }) // for neurons
      } // for network.layers

      // if (errors[network.layers.length - 1][0] <= errorThreshold) break

    } // for examples
  } // for iterations
}


var brain = new NeuralNetwork()

// Layers
// 1  2  3
// o
// o  o
// o  o
// o  o
// o  o  o
brain.addLayer(5, 2) // 1. 1st Hidden layer:  5 neurons, 2 inputs each (# inputs = # inputs to process)
brain.addLayer(4)    // 2. 2nd Hidden layer: 4 neurons
brain.addLayer(1)    // 3. Output layer: 1 neuron, outputting the result

brain.train([
  // Training examples
  // inputs   outputs
  [  [0, 0],  [0]  ],
  [  [0, 1],  [1]  ],
  [  [1, 0],  [1]  ],
  [  [1, 1],  [0]  ]
])

var output = brain.process([1, 0]) // => [1]
console.log(output)
