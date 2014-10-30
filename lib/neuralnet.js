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


function NeuralNetwork(layers) {
  this.layers = layers
}

NeuralNetwork.prototype.process = function(inputs) {
  var outputs = inputs
  this.layers.forEach(function(layer) {
    outputs = layer.process(outputs)
  })
  return outputs
}

NeuralNetwork.prototype.train = function(inputs, outputs) {
  // TODO
}


var brain = new NeuralNetwork([
  new NeuralLayer(5, 2), // Input layer:  5 neurons, 2 inputs each
  new NeuralLayer(4, 5), // Hidden layer: 4 neurons, 5 inputs each
  new NeuralLayer(1, 4)  // Output layer: 1 neuron,  2 inputs each
])

brain.train([0, 0], [0])
brain.train([0, 1], [1])
brain.train([1, 0], [1])
brain.train([1, 1], [0])

var output = brain.process([1, 0]) // => [0]
console.log(output)
