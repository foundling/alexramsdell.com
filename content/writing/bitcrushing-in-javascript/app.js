// control elements
const startButton = document.querySelector('button[name="start"]')
const stopButton = document.querySelector('button[name="stop"]')
const infoButton = document.querySelector('button[name="info"]') 
const errorMessageContainer = document.querySelector('.error-box-text')
const downsampling = document.querySelector('input[name="downsampling"]')
const bits = document.querySelector('input[name="bits"]')
const volume  = document.querySelector('input[name="volume"]')
const fileSelector = document.querySelector('input[name="file-selector"]')
const oscSelectors = document.querySelectorAll('input[name="osc-selector"]')

const context = new AudioContext();
const parameterData = { bitDepth: 2, downsampling: 1 }

startButton.addEventListener('click', play)

async function showError(e) {
  debugger
  errorMessageContainer.innerHTML = `${e}`
}

async function getAudioBuffer(filename) {

  let response
  try {
    response = await fetch(filename)
  } catch(e) {
    showError(`${e}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const buffer = await context.decodeAudioData(arrayBuffer)

  return buffer

}

async function play() {

  let source
  try { 
    source = await init()
  } catch(e) {
    showError(e)
  }

  source.start()

  stopButton.addEventListener('click', function() {
    source.stop()
  })

}

async function init() {

  /*
   * load our bitcrusher processor module, create a control node, add to our audio graph
   * initialize control change events
   */

  // register processing module in a separate thread
  await context.audioWorklet.addModule('bitcrusher.js') 

  // instantiate a custom AudioWorklet control with our initial parameters 
  // note the parameterData object is a reference, allowing the internal params to change
  // as we adjust our parameterData according to changing control values.
  const bitcrusher = new AudioWorkletNode(context, 'bitcrusher', { parameterData })
  const downsamplingParam = bitcrusher.parameters.get('downsampling') // 
  const bitDepthParam = bitcrusher.parameters.get('bitDepth')
  
  // determine if source is an oscillator or a user-loaded sound sample
  let source

  if (fileSelector.files.length > 0) {
    source = context.createBufferSource()
    source.buffer = await getAudioBuffer(fileSelector.files[0].name)
  } else {
    source = new OscillatorNode(context)
    source.type = [...oscSelectors].filter(o => o.checked)[0].value
    source.frequency.value = 210;
  }

  // create an amplifier so we can control the gain via the volume slider.
  const amp = new GainNode(context)
  amp.gain.value = 0.2

  // bind control events to bitcrusher params 
  volume.addEventListener('input', ({ target }) => {
    amp.gain.value = target.value
  })

  downsampling.addEventListener('input', ({ target }) => {
    downsamplingParam.setValueAtTime(parseInt(target.value), 0) 
  })

  bits.addEventListener('input', ({ target }) => {
    bitDepthParam.setValueAtTime(parseInt(target.value), 0) 
  })

  infoButton.addEventListener('click', () => {
    console.log('downsampling: ', downsamplingParam.value)
    console.log('bitDepth: ', bitDepthParam.value)
  })

  // set up our audio graph
  source.connect(bitcrusher)
     .connect(amp)
     .connect(context.destination)

  return source

}
