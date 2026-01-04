import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }
    
    // Save to MongoDB
    const client = await clientPromise
    const db = client.db('genesishq')
    
    // Check if email already exists
    const existing = await db.collection('hub_subscribers').findOne({ email })
    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed!',
        alreadySubscribed: true
      })
    }
    
    // Insert new subscriber
    await db.collection('hub_subscribers').insertOne({
      email,
      source: 'hub_popup',
      subscribedAt: new Date(),
      status: 'active'
    })
    
    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to HUB updates!'
    })
    
  } catch (error) {
    console.error('HUB signup error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('genesishq')
    
    const subscribers = await db.collection('hub_subscribers')
      .find({})
      .sort({ subscribedAt: -1 })
      .limit(100)
      .toArray()
    
    return NextResponse.json({
      success: true,
      count: subscribers.length,
      subscribers
    })
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscribers' },
      { status: 500 }
    )
  }
}
