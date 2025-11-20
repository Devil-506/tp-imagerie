import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QCForm from './components/QCForm/QCForm'
import ResultsDashboard from './components/ResultsDashboard/ResultsDashboard'
import HistoryPanel from './components/HistoryPanel/HistoryPanel'
import ReportGenerator from './components/ReportGenerator/ReportGenerator'
import Header from './components/Layout/Header'
import { useLocalStorage } from './hooks/useLocalStorage'
import { AppProvider } from './contexts/AppContext'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('new-test')
  const [currentTest, setCurrentTest] = useState(null)
  const [tests, setTests] = useLocalStorage('movix-qc-tests', [])
  const [devices, setDevices] = useLocalStorage('movix-qc-devices', [
    {
      id: 'device-1',
      name: 'MOVIX 4.0 - Room 1',
      serialNumber: 'MOVX4001',
      facility: 'Main Hospital',
      installationDate: '2023-01-15'
    },
    {
      id: 'device-2', 
      name: 'MOVIX 4.0 - ER',
      serialNumber: 'MOVX4002',
      facility: 'Emergency Department',
      installationDate: '2023-03-20'
    }
  ])

  const handleTestSubmit = (testData) => {
    const newTest = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...testData,
      status: calculateTestStatus(testData)
    }
    
    setCurrentTest(newTest)
    setTests(prev => [newTest, ...prev])
    setActiveTab('results')
  }

  const calculateTestStatus = (testData) => {
    const { REFERENCE_RANGES, calculateExpectedDose } = require('./utils/calculations')
    const results = testData.results
    const settings = testData.settings
    
    const expectedDose = calculateExpectedDose(settings)
    const doseTolerance = REFERENCE_RANGES.dose.tolerance
    
    const checks = {
      dose: Math.abs(results.dose - expectedDose) / expectedDose <= doseTolerance,
      imageQuality: results.imageQuality >= REFERENCE_RANGES.imageQuality.min,
      uniformity: results.uniformity >= REFERENCE_RANGES.uniformity.min,
      noise: results.noise <= REFERENCE_RANGES.noise.max,
      resolution: results.resolution >= REFERENCE_RANGES.resolution.min,
      contrast: results.contrast >= REFERENCE_RANGES.contrast.min
    }

    const overall = Object.values(checks).every(check => check) ? 'PASS' : 'FAIL'

    return {
      overall,
      details: checks,
      expectedDose: parseFloat(expectedDose)
    }
  }

  const appContext = {
    tests,
    devices,
    currentTest,
    setCurrentTest,
    setTests,
    setDevices
  }

  return (
    <AppProvider value={appContext}>
      <div className="app">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} currentTest={currentTest} />
        
        <main className="app-main">
          <AnimatePresence mode="wait">
            {activeTab === 'new-test' && (
              <motion.div
                key="new-test"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <QCForm onSubmit={handleTestSubmit} devices={devices} />
              </motion.div>
            )}
            
            {activeTab === 'results' && currentTest && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ResultsDashboard 
                  test={currentTest} 
                  onBack={() => setActiveTab('new-test')}
                  onViewHistory={() => setActiveTab('history')}
                />
              </motion.div>
            )}
            
            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <HistoryPanel 
                  onSelectTest={(test) => {
                    setCurrentTest(test)
                    setActiveTab('results')
                  }}
                />
              </motion.div>
            )}
            
            {activeTab === 'report' && currentTest && (
              <motion.div
                key="report"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ReportGenerator test={currentTest} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </AppProvider>
  )
}

export default App