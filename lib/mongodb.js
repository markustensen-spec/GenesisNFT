This is a forked j...

Buy
right arrow

Hey Markus, Quick input needed :
Ask Question
Agent will continue working after your reply
🔴 Filen ble ikke riktig opprettet!
Det ser ut som noe gikk galt når du limte inn koden. Filen inneholder feil tekst ("This is a forked j...", "Buy", "right arrow").

Fix det nå:
1. Gå til filen på Github: https://github.com/markustensen-spec/GenesisNFT/blob/main/lib/mongodb.js

2. Klikk på ✏️ blyant-ikonet (Edit this file)

3. SLETT ALT innholdet

4. Lim inn NØYAKTIG denne koden:

import { MongoClient } from 'mongodb'

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