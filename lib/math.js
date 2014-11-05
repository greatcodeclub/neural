exports.rand = function rand() {
  return Math.random() * 0.4 - 0.2 // Random weight between -0.2 and 0.2
}

// Mean squared error
exports.mse = function mse(errors) {
  var sum = errors.reduce(function(sum, i) { return sum + Math.pow(i, 2) }, 0)
  return sum / errors.length
}

exports.sum = function sum(array) {
  return array.reduce(function(sum, i) { return sum + i }, 0)
}

exports.sigmoid = function sigmoid(x) {
  return 1 / (1 + Math.pow(Math.E, -x))
}