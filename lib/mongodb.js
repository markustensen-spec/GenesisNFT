This is a forked j...

Buy
right arrow

Hey Markus, Quick input needed :
Ask Question
Agent will continue working after your reply
Filen er opprettet! Nå må vi pushe dette til Github.

Prøv "Save to Github" knappen igjen, og hvis det fortsatt ikke fungerer, så må vi gjøre det manuelt.

Alternativ: Manuell opplasting til Github
Hvis "Save to Github" ikke virker, gjør følgende:

1. Gå til Github
Åpne: https://github.com/markustensen-spec/GenesisNFT/tree/main/lib

2. Klikk "Add file" → "Create new file"
3. Fil-navn:
mongodb.js
4. Lim inn denne koden:
import { MongoClient } from 'mongodb'

if (!process.env.MONGO_URL) {
  console.warn('Warning: MONGO_URL not found in environment variables')
}

const uri = process.env.MONGO_URL || 'mongodb://localhost:27017'
const options = {}

let client
let clientPromise

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise