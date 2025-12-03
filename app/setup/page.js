'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Check, X, Loader2 } from 'lucide-react'

export default function SetupPage() {
  const [status, setStatus] = useState([])
  const [loading, setLoading] = useState(false)
  const [complete, setComplete] = useState(false)

  const addStatus = (message, success = true) => {
    setStatus(prev => [...prev, { message, success, timestamp: new Date().toLocaleTimeString() }])
  }

  const runSetup = async () => {
    setLoading(true)
    setStatus([])
    
    try {
      addStatus('🚀 Starter Supabase setup...')
      
      // Call setup API
      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const data = await response.json()
      
      if (data.success) {
        addStatus('✓ Database tabeller opprettet')
        addStatus('✓ RLS policies konfigurert')
        addStatus('✓ Triggers satt opp')
        addStatus('✓ Profiles tabell klar')
        addStatus('✓ Whitelist tabell klar')
        setComplete(true)
      } else {
        addStatus('❌ Feil: ' + data.error, false)
      }
    } catch (error) {
      addStatus('❌ Setup feilet: ' + error.message, false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-900 border-amber-900/30">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <img 
              src="https://raw.githubusercontent.com/markustensen-spec/Logo/refs/heads/main/1000004278.jpg.png" 
              alt="GenesisHQ Logo" 
              className="w-20 h-20 object-contain"
            />
          </div>
          <CardTitle className="text-amber-100 text-3xl text-center">GenesisHQ Supabase Setup</CardTitle>
          <CardDescription className="text-amber-100/60 text-center">
            Automatisk oppsett av database og email-verifisering
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!complete && !loading && (
            <div className="space-y-4">
              <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4 mb-6">
                <h3 className="text-amber-100 font-bold mb-2">Hva gjøres:</h3>
                <ul className="text-amber-100/70 text-sm space-y-1">
                  <li>✓ Oppretter database tabeller (profiles, whitelist)</li>
                  <li>✓ Setter opp Row Level Security (RLS)</li>
                  <li>✓ Konfigurerer automatiske triggers</li>
                  <li>✓ Klargjør email-verifisering</li>
                </ul>
              </div>
              
              <Button 
                onClick={runSetup}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600"
                size="lg"
              >
                Start Automatisk Setup
              </Button>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
              <span className="ml-3 text-amber-100">Setter opp Supabase...</span>
            </div>
          )}

          {status.length > 0 && (
            <div className="mt-6 space-y-2 max-h-96 overflow-y-auto">
              {status.map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-start space-x-2 p-3 rounded-lg ${
                    item.success ? 'bg-emerald-900/20 border border-emerald-600/30' : 'bg-red-900/20 border border-red-600/30'
                  }`}
                >
                  {item.success ? (
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={item.success ? 'text-emerald-100' : 'text-red-100'}>{item.message}</p>
                    <p className="text-xs text-gray-400">{item.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {complete && (
            <div className="mt-6 space-y-4">
              <div className="bg-emerald-900/20 border-2 border-emerald-600/50 rounded-lg p-6 text-center">
                <h3 className="text-2xl font-bold text-emerald-300 mb-2">🎉 Setup Fullført!</h3>
                <p className="text-emerald-100/80 mb-4">
                  Supabase er nå fullstendig konfigurert og klar til bruk.
                </p>
              </div>

              <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4">
                <h4 className="text-amber-100 font-bold mb-2">Neste steg:</h4>
                <ul className="text-amber-100/70 text-sm space-y-2">
                  <li>1. Gå til Supabase Dashboard → Authentication → Email Templates</li>
                  <li>2. Rediger "Confirm signup" template med logoen din</li>
                  <li>3. Test registrering på GenesisHQ.io</li>
                </ul>
              </div>

              <Button 
                onClick={() => window.location.href = '/'}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600"
              >
                Gå til GenesisHQ
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
