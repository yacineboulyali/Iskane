var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;} // ---- Classes ---- 
var Mesh = function (_THREE$Object3D) {_inherits(Mesh, _THREE$Object3D);
  function Mesh(options) {_classCallCheck(this, Mesh);var _this = _possibleConstructorReturn(this, (Mesh.__proto__ || Object.getPrototypeOf(Mesh)).call(this));


    _this.radius = options.radius;
    _this.resolution = options.resolution;
    _this.tetaOffset = options.tetaOffset;
    _this.color = options.color;
    _this.waveNumber = options.waveNumber;
    _this.waveType = options.waveType;
    _this.waveLength = options.waveLength;
    _this.waveHeight = 0.1 * _this.radius;
    _this.lineWidth = 3;

    _this.count = 0;
    _this.speed = 0.05;

    _this.geom = new THREE.Geometry();
    _this.mat = new THREE.LineBasicMaterial({
      color: _this.color,
      linewidth: _this.lineWidth });


    _this.mesh = new THREE.Line(_this.geom, _this.mat);

    _this.update();

    _this.add(_this.mesh);return _this;
  }_createClass(Mesh, [{ key: 'update', value: function update(

    audioData) {
      this.count += this.speed;
      this.scale.set(audioData * 2, audioData * 2, audioData * 2);

      var newVertices = [];

      for (var i = 0; i <= this.resolution; i++) {
        var teta = Math.PI / 180 * (i + this.tetaOffset);
        var smoothingAmount = 0.14;
        var smoothPercent = 1;
        var deltaRadius = 0;

        if (i < this.waveLength * this.resolution || i == this.resolution) {
          var smoothing_amount = 0.14;
          var _smoothPercent = 1;

          if (i < this.waveLength * this.resolution * smoothing_amount)
          _smoothPercent = i / (this.waveLength * this.resolution * smoothing_amount);else
          if (i > this.waveLength * this.resolution * (1 - smoothing_amount) && i <= this.waveLength * this.resolution)
          _smoothPercent = (this.waveLength * this.resolution - i) / (this.waveLength * this.resolution * smoothing_amount);else
          if (i == this.resolution)
          _smoothPercent = 0;

          if (this.waveType == 'bass')
          deltaRadius = this.waveHeight * _smoothPercent * Math.sin((teta + this.count) * this.waveNumber) * audioData * 5;else
          if (this.waveType == 'medium')
          deltaRadius = this.waveHeight * _smoothPercent * Math.cos((teta + this.count) * this.waveNumber) * audioData * 5;else
          if (this.waveType == 'treble')
          deltaRadius = this.waveHeight * _smoothPercent * Math.cos((teta + Math.PI / 180 * 45 + this.count) * this.waveNumber) * audioData * 5;
        }

        var x = (this.radius + deltaRadius) * Math.cos(teta + this.count);
        var y = (this.radius + deltaRadius) * Math.sin(teta + this.count);
        var z = 0;

        newVertices.push(new THREE.Vector3(x, y, z));
      }

      this.mesh.geometry.vertices = newVertices;
      this.mesh.geometry.verticesNeedUpdate = true;
      this.mesh.geometry.dynamic = true;
    } }]);return Mesh;}(THREE.Object3D);var


AudioW = function () {
  function AudioW(sepValue) {_classCallCheck(this, AudioW);
    var self = this;

    this.audio = new Audio();
    this.audio.crossOrigin = "anonymous";
    this.audio.src = 'http://lab.hengpatrick.fr/2016/three-js-circle-sin-audio/tdcc.mp3';
    this.audio.crossOrigin = "anonymous";
    this.audio.controls = false;
    this.audio.loop = true;
    this.audio.autoplay = true;

    this.ctx = new AudioContext();
    this.audioSrc = this.ctx.createMediaElementSource(this.audio);
    this.analyser = this.ctx.createAnalyser();
    this.audioData = [];
    this.sepValue = sepValue;

    // Connect the MediaElementSource with the analyser
    this.audioSrc.connect(this.analyser);
    this.audioSrc.connect(this.ctx.destination);

    // FrequencyBinCount tells how many values are receive from the analyser
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

    this.audio.play();
  }_createClass(AudioW, [{ key: 'getFrequencyData', value: function getFrequencyData()

    {
      this.analyser.getByteFrequencyData(this.frequencyData);
      return this.frequencyData;
    } }, { key: 'getAudioData', value: function getAudioData()

    {
      this.analyser.getByteFrequencyData(this.frequencyData);

      // Split array into 3
      var frequencyArray = this.splitFrenquencyArray(this.frequencyData,
      this.sepValue);

      // Make average of frenquency array entries
      for (var i = 0; i < frequencyArray.length; i++) {
        var average = 0;

        for (var j = 0; j < frequencyArray[i].length; j++) {
          average += frequencyArray[i][j];
        }
        this.audioData[i] = average / frequencyArray[i].length / 255;
      }
      return this.audioData;
    } }, { key: 'splitFrenquencyArray', value: function splitFrenquencyArray(

    arr, n) {
      var tab = Object.keys(arr).map(function (key) {
        return arr[key];
      });
      var len = tab.length,
      result = [],
      i = 0;

      while (i < len) {
        var size = Math.ceil((len - i) / n--);
        result.push(tab.slice(i, i + size));
        i += size;
      }

      return result;
    } }]);return AudioW;}();
;var

Webgl = function () {
  function Webgl(width, height, audio) {_classCallCheck(this, Webgl);
    this.audio = audio;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
    this.camera.position.set(0, 0, 20);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true });

    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x151515);

    this.waves = [];

    this.waves[0] = new Mesh({
      radius: 5,
      resolution: 360,
      color: 0xff418f,
      waveNumber: 10,
      tetaOffset: 0,
      waveLength: 1,
      waveType: 'bass' });


    this.waves[1] = new Mesh({
      radius: 5,
      resolution: 160,
      color: 0x51d4d4,
      waveNumber: 100,
      tetaOffset: 120,
      waveLength: 1,
      waveType: 'medium' });


    this.waves[2] = new Mesh({
      radius: 5,
      resolution: 360,
      color: 0x8e44ad,
      waveNumber: 50,
      tetaOffset: 245,
      waveLength: 1,
      waveType: 'treble' });


    for (var i = 0; i < this.waves.length; i++) {
      this.waves[i].position.set(0, 0, 0);
      this.scene.add(this.waves[i]);
    }
  }_createClass(Webgl, [{ key: 'resize', value: function resize(

    width, height) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
    } }, { key: 'render', value: function render()

    {
      this.renderer.autoClear = false;
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
      var audioData = this.audio.getAudioData();

      for (var i = 0; i < this.waves.length; i++) {
        this.waves[i].update(audioData[i]);
      }
    } }]);return Webgl;}();


// ---- Main ---- 
var webgl = void 0;
var audio = void 0;
var gui = void 0;
var stats = void 0;

audio = new AudioW(3);
webgl = new Webgl(window.innerWidth, window.innerHeight,
audio);

document.body.appendChild(webgl.renderer.domElement);

// GUI settings
gui = new dat.GUI();

gui.add(webgl.camera.position, 'z').min(0).max(30).step(0.1).name('Camera Zoom');

var radiusFolder = gui.addFolder('Radius');
var waveFolder = gui.addFolder('Waves Number');
var colorFolder = gui.addFolder('Colors');

radiusFolder.add(webgl.waves[0], 'radius').min(0).max(10).step(0.1).name('Bass radius');
radiusFolder.add(webgl.waves[1], 'radius').min(0).max(10).step(0.1).name('Medium radius');
radiusFolder.add(webgl.waves[2], 'radius').min(0).max(10).step(0.1).name('Treble radius');

waveFolder.add(webgl.waves[0], 'waveNumber').min(0).max(200).step(1).name('Bass waves');
waveFolder.add(webgl.waves[1], 'waveNumber').min(0).max(200).step(1).name('Medium waves');
waveFolder.add(webgl.waves[2], 'waveNumber').min(0).max(200).step(1).name('Treble waves');

colorFolder.addColor(webgl.waves[0], 'color').onChange(function () {
  webgl.waves[0].mat.color.setHex(dec2hex(webgl.waves[0].color));
}).name('Bass color');
colorFolder.addColor(webgl.waves[1], 'color').onChange(function () {
  webgl.waves[1].mat.color.setHex(dec2hex(webgl.waves[1].color));
}).name('Medium color');
colorFolder.addColor(webgl.waves[2], 'color').onChange(function () {
  webgl.waves[2].mat.color.setHex(dec2hex(webgl.waves[2].color));
}).name('Treble color');

//Stats js
stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms

stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild(stats.domElement);

window.onresize = resizeHandler;

animate();


function resizeHandler() {
  webgl.resize(window.innerWidth, window.innerHeight);
}

function animate() {
  stats.begin();
  requestAnimationFrame(animate);
  webgl.render();
  stats.end();
}

// Dec2Hex for setting colors
function dec2hex(i) {
  var result = "0x000000";
  if (i >= 0 && i <= 15) {
    result = "0x00000" + i.toString(16);
  } else if (i >= 16 && i <= 255) {
    result = "0x0000" + i.toString(16);
  } else if (i >= 256 && i <= 4095) {
    result = "0x000" + i.toString(16);
  } else if (i >= 4096 && i <= 65535) {
    result = "0x00" + i.toString(16);
  } else if (i >= 65535 && i <= 1048575) {
    result = "0x0" + i.toString(16);
  } else if (i >= 1048575) {
    result = '0x' + i.toString(16);
  }
  if (result.length == 8) {
    return result;
  }
}