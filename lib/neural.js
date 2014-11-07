var math = require('./math')

function Neuron(numInputs) {
  this.weights = new Array(numInputs)
  this.bias = math.rand()

  for (var i = 0; i < this.weights.length; i++) {
    this.weights[i] = math.rand()
  }
}

Neuron.prototype.process = function(inputs) {
  this.lastIntputs = inputs

  var sum = 0
  for (var i = 0; i < inputs.length; i++) {
    sum += inputs[i] * this.weights[i]
  }
  sum += this.bias

  return this.lastOutput = math.sigmoid(sum)
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

// Stop training when mean squared error of all output neurons reach this threshold
Network.prototype.errorThreshold = 0.00001

// Number of iterations on each training
Network.prototype.trainingIterations = 500000

// Rate at which the network learns in each iteration
Network.prototype.learningRate = 0.3

Network.prototype.train = function(examples) {
  var outputLayer = this.layers[this.layers.length - 1]

  for (var it = 0; it < this.trainingIterations; it++) {
    
    for (var e = 0; e < examples.length; e++) {
      var inputs = examples[e][0]
      var targets = examples[e][1]

      var outputs = this.process(inputs)

      for (var i = 0; i < outputLayer.neurons.length; i++) {
        var neuron = outputLayer.neurons[i]

        neuron.error = targets[i] - outputs[i]
        neuron.delta = neuron.lastOutput * (1 - neuron.lastOutput) * neuron.error
      }

      for (var l = this.layers.length - 2; l >= 0; l--) {
        for (var j = 0; j < this.layers[l].neurons.length; j++) {
          var neuron = this.layers[l].neurons[j]

          neuron.error = math.sum(this.layers[l + 1].neurons.
                                  map(function(n) { return n.weights[j] * n.delta }))
          neuron.delta = neuron.lastOutput * (1 - neuron.lastOutput) * neuron.error

          for (var i = 0; i < this.layers[l + 1].neurons.length; i++) {
            var neuron = this.layers[l + 1].neurons[i]

            for (var w = 0; w < neuron.weights.length; w++) {
              neuron.weights[w] += this.learningRate * neuron.lastIntputs[w] * neuron.delta
            }
            neuron.bias += this.learningRate * neuron.delta
          }
        }
      }
    }

    var error = math.mse(outputLayer.neurons.
                         map(function(n) { return n.error }))

    if (it % 10000 === 0) {
      console.log({ iteration: it, mse: error })
    }

    if (error <= this.errorThreshold) {
      return
    }
    
  }

}

