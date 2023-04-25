var myCapture, myVida; 
//p5js can use many formats but mp3 is better

var EN_M1_mandolin1, EN_M1_mldy2, EN_M1_mldyB4, EN_M2_mldy3, EN_M2_mldyB1,
    EN_M2_mldyB5, EN_M2_stinger1, EN_M2_stinger7, EN_M3_mldy1, EN_M3_stinger3,
    HOLO_B1, LEIS_MUSIC_pipe2, LEOF_SAAV_mldy3;

function preload() { //preload is called before sutup to make sure smth is done before the program starts
  console.log('[preload] loading samples...');
  EN_M1_mandolin1  = loadSound('mp3/EN_M1_mandolin1.mp3');
  EN_M1_mldy2      = loadSound('mp3/EN_M1_mldy2.mp3');
  EN_M1_mldyB4     = loadSound('mp3/EN_M1_mldyB4.mp3');
  EN_M2_mldy3      = loadSound('mp3/EN_M2_mldy3.mp3');
  EN_M2_mldyB1     = loadSound('mp3/EN_M2_mldyB1.mp3');
  EN_M2_mldyB5     = loadSound('mp3/EN_M2_mldyB5.mp3');
  EN_M2_stinger1   = loadSound('mp3/EN_M2_stinger1.mp3');
  EN_M2_stinger7   = loadSound('mp3/EN_M2_stinger7.mp3');
  EN_M3_mldy1      = loadSound('mp3/EN_M3_mldy1.mp3');
  EN_M3_stinger3   = loadSound('mp3/EN_M3_stinger3.mp3');
  HOLO_B1          = loadSound('mp3/HOLO_B1.mp3');
  LEIS_MUSIC_pipe2 = loadSound('mp3/LEIS_MUSIC_pipe2.mp3');
  LEOF_SAAV_mldy3  = loadSound('mp3/LEOF_SAAV_mldy3.mp3');
  console.log('[preload] samples loaded');
}

function initCaptureDevice() { 
  try {
    myCapture = createCapture(VIDEO);
    myCapture.size(320, 240);
    myCapture.elt.setAttribute('playsinline', ''); //setAttribute to produce smth for mobile device and get accecc to it camera
    myCapture.hide();
    console.log(
      '[initCaptureDevice] capture ready. Resolution: ' +
      myCapture.width + ' ' + myCapture.height
    );
  } catch(_err) {
    console.log('[initCaptureDevice] capture error: ' + _err);
  }
}

function setup() {
  createCanvas(640, 480);
  initCaptureDevice();
  myVida = new Vida(); 
  myVida.progressiveBackgroundFlag = true;
  myVida.imageFilterFeedback = 0.92; //informs the system how stong is the feedback
  myVida.imageFilterThreshold = 0.15; //if it is high - we need strong changes to be called movement, if it is low, even small changes will be perceived  as a movement
  myVida.mirror = myVida.MIRROR_HORIZONTAL; // MIRROR_NONE, MIRROR_VERTICAL, MIRROR_HORIZONTAL, MIRROR_BOTH, 
  myVida.handleActiveZonesFlag = true; // to set active zones
  myVida.setActiveZonesNormFillThreshold(0.02); //sensitivity telling is how much s part of zones should be filled with moving pixels to be treated as triggered

  var padding = 0.07; var n = 5;
  var zoneWidth = 0.1; var zoneHeight = 0.5;
  var hOffset = (1.0 - (n * zoneWidth + (n - 1) * padding)) / 2.0;
  var vOffset = 0.25;
  for(var i = 0; i < n; i++) {
    myVida.addActiveZone( //used to add active zone
      i,
      hOffset + i * (zoneWidth + padding), vOffset, zoneWidth, zoneHeight,
      zoneChanged
    );
  }
  frameRate(30);
}

function draw() { 
  if(myCapture === null) {background(0, 0, 255); return;}
  if(myCapture === undefined) {background(0, 0, 255); return;}
  myVida.update(myCapture);
  image(myVida.currentImage, 0, 0, width, height);
  //image(myVida.backgroundImage, 0, 0, width, height);
  //image(myVida.differenceImage, 0, 0, width, height);
  //image(myVida.thresholdImage, 0, 0, width, height);
  myVida.drawActiveZones(0, 0, width, height);
}

function zoneChanged(_v) { //called every time when status of a zone was changed
  //sampleTrigger(_v);
  //sampleSwitcher(_v);
  //controlRate(_v); //changer the speed of the loop dependong on which trigger was triggered (1 slowest - 4fastest)
  //controlAmplitude(_v);
  playByNumberOfActiveZones(_v);//couning numbers of triggered zones, 0 - swithivhg off all the samples, if 1 - play 1st, if2 - second etc
}

function playSample(_sample) { // to start palying mp3 file, instead of _sample we need to out the name of the file like var
  if(_sample === null) {console.log('[playSample] _sample === null'); return;}
  if(_sample === undefined) {console.log('[playSample] _sample === undefined'); return;}
  if(!_sample.isPlaying()) _sample.play();
}

function stopSample(_sample) {
  if(_sample === null) {console.log('[stopSample] _sample === null'); return;}
  if(_sample === undefined) {console.log('[stopSample] _sample === undefined'); return;}
  if(_sample.isPlaying()) _sample.stop();
}

function sampleTrigger(_v) { //called in zoneChanged function
  switch(_v.id) {
    case 0: if(_v.isMovementDetectedFlag) playSample(EN_M1_mandolin1); break;// _v replace with the name of the zone
    case 1: if(_v.isMovementDetectedFlag) playSample(EN_M1_mldy2);     break;
    case 2: if(_v.isMovementDetectedFlag) playSample(EN_M1_mldyB4);    break;
    case 3: if(_v.isMovementDetectedFlag) playSample(EN_M2_mldy3);     break;
    case 4: if(_v.isMovementDetectedFlag) playSample(EN_M2_mldyB1);    break;
    default: console.log('[sampleTrigger] unhandled _v.id: ' + _v.id);// will be executed if the id of the zone is not connected to any case we define here
  }
}

function sampleSwitcher(_v) {
  switch(_v.id) {
    case 0: if(_v.isMovementDetectedFlag) playSample(EN_M1_mandolin1); else stopSample(EN_M1_mandolin1); break;
    case 1: if(_v.isMovementDetectedFlag) playSample(EN_M1_mldy2);     else stopSample(EN_M1_mldy2);     break;
    case 2: if(_v.isMovementDetectedFlag) playSample(EN_M1_mldyB4);    else stopSample(EN_M1_mldyB4);    break;
    case 3: if(_v.isMovementDetectedFlag) playSample(EN_M2_mldy3);     else stopSample(EN_M2_mldy3);     break;
    case 4: if(_v.isMovementDetectedFlag) playSample(EN_M2_mldyB1);    else stopSample(EN_M2_mldyB1);    break;
    default: console.log('[sampleSwitcher] unhandled _v.id: ' + _v.id);
  }
}

function controlRate(_v) {
  if(!HOLO_B1.isPlaying()) HOLO_B1.loop();
  switch(_v.id) {
    case 0: if(_v.isMovementDetectedFlag) HOLO_B1.rate(0.50); break;
    case 1: if(_v.isMovementDetectedFlag) HOLO_B1.rate(0.75); break;
    case 2: if(_v.isMovementDetectedFlag) HOLO_B1.rate(1.00); break;
    case 3: if(_v.isMovementDetectedFlag) HOLO_B1.rate(1.25); break;
    case 4: if(_v.isMovementDetectedFlag) HOLO_B1.rate(1.50); break;
    default: console.log('[controlRate] unhandled _v.id: ' + _v.id);
  }
}

function controlAmplitude(_v) {
  if(!HOLO_B1.isPlaying()) HOLO_B1.loop();
  switch(_v.id) {
    case 0: if(_v.isMovementDetectedFlag) HOLO_B1.amp(0.2); break;
    case 1: if(_v.isMovementDetectedFlag) HOLO_B1.amp(0.4); break;
    case 2: if(_v.isMovementDetectedFlag) HOLO_B1.amp(1.6); break;
    case 3: if(_v.isMovementDetectedFlag) HOLO_B1.amp(0.8); break;
    case 4: if(_v.isMovementDetectedFlag) HOLO_B1.amp(1.0); break;
    default: console.log('[controlAmplitude] unhandled _v.id: ' + _v.id);
  }
}

function playByNumberOfActiveZones(_v) {
  var n = countTriggeredZones();
  switch(n) {
    case 0:
      stopSample(EN_M1_mldy2);
      stopSample(EN_M1_mldyB4);
      stopSample(EN_M2_mldy3);
      stopSample(EN_M2_mldyB1);
      stopSample(EN_M1_mandolin1);
    break;
    case 1:
      stopSample(EN_M1_mldy2);
      stopSample(EN_M1_mldyB4);
      stopSample(EN_M2_mldy3);
      stopSample(EN_M2_mldyB1);
      playSample(EN_M1_mandolin1);
    break;
    case 2:
      stopSample(EN_M1_mandolin1);
      stopSample(EN_M1_mldyB4);
      stopSample(EN_M2_mldy3);
      stopSample(EN_M2_mldyB1);
      playSample(EN_M1_mldy2);
    break;
    case 3:
      stopSample(EN_M1_mandolin1);
      stopSample(EN_M1_mldy2);
      stopSample(EN_M2_mldy3);
      stopSample(EN_M2_mldyB1);
      playSample(EN_M1_mldyB4);
    break;
    case 4:
      stopSample(EN_M1_mandolin1);
      stopSample(EN_M1_mldy2);
      stopSample(EN_M1_mldyB4);
      stopSample(EN_M2_mldyB1);
      playSample(EN_M2_mldy3);
    break;
    case 5:
      stopSample(EN_M1_mandolin1);
      stopSample(EN_M1_mldy2);
      stopSample(EN_M1_mldyB4);
      stopSample(EN_M2_mldy3);
      playSample(EN_M2_mldyB1);
    break;
    default: console.log('[playByNumberOfActiveZones] n: ' + n);
  }
}

function countTriggeredZones() {
  var result = 0;
  for(var i = 0; i < myVida.activeZones.length; i++) {
    if(myVida.activeZones[i].isMovementDetectedFlag) result += 1;
  }
  return result;
}