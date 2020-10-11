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
const parameterData = {
  bitDepth: 2,
  downsampling: 1
}

async function init() {
  await context.audioWorklet.addModule('bitcrusher.js') 

  const bitcrusher = new AudioWorkletNode(context, 'bitcrusher', { parameterData })
  const downsamplingParam = bitcrusher.parameters.get('downsampling') // 
  const bitDepthParam = bitcrusher.parameters.get('bitDepth')
  
  let source
  const selectedFilename = fileSelector.files.length ? fileSelector.files[0].name : undefined

  if (selectedFilename) {
    try {
      const  response = await fetch(selectedFilename)
      const arrayBuffer = await response.arrayBuffer()
      const buffer = await context.decodeAudioData(arrayBuffer)
      source = context.createBufferSource()
      source.buffer = buffer
    } catch(e) {
      throw e
    }
  } else {
    source = new OscillatorNode(context)
    source.type = [...oscSelectors].filter(o => o.checked)[0].value
    source.frequency.value = 210;
  }

  const amp = new GainNode(context)
  amp.gain.value = volume.value

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


  stopButton.addEventListener('click', function() {
    source.stop()
  })

  source.start()

}

startButton.addEventListener('click', init)
