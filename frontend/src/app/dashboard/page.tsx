'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  request, 
  getAuthToken, 
  getAuthUser, 
  removeAuthToken 
} from '../../utils/api';
import { 
  Wallet, 
  TrendingUp, 
  Percent, 
  Plus, 
  Edit2, 
  Trash2, 
  LogOut, 
  Bell, 
  X,
  AlertCircle,
  LayoutDashboard,
  Coins
} from 'lucide-react';

interface Investment {
  id: string;
  investmentName: string;
  investmentType: string;
  investedAmount: number;
  currentValue: number;
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
}

interface PortfolioSummary {
  totalInvested: number;
  currentValue: number;
  profit: number;
  profitPercentage: number;
}

interface Toast {
  type: 'success' | 'error';
  message: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user] = useState<{ name: string; email: string } | null>(() => getAuthUser());
  
  // States
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary>({
    totalInvested: 0,
    currentValue: 0,
    profit: 0,
    profitPercentage: 0,
  });
  
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'add' | 'edit'>('add');
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  
  // Form Fields
  const [investmentName, setInvestmentName] = useState('');
  const [investmentType, setInvestmentType] = useState('Stock');
  const [investedAmount, setInvestedAmount] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  
  // Feedback
  const [toast, setToast] = useState<Toast | null>(null);

  // Helper to trigger feedback
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch investments list
  const fetchInvestments = useCallback(async () => {
    const res = await request<Investment[]>('/investments');
    if (res.data) {
      setInvestments(res.data);
    }
  }, []);

  // Fetch portfolio summary metrics
  const fetchSummary = useCallback(async () => {
    const res = await request<PortfolioSummary>('/portfolio/summary');
    if (res.data) {
      setSummary(res.data);
    }
  }, []);

  // Sync data
  const refreshData = useCallback(async () => {
    await Promise.all([fetchInvestments(), fetchSummary()]);
  }, [fetchInvestments, fetchSummary]);
  // Auth verification
  useEffect(() => {
    const token = getAuthToken();
    const activeUser = getAuthUser();
    
    if (!token || !activeUser) {
      removeAuthToken();
      router.push('/login');
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      refreshData().finally(() => setIsPageLoading(false));
    }
  }, [refreshData, router]);

  // Logout Handler
  const handleLogout = () => {
    removeAuthToken();
    router.push('/login');
  };

  // Open Add Form Drawer
  const openAddDrawer = () => {
    setDrawerMode('add');
    setSelectedInvestment(null);
    setInvestmentName('');
    setInvestmentType('Stock');
    setInvestedAmount('');
    setCurrentValue('');
    setPurchaseDate(new Date().toISOString().split('T')[0]); // Default to today
    setFormError('');
    setIsDrawerOpen(true);
  };

  // Open Edit Form Drawer
  const openEditDrawer = (inv: Investment) => {
    setDrawerMode('edit');
    setSelectedInvestment(inv);
    setInvestmentName(inv.investmentName);
    setInvestmentType(inv.investmentType);
    setInvestedAmount(inv.investedAmount.toString());
    setCurrentValue(inv.currentValue.toString());
    
    // Format date string safely
    const formattedDate = new Date(inv.purchaseDate).toISOString().split('T')[0];
    setPurchaseDate(formattedDate);
    
    setFormError('');
    setIsDrawerOpen(true);
  };

  // Handle Form Submission (Add or Edit)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    const investedNum = parseFloat(investedAmount);
    const currentNum = parseFloat(currentValue);

    if (isNaN(investedNum) || investedNum < 0) {
      setFormError('Invested amount must be a positive number');
      setIsSubmitting(false);
      return;
    }

    if (isNaN(currentNum) || currentNum < 0) {
      setFormError('Current value must be a positive number');
      setIsSubmitting(false);
      return;
    }

    if (!purchaseDate) {
      setFormError('Purchase date is required');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      investmentName,
      investmentType,
      investedAmount: investedNum,
      currentValue: currentNum,
      purchaseDate,
    };

    let res;
    if (drawerMode === 'add') {
      res = await request('/investments', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } else {
      res = await request(`/investments/${selectedInvestment?.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    }

    setIsSubmitting(false);

    if (res.error) {
      setFormError(res.error);
    } else {
      showToast(
        'success',
        drawerMode === 'add' 
          ? 'Investment successfully created!' 
          : 'Investment successfully updated!'
      );
      setIsDrawerOpen(false);
      refreshData();
    }
  };

  // Handle Delete operation
  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete your investment in "${name}"?`)) {
      const res = await request(`/investments/${id}`, {
        method: 'DELETE',
      });

      if (res.error) {
        showToast('error', res.error);
      } else {
        showToast('success', 'Investment successfully removed');
        refreshData();
      }
    }
  };

  // Date Formatter (e.g. 01 Jun 2026)
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Currency Formatter
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(value);
  };

  if (isPageLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
      }}>
        <div style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>
          Loading your portfolio dashboard...
        </div>
      </div>
    );
  }

  // Get initials for profile avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="dashboard-container">
      {/* Toast notifications */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Sidebar Panel */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Coins size={20} />
          </div>
          <div>
            <div className="logo-text">FinVestia</div>
            <div className="logo-subtext">Portfolio Management</div>
          </div>
        </div>

        <nav className="sidebar-menu">
          <a className="menu-item active">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </a>
          <a className="menu-item" onClick={openAddDrawer}>
            <Plus size={18} />
            <span>Add Investment</span>
          </a>
          <a className="menu-item" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          {user && (
            <div className="profile-card">
              <div className="profile-avatar">
                {getInitials(user.name)}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div className="profile-name">{user.name}</div>
                <div className="profile-email" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {user.email}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="main-workspace">
        {/* Workspace Header */}
        <header className="workspace-header">
          <div style={{ visibility: 'hidden' }}>Search...</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', position: 'relative' }}>
              <Bell size={20} />
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                backgroundColor: '#ef4444',
                width: '6px',
                height: '6px',
                borderRadius: '50%'
              }}></span>
            </button>
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#475569' }}>
              Hi, <span style={{ fontWeight: 600, color: '#0f172a' }}>{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Workspace Content */}
        <div className="workspace-content">
          {/* Welcome heading */}
          <div style={{ marginBottom: '28px' }}>
            <h1 className="heading-display" style={{ fontSize: '28px', color: '#0f172a', marginBottom: '4px' }}>Dashboard</h1>
            <p style={{ fontSize: '14px', color: '#64748b' }}>Welcome back! Here&apos;s your portfolio summary.</p>
          </div>

          {/* Summary Metric Cards Grid */}
          <div className="summary-grid">
            {/* Total Invested */}
            <div className="summary-card">
              <div className="card-icon-container blue">
                <span className="font-outfit" style={{ fontSize: '20px', fontWeight: 'bold' }}>₹</span>
              </div>
              <div className="card-info">
                <span className="card-label">Total Invested</span>
                <span className="card-value">{formatCurrency(summary.totalInvested)}</span>
                <span className="card-subtext">All time invested</span>
              </div>
            </div>

            {/* Current Value */}
            <div className="summary-card">
              <div className="card-icon-container green">
                <TrendingUp size={20} />
              </div>
              <div className="card-info">
                <span className="card-label">Current Value</span>
                <span className="card-value">{formatCurrency(summary.currentValue)}</span>
                <span className="card-subtext">Current portfolio value</span>
              </div>
            </div>

            {/* Profit / Loss */}
            <div className="summary-card">
              <div className="card-icon-container orange" style={{
                backgroundColor: summary.profit >= 0 ? '#fffbeb' : '#fef2f2',
                color: summary.profit >= 0 ? '#f59e0b' : '#ef4444'
              }}>
                <Wallet size={20} />
              </div>
              <div className="card-info">
                <span className="card-label">Profit / Loss</span>
                <span className="card-value" style={{ color: summary.profit >= 0 ? '#10b981' : '#ef4444' }}>
                  {summary.profit >= 0 ? '+' : ''}{formatCurrency(summary.profit)}
                </span>
                <span className="card-subtext">Total profit</span>
              </div>
            </div>

            {/* Profit Percentage */}
            <div className="summary-card">
              <div className="card-icon-container purple" style={{
                backgroundColor: summary.profitPercentage >= 0 ? '#f53ff' : '#fef2f2',
                color: summary.profitPercentage >= 0 ? '#8b5cf6' : '#ef4444'
              }}>
                <Percent size={18} />
              </div>
              <div className="card-info">
                <span className="card-label">Profit Percentage</span>
                <span className="card-value" style={{ color: summary.profitPercentage >= 0 ? '#10b981' : '#ef4444' }}>
                  {summary.profitPercentage >= 0 ? '+' : ''}{summary.profitPercentage.toFixed(2)}%
                </span>
                <span className="card-subtext">Overall return</span>
              </div>
            </div>
          </div>

          {/* Investments Table Card */}
          <div className="data-card">
            <div className="card-title-bar">
              <h2 className="card-heading">My Investments</h2>
              <button className="btn-add-investment" onClick={openAddDrawer}>
                <Plus size={16} />
                <span>Add Investment</span>
              </button>
            </div>

            <div className="table-wrapper">
              {investments.length === 0 ? (
                <div style={{
                  padding: '48px 0',
                  textAlign: 'center',
                  color: '#64748b',
                  fontSize: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Coins size={36} style={{ color: '#cbd5e1' }} />
                  <div>
                    <div style={{ fontWeight: 600, color: '#475569', marginBottom: '4px' }}>No investments recorded</div>
                    <p style={{ fontSize: '13px' }}>Click the &quot;+ Add Investment&quot; button to log your first holding.</p>
                  </div>
                </div>
              ) : (
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Investment Name</th>
                      <th>Type</th>
                      <th>Invested Amount</th>
                      <th>Current Value</th>
                      <th>Purchase Date</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investments.map((inv) => {
                      const profit = inv.currentValue - inv.investedAmount;
                      const isProfit = profit >= 0;
                      return (
                        <tr key={inv.id}>
                          <td style={{ fontWeight: 600, color: '#0f172a' }}>{inv.investmentName}</td>
                          <td>
                            <span className={`badge-type badge-${inv.investmentType.toLowerCase().replace(/\s+/g, '-')}`}>{inv.investmentType}</span>
                          </td>
                          <td style={{ fontWeight: 500 }}>{formatCurrency(inv.investedAmount)}</td>
                          <td className={isProfit ? 'text-profit' : 'text-loss'}>
                            {formatCurrency(inv.currentValue)}
                          </td>
                          <td style={{ color: '#475569' }}>{formatDate(inv.purchaseDate)}</td>
                          <td>
                            <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                              <button 
                                className="btn-icon edit" 
                                title="Edit"
                                onClick={() => openEditDrawer(inv)}
                              >
                                <Edit2 size={14} />
                              </button>
                              <button 
                                className="btn-icon delete" 
                                title="Delete"
                                onClick={() => handleDelete(inv.id, inv.investmentName)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
            {investments.length > 0 && (
              <div style={{
                marginTop: '16px',
                fontSize: '12px',
                color: '#64748b',
                fontWeight: 500
              }}>
                Showing {investments.length} of {investments.length} results
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Slide-over Form Panel Drawer */}
      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3 className="drawer-title">
                {drawerMode === 'add' ? 'Add Investment' : 'Edit Investment'}
              </h3>
              <button className="btn-close-drawer" onClick={() => setIsDrawerOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="drawer-body">
              {formError && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fca5a5',
                  color: '#ef4444',
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  marginBottom: '20px'
                }}>
                  <AlertCircle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              <form id="investment-form" onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="inv-name">Investment Name</label>
                  <input
                    className="form-input"
                    type="text"
                    id="inv-name"
                    placeholder="e.g. HDFC Flexi Cap Fund"
                    required
                    value={investmentName}
                    onChange={(e) => setInvestmentName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="inv-type">Investment Type</label>
                  <select
                    className="form-input"
                    id="inv-type"
                    style={{ appearance: 'auto', paddingRight: '24px' }}
                    required
                    value={investmentType}
                    onChange={(e) => setInvestmentType(e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="Stock">Stock</option>
                    <option value="Mutual Fund">Mutual Fund</option>
                    <option value="Crypto">Crypto</option>
                    <option value="Fixed Deposit">Fixed Deposit</option>
                    <option value="Bond">Bond</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="inv-amount">Invested Amount (INR)</label>
                  <input
                    className="form-input"
                    type="number"
                    step="0.01"
                    id="inv-amount"
                    placeholder="e.g. 10000"
                    required
                    value={investedAmount}
                    onChange={(e) => setInvestedAmount(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="inv-value">Current Value (INR)</label>
                  <input
                    className="form-input"
                    type="number"
                    step="0.01"
                    id="inv-value"
                    placeholder="e.g. 12500"
                    required
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="inv-date">Purchase Date</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="form-input"
                      type="date"
                      id="inv-date"
                      style={{ width: '100%' }}
                      required
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="drawer-footer">
              <button 
                className="btn-secondary" 
                onClick={() => setIsDrawerOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                className="btn-submit" 
                type="submit" 
                form="investment-form"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? 'Saving...' 
                  : drawerMode === 'add' 
                    ? 'Add Investment' 
                    : 'Save Changes'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
