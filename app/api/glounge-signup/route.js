import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request) {
  try {
    const { email, username, emailOptIn } = await request.json()
    
    if (!email || !username) {
      return NextResponse.json(
        { error: 'Email and username are required' },
        { status: 400 }
      )
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db('genesishq')
    const collection = db.collection('glounge_members')
    
    // Check if email or username already exists
    const existingUser = await collection.findOne({
      $or: [{ email }, { username }]
    })
    
    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 }
        )
      }
      if (existingUser.username === username) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 400 }
        )
      }
    }
    
    // Create new member
    const newMember = {
      email,
      username,
      emailOptIn: emailOptIn || false,
      createdAt: new Date(),
      source: 'glounge_signup'
    }
    
    await collection.insertOne(newMember)
    
    return NextResponse.json({
      success: true,
      message: 'Welcome to G Lounge!'
    })
    
  } catch (error) {
    console.error('G Lounge signup error:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
