import React from 'react'
import { motion } from 'framer-motion'
import { Settings, BarChart3, History, FileText, Plus } from 'lucide-react'
import './Header.css'

const Header = ({ activeTab, setActiveTab, currentTest }) => {
  const tabs = [
    { id: 'new-test', label: 'New Test', icon: Plus, disabled: false },
    { id: 'results', label: 'Results', icon: BarChart3, disabled: !currentTest },
    { id: 'history', label: 'History', icon: History, disabled: false },
    { id: 'report', label: 'Report', icon: FileText, disabled: !currentTest }
  ]

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-icon">
            <Settings size={24} />
          </div>
          <div className="logo-text">
            <h1>MOVIX 4.0</h1>
            <span>QUALITY CONTROL</span>
          </div>
        </div>

        <nav className="navigation">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                className={`nav-button ${activeTab === tab.id ? 'active' : ''} ${tab.disabled ? 'disabled' : ''}`}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    className="nav-indicator"
                    layoutId="nav-indicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

export default Header