const startButton = document.querySelector('button[name="start"]')
const stopButton = document.querySelector('button[name="stop"]')
const infoButton = document.querySelector('button[name="info"]') 
const downsampling = document.querySelector('input[name="downsampling"]')
const bits = document.querySelector('input[name="bits"]')
const volume  = document.querySelector('input[name="volume"]')
const parameterData = { bitDepth: 2, downsampling: 1 }
const fileSelector = document.querySelector('input[name="file-selector"]')
const filePlayer = document.querySelector('audio[name="player"]')

let osc
let source
let sourceBuffer

let context = new AudioContext();

fileSelector.addEventListener('change', e => {
  getData(e.target.files[0].name)

})

async function getData(filename) {

  source = context.createBufferSource();
  const request = new XMLHttpRequest();

  request.open('GET', filename || 'viper.mp3', true);
  request.responseType = 'arraybuffer';
  request.onload = async function() {

    const audioData = request.response;

    try {
      const buffer = await context.decodeAudioData(audioData)
      source.buffer = buffer;
    } catch(e) {
      throw e
    }

  }

  request.send();
}

startButton.addEventListener('click', play)
stopButton.addEventListener('click', stop)

async function play() {

  await context.audioWorklet.addModule('bitcrusher.js')

  if (!source) {

    source = new OscillatorNode(context)
    source.type = 'sine'
    source.frequency.value = 210;

  }

  const amp = new GainNode(context)
  amp.gain.value = 0.2
  const bitcrusher = new AudioWorkletNode(context, 'bitcrusher', {
    parameterData,
  })

  const downsamplingParam = bitcrusher.parameters.get('downsampling')
  const bitDepthParam = bitcrusher.parameters.get('bitDepth')

  volume.addEventListener('change', ({ target }) => {
    amp.gain.value = target.value
  })

  downsampling.addEventListener('change', ({ target }) => {
    downsamplingParam.setValueAtTime(parseInt(target.value), 0) 
  })

  bits.addEventListener('change', ({ target }) => {
    bitDepthParam.setValueAtTime(parseInt(target.value), 0) 
  })

  infoButton.addEventListener('click', () => {
    console.log('downsampling: ', downsamplingParam.value)
    console.log('bitDepth: ', bitDepthParam.value)
  })
  
  source.connect(bitcrusher)
     .connect(amp)
     .connect(context.destination)

  source.start()

}

function stop() {
  if (source) source.stop();
}
