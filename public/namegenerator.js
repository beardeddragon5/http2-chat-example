

var starts = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'r', 'p', 's', 't', 'u'];
var speakable = {
  a: ['b', 'd', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'u'],
  b: ['a', 'e', 'i', 'l', 'o', 'r', 'u'],
  c: ['h'],
  d: ['a', 'e', 'i', 'l', 'o', 'r', 'u'],
  e: ['f', 'i', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'u'],
  f: ['a', 'e', 'i', 'l', 'o', 'r', 'u'],
  g: ['a', 'e', 'i', 'l', 'o', 'u'],
  h: ['a', 'e', 'i', 'o', 'u'],
  i: ['b', 'f', 'k', 'l', 'm', 'n', 'p', 'r', 'h', 's', 't'],
  j: ['a', 'e', 'i', 'o', 'u'],
  k: ['a', 'e', 'i', 'l', 'o', 'u'],
  l: ['a', 'e', 'i', 'o', 'u'],
  m: ['a', 'e', 'i', 'j', 'o', 'u'],
  n: ['a', 'e', 'i', 'o', 'u'],
  o: ['b', 'c', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't'],
  p: ['a', 'e', 'i', 'l', 'o', 'r', 'u'],
  r: ['a', 'i', 'e', 'o', 'u'],
  s: ['a', 'e', 'c', 'i', 'o', 'u', 't'],
  t: ['a', 'e', 'i', 'o', 'u'],
  u: ['b', 'g', 'i', 'k', 'n', 'm', 'p', 'r', 's', 't']
};

var minLength = 5;
var maxLength = 8;

function generateName(minlength, maxlength) {
  var length = minlength + Math.random() * (maxlength - minlength);
  var lastChar = starts[parseInt(Math.random() * starts.length, 10)];

  var projectName = lastChar.toUpperCase();
  for (var i = 0; i < length; i++) {
     var nextChars = speakable[lastChar];
     lastChar = nextChars[parseInt(Math.random() * nextChars.length, 10)];
     projectName += lastChar;
  }
  return projectName;
}
