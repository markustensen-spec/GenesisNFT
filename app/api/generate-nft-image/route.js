/**
 * AI NFT Image Generator using Hugging Face
 * Generates Leonardo da Vinci style anatomical sketches
 */

import { NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const hf = new HfInference(process.env.HF_TOKEN)

// Leonardo's subjects: anatomical studies + inventions
const leonardoSubjects = [
  // Anatomical Studies
  { subject: 'human arm muscles and tendons', type: 'anatomy', italian: 'muscoli del braccio' },
  { subject: 'human leg bone structure', type: 'anatomy', italian: 'ossa della gamba' },
  { subject: 'human spine and vertebrae', type: 'anatomy', italian: 'colonna vertebrale' },
  { subject: 'human heart anatomical study', type: 'anatomy', italian: 'cuore umano' },
  { subject: 'human brain cross section', type: 'anatomy', italian: 'cervello' },
  { subject: 'human skull and jaw', type: 'anatomy', italian: 'cranio' },
  { subject: 'human hand bones and joints', type: 'anatomy', italian: 'ossa della mano' },
  { subject: 'human eye anatomical detail', type: 'anatomy', italian: 'occhio' },
  
  // Leonardo's Famous Inventions
  { subject: 'flying machine with wings', type: 'invention', italian: 'macchina volante' },
  { subject: 'ornithopter aerial screw helicopter', type: 'invention', italian: 'elicottero' },
  { subject: 'armored war tank with cannons', type: 'invention', italian: 'carro armato' },
  { subject: 'crossbow giant ballista weapon', type: 'invention', italian: 'balestra gigante' },
  { subject: 'parachute pyramid design', type: 'invention', italian: 'paracadute' },
  { subject: 'diving suit underwater apparatus', type: 'invention', italian: 'scafandro' },
  { subject: 'mechanical lion automaton', type: 'invention', italian: 'leone meccanico' },
  { subject: 'bridge self-supporting design', type: 'invention', italian: 'ponte' },
  { subject: 'war chariot with rotating blades', type: 'invention', italian: 'carro da guerra' },
  { subject: 'trebuchet catapult machine', type: 'invention', italian: 'catapulta' },
  { subject: 'water lifting archimedes screw', type: 'invention', italian: 'vite d\'acqua' },
  { subject: 'mechanical clock gears', type: 'invention', italian: 'orologio meccanico' },
  { subject: 'ball bearing mechanism', type: 'invention', italian: 'cuscinetto a sfere' },
  { subject: 'double hull ship design', type: 'invention', italian: 'nave a doppio scafo' },
  { subject: 'musical instruments viola organista', type: 'invention', italian: 'viola organista' }
]

export async function POST(request) {
  try {
    const { index } = await request.json()
    
    // Select subject based on index or random
    const subjectIndex = index ? index % anatomicalSubjects.length : Math.floor(Math.random() * anatomicalSubjects.length)
    const subject = anatomicalSubjects[subjectIndex]
    
    // Enhanced Leonardo da Vinci style prompt
    const prompt = `Leonardo da Vinci anatomical sketch of ${subject}, detailed Renaissance drawing, sepia tones, brown ink on aged parchment, anatomical precision, fine pen strokes, medical illustration, classical proportions, detailed scientific observation, 15th century style, museum quality`
    
    console.log('Generating image with prompt:', prompt)
    
    // Generate image using Hugging Face
    const imageBlob = await hf.textToImage({
      model: 'black-forest-labs/FLUX.1-schnell',
      inputs: prompt,
      parameters: {
        width: 768,
        height: 768,
      }
    })
    
    // Convert to base64
    const buffer = Buffer.from(await imageBlob.arrayBuffer())
    const base64 = buffer.toString('base64')
    const dataUrl = `data:image/jpeg;base64,${base64}`
    
    return NextResponse.json({
      success: true,
      imageUrl: dataUrl,
      subject,
      prompt
    })
    
  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to generate image'
    }, { status: 500 })
  }
}

// GET endpoint to test
export async function GET() {
  return NextResponse.json({
    message: 'AI NFT Image Generator',
    usage: 'POST with optional { "index": 0-19 } to generate specific anatomical study',
    subjects: anatomicalSubjects.length
  })
}
