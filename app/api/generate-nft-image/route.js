/**
 * AI NFT Image Generator using Hugging Face
 * Generates Leonardo da Vinci style anatomical sketches
 */

import { NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const hf = new HfInference(process.env.HF_TOKEN)

// Predefined prompts for variety
const anatomicalSubjects = [
  'human arm muscles and tendons',
  'human leg bone structure',
  'human spine and vertebrae',
  'human rib cage and sternum',
  'human hand bones and joints',
  'human foot skeletal structure',
  'human skull and jaw',
  'human shoulder joint',
  'human hip bone structure',
  'human knee joint anatomy',
  'human heart anatomical study',
  'human brain cross section',
  'human eye anatomical detail',
  'human ear structure',
  'human teeth and jaw',
  'human pelvis structure',
  'human elbow joint',
  'human wrist bones',
  'human ankle structure',
  'human neck muscles'
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
