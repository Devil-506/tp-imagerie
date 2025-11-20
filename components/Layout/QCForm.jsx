import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import { TEST_TYPES } from '../../utils/calculations'
import './QCForm.css'

const QCForm = ({ onSubmit, devices }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    deviceId: devices[0]?.id || '',
    testType: 'daily',
    settings: {
      kV: 70,
      mA: 100,
      exposureTime: 100,
      distance: 100,
      filter: 'Al',
      mode: 'Standard'
    },
    results: {
      dose: 0.85,
      imageQuality: 8.5,
      uniformity: 0.95,
      noise: 0.05,
      resolution: 3.2,
      contrast: 0.90,
      notes: ''
    }
  })

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const steps = [
    { number: 1, title: 'Setup', icon: '⚙️' },
    { number: 2, title: 'Measurements', icon: '📊' },
    { number: 3, title: 'Review', icon: '👁️' }
  ]

  return (
    <div className="qc-form-container">
      <div className="form-header">
        <h1>New Quality Control Test</h1>
        <div className="step-indicator">
          {steps.map(step => (
            <div
              key={step.number}
              className={`step ${step.number === currentStep ? 'active' : ''} ${step.number < currentStep ? 'completed' : ''}`}
            >
              <div className="step-number">
                {step.number < currentStep ? <CheckCircle size={16} /> : step.number}
              </div>
              <span>{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="qc-form">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="form-step"
            >
              <h2>Test Configuration</h2>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Device</label>
                  <select
                    value={formData.deviceId}
                    onChange={(e) => updateFormData('deviceId', '', e.target.value)}
                    required
                  >
                    {devices.map(device => (
                      <option key={device.id} value={device.id}>
                        {device.name} ({device.serialNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Test Type</label>
                  <select
                    value={formData.testType}
                    onChange={(e) => updateFormData('testType', '', e.target.value)}
                    required
                  >
                    {Object.entries(TEST_TYPES).map(([key, type]) => (
                      <option key={key} value={key}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Kilovoltage (kV)</label>
                  <input
                    type="number"
                    value={formData.settings.kV}
                    onChange={(e) => updateFormData('settings', 'kV', parseInt(e.target.value))}
                    min="40"
                    max="120"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Milliamperage (mA)</label>
                  <input
                    type="number"
                    value={formData.settings.mA}
                    onChange={(e) => updateFormData('settings', 'mA', parseInt(e.target.value))}
                    min="10"
                    max="500"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Exposure Time (ms)</label>
                  <input
                    type="number"
                    value={formData.settings.exposureTime}
                    onChange={(e) => updateFormData('settings', 'exposureTime', parseInt(e.target.value))}
                    min="10"
                    max="1000"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Distance (cm)</label>
                  <input
                    type="number"
                    value={formData.settings.distance}
                    onChange={(e) => updateFormData('settings', 'distance', parseInt(e.target.value))}
                    min="50"
                    max="200"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Filter Type</label>
                  <select
                    value={formData.settings.filter}
                    onChange={(e) => updateFormData('settings', 'filter', e.target.value)}
                  >
                    <option value="Al">Aluminum (Al)</option>
                    <option value="Cu">Copper (Cu)</option>
                    <option value="Al+Cu">Al + Cu</option>
                    <option value="None">No Filter</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Operation Mode</label>
                  <select
                    value={formData.settings.mode}
                    onChange={(e) => updateFormData('settings', 'mode', e.target.value)}
                  >
                    <option value="Standard">Standard</option>
                    <option value="HighRes">High Resolution</option>
                    <option value="LowDose">Low Dose</option>
                    <option value="Pediatric">Pediatric</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="form-step"
            >
              <h2>Measurement Results</h2>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Radiation Dose (mGy)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.results.dose}
                    onChange={(e) => updateFormData('results', 'dose', parseFloat(e.target.value))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Image Quality Score</label>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={formData.results.imageQuality}
                      onChange={(e) => updateFormData('results', 'imageQuality', parseFloat(e.target.value))}
                      className="quality-slider"
                    />
                    <span className="slider-value">{formData.results.imageQuality.toFixed(1)}</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Uniformity</label>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={formData.results.uniformity}
                      onChange={(e) => updateFormData('results', 'uniformity', parseFloat(e.target.value))}
                      className="quality-slider"
                    />
                    <span className="slider-value">{(formData.results.uniformity * 100).toFixed(1)}%</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Noise Level</label>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="0"
                      max="0.2"
                      step="0.001"
                      value={formData.results.noise}
                      onChange={(e) => updateFormData('results', 'noise', parseFloat(e.target.value))}
                      className="quality-slider"
                    />
                    <span className="slider-value">{(formData.results.noise * 100).toFixed(1)}%</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Spatial Resolution (lp/mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.results.resolution}
                    onChange={(e) => updateFormData('results', 'resolution', parseFloat(e.target.value))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Contrast Ratio</label>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={formData.results.contrast}
                      onChange={(e) => updateFormData('results', 'contrast', parseFloat(e.target.value))}
                      className="quality-slider"
                    />
                    <span className="slider-value">{(formData.results.contrast * 100).toFixed(1)}%</span>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Additional Notes</label>
                  <textarea
                    value={formData.results.notes}
                    onChange={(e) => updateFormData('results', 'notes', e.target.value)}
                    rows="3"
                    placeholder="Any observations, issues, or comments..."
                  />
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="form-step"
            >
              <h2>Test Review</h2>
              
              <div className="review-sections">
                <div className="review-section">
                  <h3>Test Information</h3>
                  <div className="review-grid">
                    <div className="review-item">
                      <span>Device:</span>
                      <strong>
                        {devices.find(d => d.id === formData.deviceId)?.name || 'N/A'}
                      </strong>
                    </div>
                    <div className="review-item">
                      <span>Test Type:</span>
                      <strong>{TEST_TYPES[formData.testType]?.name}</strong>
                    </div>
                  </div>
                </div>

                <div className="review-section">
                  <h3>Device Settings</h3>
                  <div className="review-grid">
                    {Object.entries(formData.settings).map(([key, value]) => (
                      <div key={key} className="review-item">
                        <span>{key}:</span>
                        <strong>{value}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="review-section">
                  <h3>Measurement Results</h3>
                  <div className="review-grid">
                    {Object.entries(formData.results).map(([key, value]) => (
                      <div key={key} className="review-item">
                        <span>{key}:</span>
                        <strong>
                          {typeof value === 'number' 
                            ? (key === 'imageQuality' ? value.toFixed(1) :
                               key === 'dose' ? value.toFixed(3) + ' mGy' :
                               key === 'resolution' ? value.toFixed(1) + ' lp/mm' :
                               key === 'notes' ? value :
                               (value * 100).toFixed(1) + '%')
                            : value || 'N/A'
                          }
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="form-actions">
          {currentStep > 1 && (
            <button type="button" onClick={prevStep} className="btn btn-secondary">
              <ChevronLeft size={16} />
              Back
            </button>
          )}
          
          <div className="right-actions">
            {currentStep < 3 ? (
              <button type="button" onClick={nextStep} className="btn btn-primary">
                Next
                <ChevronRight size={16} />
              </button>
            ) : (
              <button type="submit" className="btn btn-success">
                <CheckCircle size={16} />
                Submit Test
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default QCForm