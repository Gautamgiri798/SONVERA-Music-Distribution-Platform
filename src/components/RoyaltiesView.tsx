import React, { useState } from 'react';
import {
  DollarSign,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  Building,
  CreditCard,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  MOCK_ROYALTY_LEDGER,
  MOCK_ROYALTY_STATEMENTS,
  MOCK_PAYOUT_HISTORY,
} from '../data/mockData';
import { PayoutRequest, RoyaltyLedgerEntry } from '../types';

export const RoyaltiesView: React.FC = () => {
  const [ledgerEntries] = useState<RoyaltyLedgerEntry[]>(MOCK_ROYALTY_LEDGER);
  const [statements] = useState(MOCK_ROYALTY_STATEMENTS);
  const [payouts, setPayouts] = useState<PayoutRequest[]>(MOCK_PAYOUT_HISTORY);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<string>('8259.30');
  const [payoutMethod, setPayoutMethod] = useState<'Stripe Direct' | 'Wire Transfer (SWIFT)' | 'Wise' | 'PayPal'>('Stripe Direct');
  const [payoutAccount, setPayoutAccount] = useState<string>('acct_1NZX****8892');
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);

  const availableBalance = 8259.30;
  const lifetimePaid = payouts
    .filter((p) => p.status === 'PROCESSED')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleExecutePayout = () => {
    const amt = parseFloat(payoutAmount);
    if (isNaN(amt) || amt <= 0 || amt > availableBalance) {
      alert('Please enter a valid payout amount within your available balance.');
      return;
    }

    setIsProcessingPayout(true);
    setTimeout(() => {
      const newPayout: PayoutRequest = {
        id: `payout-${Date.now().toString(36)}`,
        amount: amt,
        currency: 'USD',
        method: payoutMethod,
        requestedAt: new Date().toISOString(),
        status: 'PROCESSED',
        accountReference: payoutAccount,
      };
      setPayouts([newPayout, ...payouts]);
      setIsProcessingPayout(false);
      setShowPayoutModal(false);
      alert(`Payout of $${amt.toFixed(2)} USD successfully initiated to ${payoutMethod} (${payoutAccount}).`);
    }, 900);
  };

  const handleDownloadCsv = () => {
    const headers = 'ID,Release,Track,DSP,Territory,Streams,Gross,DistributorFee,NetArtistShare\n';
    const rows = ledgerEntries
      .map(
        (e) =>
          `"${e.id}","${e.releaseTitle}","${e.trackTitle}","${e.dsp}","${e.territory}",${e.streams},${e.grossAmount},${e.distributorFee},${e.netArtistShare}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SONVERA_Royalty_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header & Sandbox Notice */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="title-xl">Royalty Ledger & Accounting</h1>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                background: 'rgba(16, 185, 129, 0.12)',
                color: 'var(--emerald-400)',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(16, 185, 129, 0.25)',
              }}
            >
              FINANCIAL LEDGER
            </span>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Audited royalty calculations connected directly to release streaming data. 100% artist ownership.
          </p>
        </div>

        {/* Sandbox Financial Tag */}
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '10px',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <ShieldAlert size={16} color="var(--amber-500)" />
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--amber-500)', fontFamily: 'var(--font-mono)' }}>
              SANDBOX SIMULATION DATA
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Demonstrates actual royalty accounting architecture
            </div>
          </div>
        </div>
      </div>

      {/* Accounting Pipeline Visualization */}
      <div
        style={{
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-medium)',
          borderRadius: '12px',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)',
          overflowX: 'auto',
        }}
      >
        <span style={{ color: 'var(--emerald-400)' }}>1. DSP Delivery Data</span>
        <span>→</span>
        <span style={{ color: 'var(--cyan-400)' }}>2. Store Playback Feeds</span>
        <span>→</span>
        <span style={{ color: 'var(--violet-400)' }}>3. Rate Calculation Engine</span>
        <span>→</span>
        <span style={{ color: '#34d399' }}>4. Immutable Royalty Ledger</span>
        <span>→</span>
        <span style={{ color: 'var(--text-main)' }}>5. Monthly Statement</span>
        <span>→</span>
        <span style={{ color: 'var(--emerald-400)', fontWeight: 700 }}>6. Artist Payout</span>
      </div>

      {/* Top 3 Financial Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            AVAILABLE FOR PAYOUT
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--emerald-400)', marginTop: '4px' }}>
            ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: '16px' }}>
            Net master & mechanical balance • 100% Artist Keep
          </div>
          <button
            onClick={() => setShowPayoutModal(true)}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            <span>Request Payout</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            LIFETIME EARNINGS DISBURSED
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
            ${lifetimePaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--cyan-400)', marginTop: '4px' }}>
            Processed via automated bank transfer & Stripe
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            DISTRIBUTOR COMMISSION FEE
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--cyan-400)', marginTop: '4px' }}>
            0.0%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--emerald-400)', marginTop: '4px' }}>
            SONVÉRA Pro Plan: Artists retain 100% royalties
          </div>
        </div>
      </div>

      {/* Two Column: Detailed Ledger Entries & Audited Statements */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '24px' }}>
        {/* Left: Detailed Royalty Ledger */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 className="title-md">Recent Royalty Ledger Entries</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Audited stream events linked directly to release ISRCs
              </p>
            </div>
            <button onClick={handleDownloadCsv} className="btn btn-secondary btn-sm">
              <Download size={13} />
              <span>Export CSV</span>
            </button>
          </div>

          <table className="sonvera-table">
            <thead>
              <tr>
                <th>Release / Track</th>
                <th>DSP Store</th>
                <th>Territory</th>
                <th>Streams</th>
                <th style={{ textAlign: 'right' }}>Net Artist Share</th>
              </tr>
            </thead>
            <tbody>
              {ledgerEntries.map((e) => (
                <tr key={e.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{e.releaseTitle}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{e.trackTitle}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{e.dsp}</span>
                  </td>
                  <td className="font-mono">{e.territory}</td>
                  <td className="font-mono">{e.streams.toLocaleString()}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--emerald-400)' }}>
                    ${e.netArtistShare.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Statements List */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 className="title-md" style={{ marginBottom: '6px' }}>Audited Monthly Statements</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
            Formal accounting statements ready for download
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {statements.map((stmt) => (
              <div
                key={stmt.id}
                style={{
                  background: 'var(--bg-surface-1)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700 }}>{stmt.periodName}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Period: <span className="font-mono">{stmt.accountingPeriod}</span> • {stmt.totalStreams.toLocaleString()} streams
                    </div>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      background: stmt.status === 'AUDITED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                      color: stmt.status === 'AUDITED' ? '#34d399' : '#a5b4fc',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontWeight: 700,
                    }}
                  >
                    {stmt.status}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '14px',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <span className="font-mono" style={{ fontSize: '15px', fontWeight: 800, color: 'var(--emerald-400)' }}>
                    ${stmt.netEarnings.toFixed(2)} USD
                  </span>

                  <button
                    onClick={() => {
                      alert(`Generating statement PDF download for ${stmt.periodName}...`);
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    <Download size={13} />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payout Request Modal */}
      {showPayoutModal && (
        <div
          onClick={() => setShowPayoutModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 350,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-panel-elevated"
            style={{ width: '480px', padding: '28px', borderRadius: '16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <DollarSign size={22} color="var(--emerald-400)" />
              <h3 className="title-md">Request Royalty Payout</h3>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              Withdraw your accrued streaming earnings to your verified payout method.
            </p>

            <div className="form-group">
              <label className="form-label">
                <span>Amount to Withdraw (USD)</span>
                <span style={{ fontSize: '11px', color: 'var(--emerald-400)' }}>
                  Max: ${availableBalance.toFixed(2)}
                </span>
              </label>
              <input
                type="number"
                step="0.01"
                className="form-input font-mono"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payout Method</label>
              <select
                className="form-select"
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value as typeof payoutMethod)}
              >
                <option value="Stripe Direct">Stripe Direct Deposit (Fastest - 12h)</option>
                <option value="Wire Transfer (SWIFT)">Wire Transfer / SWIFT (1-2 business days)</option>
                <option value="Wise">Wise Multi-Currency Transfer</option>
                <option value="PayPal">PayPal Business</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Account Identifier / Routing</label>
              <input
                type="text"
                className="form-input font-mono"
                value={payoutAccount}
                onChange={(e) => setPayoutAccount(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowPayoutModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecutePayout}
                disabled={isProcessingPayout}
                className="btn btn-primary"
              >
                {isProcessingPayout ? 'Processing...' : 'Confirm Payout Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
