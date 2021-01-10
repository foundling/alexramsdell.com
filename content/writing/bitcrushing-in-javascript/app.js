const startButton = document.querySelector('button[name="start"]')
const stopButton = document.querySelector('button[name="stop"]')
const infoButton = document.querySelector('button[name="info"]') 
const downsampling = document.querySelector('input[name="downsampling"]')
const downsamplingValue = document.querySelector('.downsampling-value')
const bits = document.querySelector('input[name="bits"]')
const bitsValue = document.querySelector('.bits-value')
const volume  = document.querySelector('input[name="volume"]')
const volumeValue = document.querySelector('.volume-value')
const sourceInputs = document.querySelectorAll('input[name="source-selector"]')
const sourceSelector = document.querySelector('.source-selector')

const parameterData = {
  bitDepth: 2,
  downsampling: 1
}

startButton.addEventListener('click', init)

bitsValue.innerText = bits.value
volumeValue.innerText = volume.value
downsamplingValue.innerText = downsampling.value

volume.addEventListener('input', ({ target }) => {
  volumeValue.innerText = target.value
})

bits.addEventListener('input', ({ target }) => {
  bitsValue.innerText = target.value
})

downsampling.addEventListener('input', ({ target }) => {
  downsamplingValue.innerText = target.value
})


async function init() {

  const AudioContext = window.webkitAudioContext || window.AudioContext
  const context = new AudioContext()

  let source
  const sourceType = [...sourceInputs].filter(input => input.checked)[0].value

  if (sourceType === 'audio') {
    const url = '/static/audio/bitcrusher-24bits-1x-downsampling.mp3'
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = await context.decodeAudioData(arrayBuffer)
    source = context.createBufferSource()
    source.buffer = audioBuffer
  } else {
    source = context.createOscillator()
    source.frequency.value = 440
    source.type = sourceType
  }

  await context.audioWorklet.addModule('bitcrusher.js') 
  const bitCrusherNode = new AudioWorkletNode(context, 'bitcrusher', { parameterData })
  const bitDepthParam = bitCrusherNode.parameters.get('bitDepth')
  const downsamplingParam = bitCrusherNode.parameters.get('downsampling')

  const gainNode = context.createGain()
  gainNode.gain.value = volume.value

  volume.addEventListener('input', ({ target }) => {
    gainNode.gain.value = parseFloat(target.value)
  })

  downsampling.addEventListener('input', ({ target }) => {
    downsamplingParam.value = parseInt(target.value)
  })

  bits.addEventListener('input', ({ target }) => {
    bitDepthParam.value = parseInt(target.value)
  })

  stopButton.addEventListener('click', () => {
    source.stop()
  })

  source.connect(bitCrusherNode)
  bitCrusherNode.connect(gainNode)
  gainNode.connect(context.destination)

  source.start()

}

startButton.addEventListener('click', init)
