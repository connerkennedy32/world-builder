'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const res = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        })

        if (!res.ok) {
            setError('No user found with that name.')
            setLoading(false)
            return
        }

        const { userId } = await res.json()
        localStorage.setItem('userId', String(userId))
        router.push('/')
    }

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '280px' }}>
                <h2 style={{ margin: 0 }}>Sign in</h2>
                <input
                    type="text"
                    placeholder="Your username"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    autoFocus
                    style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #ccc',
                        fontSize: '14px',
                    }}
                />
                {error && <p style={{ color: 'red', margin: 0, fontSize: '13px' }}>{error}</p>}
                <button
                    type="submit"
                    disabled={loading || !name}
                    style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#000',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '14px',
                    }}
                >
                    {loading ? 'Signing in...' : 'Continue'}
                </button>
            </form>
        </div>
    )
}
