var math = require('./math')

function Neuron(numInputs) {
  this.weights = new Array(numInputs)
  this.bias = math.rand()

  for (var i = 0; i < this.weights.length; i++) {
    this.weights[i] = math.rand()
  }
}

Neuron.prototype.process = function(inputs) {
  var sum = 0
  for (var i = 0; i < inputs.length; i++) {
    sum += inputs[i] * this.weights[i]
  }
  sum += this.bias

  return math.sigmoid(sum)
}


function Layer(numNeurons, numInputs) {
  this.neurons = new Array(numNeurons)

  for (var i = 0; i < this.neurons.length; i++) {
    this.neurons[i] = new Neuron(numInputs)
  }
}

Layer.prototype.process = function(inputs) {
  return this.neurons.map(function(neuron) {
    return neuron.process(inputs)
  })
}


function Network() {
  this.layers = []
}
exports.Network = Network

Network.prototype.process = function(inputs) {
  var outputs
  this.layers.forEach(function(layer) {
    outputs = layer.process(inputs)
    inputs = outputs
  })
  return outputs
}

Network.prototype.addLayer = function(numNeurons, numInputs) {
  if (numInputs == null) {
    var previousLayer = this.layers[this.layers.length - 1]
    numInputs = previousLayer.neurons.length
  }

  var layer = new Layer(numNeurons, numInputs)
  this.layers.push(layer)
}
