import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const formData = await request.formData()
    
    const name = formData.get('name')
    const email = formData.get('email')
    const phone = formData.get('phone')
    const occupation = formData.get('occupation')
    const reason = formData.get('reason')
    const referral = formData.get('referral')
    const file = formData.get('file')
    
    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      )
    }
    
    // Process file if uploaded
    let fileData = null
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        data: buffer.toString('base64')
      }
    }
    
    // Save to MongoDB
    const client = await clientPromise
    const db = client.db('genesishq')
    
    const application = {
      name,
      email,
      phone: phone || '',
      occupation: occupation || '',
      reason: reason || '',
      referral: referral || '',
      file: fileData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Check if email already applied
    const existing = await db.collection('noir97_applications').findOne({ email })
    if (existing) {
      return NextResponse.json({
        success: false,
        error: 'An application with this email already exists'
      }, { status: 400 })
    }
    
    await db.collection('noir97_applications').insertOne(application)
    
    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully! We will review and get back to you.'
    })
    
  } catch (error) {
    console.error('Noir97 application error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('genesishq')
    
    const applications = await db.collection('noir97_applications')
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray()
    
    return NextResponse.json({
      success: true,
      count: applications.length,
      applications: applications.map(app => ({
        ...app,
        file: app.file ? { name: app.file.name, type: app.file.type, size: app.file.size } : null
      }))
    })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}
