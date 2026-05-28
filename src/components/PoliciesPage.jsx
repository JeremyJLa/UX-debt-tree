import { useState } from 'react'

const POLICIES = [
  { id: 1,  title: 'HOUSING\nFOR ALL' },
  { id: 2,  title: 'FIX THE\nHEALTH CRISIS' },
  { id: 3,  title: 'CLIMATE\nCHANGE AND\nENVIRONMENT' },
  { id: 4,  title: 'FIX THE\nHEALTH CRISIS' },
  { id: 5,  title: 'CLIMATE\nCHANGE AND\nENVIRONMENT' },
  { id: 6,  title: 'HOUSING\nFOR ALL' },
  { id: 7,  title: 'HOUSING\nFOR ALL' },
  { id: 8,  title: 'FIX THE\nHEALTH CRISIS' },
  { id: 9,  title: 'CLIMATE\nCHANGE AND\nENVIRONMENT' },
  { id: 10, title: 'FIX THE\nHEALTH CRISIS' },
  { id: 11, title: 'CLIMATE\nCHANGE AND\nENVIRONMENT' },
  { id: 12, title: 'HOUSING\nFOR ALL' },
  { id: 13, title: 'HOUSING\nFOR ALL' },
  { id: 14, title: 'FIX THE\nHEALTH CRISIS' },
  { id: 15, title: 'CLIMATE\nCHANGE AND\nENVIRONMENT' },
  { id: 16, title: 'FIX THE\nHEALTH CRISIS' },
  { id: 17, title: 'CLIMATE\nCHANGE AND\nENVIRONMENT' },
  { id: 18, title: 'HOUSING\nFOR ALL' },
  { id: 19, title: 'HOUSING\nFOR ALL' },
  { id: 20, title: 'FIX THE\nHEALTH CRISIS' },
  { id: 21, title: 'CLIMATE\nCHANGE AND\nENVIRONMENT' },
]

const PLATFORM_PARAS = [
  "The billionaires have had it too good for too long. CEO salaries are up more than 40 percent in a year while living standards for everyone else are getting smashed. Decade after decade, under both major parties, the rich have gotten richer while everyone else struggles. And the politicians run Victoria like it's their own private cash machine.",
  "We have to change things. We've got to put politicians on a worker's wage so they live like the rest of us. And we've got to get socialists into parliament who will fight to make workers richer and billionaires poorer, not the other way around.",
  "Under the business-as-usual politics of Liberal and Labor, Melbourne has become a segregated city — working-class areas are starved of resources while the wealthy suburbs get the best of everything.",
  "The property market has become a casino for speculators interested only in profits, while homes are priced out of reach of an entire generation.",
  "Our gas and electricity infrastructure and services have been sold in the name of \"efficiency\". Now we're paying for it as the energy barons squeeze us for every cent.",
  "Our natural resources — from the minerals beneath the ground, to the arable land, to the forests, to the water in our rivers — have been handed to the highest bidder.",
  "The climate emergency gets worse every year as mass extinction events and irreversible losses of biodiversity put our future in jeopardy.",
  "Our public schools are the most underfunded in the country and our public health system is in permanent crisis.",
  "Under business-as-usual politics, it's divide and conquer. Whether it's the relentless attacks on trans people, the racist panics about \"boat people\" or \"African gangs\" or the attacks on Aboriginal sovereignty—all of it is there to divide us and to distract us from the great robbery going on right in front of our eyes.",
]

export default function PoliciesPage({ onBack }) {
  const [activeTab, setActiveTab] = useState('platform')

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* ── Header ── */}
      <header style={{
        background: '#111',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        padding: '0 40px',
        flexShrink: 0,
        gap: 24,
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.55)',
            cursor: 'pointer', fontSize: 13,
            fontFamily: "'Inter', sans-serif",
            padding: 0, letterSpacing: '0.04em',
          }}
        >
          ← Audit tool
        </button>
        <nav style={{ display: 'flex', gap: 28 }}>
          {['About', 'Policies', 'Get involved', 'Donate'].map(item => (
            <span key={item} style={{
              color: item === 'Policies' ? '#fff' : 'rgba(255,255,255,0.45)',
              fontSize: 13,
              fontWeight: item === 'Policies' ? 700 : 400,
              letterSpacing: '0.04em',
              cursor: 'pointer',
            }}>
              {item}
            </span>
          ))}
        </nav>
      </header>

      {/* ── Page title band — angled clip ── */}
      <div style={{
        background: '#e5e0ec',
        clipPath: 'polygon(0 0, 100% 0, 100% 55%, 0 100%)',
        padding: '40px 120px 72px',
        marginBottom: -32,
      }}>
        <h1 style={{
          margin: 0,
          fontSize: 34,
          fontWeight: 900,
          letterSpacing: '-0.3px',
          color: '#000',
        }}>
          Policies
        </h1>
      </div>

      {/* ── Tabs ── */}
      <div style={{
        padding: '0 120px',
        display: 'flex',
        gap: 28,
        borderBottom: '1px solid #ddd',
        background: '#fff',
        position: 'relative',
        zIndex: 1,
      }}>
        {[
          { id: 'platform', label: 'OUR POLICY PLATFORM' },
          { id: 'policies', label: 'OUR POLICIES' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              padding: '14px 0',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.11em',
              cursor: 'pointer',
              color: '#000',
              borderBottom: activeTab === tab.id ? '2px solid #000' : '2px solid transparent',
              marginBottom: -1,
              fontFamily: "'Inter', sans-serif",
              transition: 'border-color 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <main style={{ flex: 1, padding: '48px 120px 80px', background: '#fff' }}>

        {activeTab === 'platform' ? (
          <div style={{ maxWidth: 560 }}>
            {PLATFORM_PARAS.map((para, i) => (
              <p key={i} style={{
                fontSize: 14,
                lineHeight: 1.75,
                color: '#111',
                margin: '0 0 18px',
              }}>
                {para}
              </p>
            ))}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 14,
          }}>
            {POLICIES.map(policy => (
              <div
                key={policy.id}
                style={{
                  background: '#ede8f3',
                  borderRadius: 3,
                  padding: '20px 18px 36px',
                  cursor: 'pointer',
                  minHeight: 130,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#e0d9eb'}
                onMouseLeave={e => e.currentTarget.style.background = '#ede8f3'}
              >
                <h2 style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 900,
                  lineHeight: 1.2,
                  color: '#000',
                  whiteSpace: 'pre-line',
                  fontFamily: "'Inter', sans-serif",
                }}>
                  {policy.title}
                </h2>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* ── Footer ── */}
      <footer style={{
        background: '#000',
        height: 120,
        flexShrink: 0,
      }} />
    </div>
  )
}
