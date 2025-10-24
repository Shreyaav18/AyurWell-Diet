import React, { useState, useEffect } from 'react';
import { assessmentService } from '../../services/assessmentService';

interface QuizComponentProps {
  patientId: string;
  onClose: () => void;
  onComplete: (assessment: any) => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ patientId, onClose, onComplete }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await assessmentService.getAllQuestions();
        setQuestions(data);
        // Initialize userAnswers array with empty values
        setUserAnswers(new Array(data.length).fill(null));
        setLoading(false);
      } catch (err: any) {
        setError('Failed to load questions');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Load previous answer when navigating back
  useEffect(() => {
    if (userAnswers[currentQuestionIndex]) {
      setSelectedOption(userAnswers[currentQuestionIndex].selectedOption);
    } else {
      setSelectedOption('');
    }
  }, [currentQuestionIndex, userAnswers]);

  const handleOptionSelect = (doshaType: string) => {
    setSelectedOption(doshaType);
  };

  const handleNext = () => {
    if (!selectedOption) {
      alert('Please select an option');
      return;
    }

    // Save answer
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = {
      questionId: questions[currentQuestionIndex]._id,
      selectedOption: selectedOption
    };
    setUserAnswers(newAnswers);

    // Move to next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedOption) {
      alert('Please select an option');
      return;
    }

    // Save last answer
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = {
      questionId: questions[currentQuestionIndex]._id,
      selectedOption: selectedOption
    };

    setSubmitting(true);
    try {
      const assessmentData = {
        patientId: patientId,
        responses: newAnswers
      };

      const result = await assessmentService.submitAssessment(assessmentData);
      onComplete(result);
    } catch (err: any) {
      setError('Failed to submit assessment');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={styles.overlay}>
      <div style={styles.modal}>
        <p>Loading questions...</p>
      </div>
    </div>;
  }

  if (error) {
    return <div style={styles.overlay}>
      <div style={styles.modal}>
        <p style={styles.error}>{error}</p>
        <button onClick={onClose} style={styles.closeButton}>Close</button>
      </div>
    </div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>Prakriti Assessment</h3>
          <button onClick={onClose} style={styles.closeButton}>✕</button>
        </div>

        {/* Progress Bar */}
        <div style={styles.progressContainer}>
          <div style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width: `${progress}%`}}></div>
          </div>
        </div>

        {/* Question */}
        <div style={styles.questionSection}>
          <p style={styles.category}>{currentQuestion.category.toUpperCase()}</p>
          <h4 style={styles.questionText}>{currentQuestion.questionText}</h4>

          {/* Options */}
          <div style={styles.optionsContainer}>
            {currentQuestion.options.map((option: any, index: number) => (
              <label 
                key={index} 
                style={{
                  ...styles.optionLabel,
                  backgroundColor: selectedOption === option.doshaType ? '#e3f2fd' : '#fff',
                  borderColor: selectedOption === option.doshaType ? '#2196F3' : '#ddd'
                }}
              >
                <input
                  type="radio"
                  name="option"
                  value={option.doshaType}
                  checked={selectedOption === option.doshaType}
                  onChange={() => handleOptionSelect(option.doshaType)}
                  style={styles.radioInput}
                />
                <span>{option.optionText}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div style={styles.buttonContainer}>
          <button 
            onClick={handlePrevious} 
            disabled={currentQuestionIndex === 0}
            style={{
              ...styles.navButton,
              ...styles.previousButton,
              opacity: currentQuestionIndex === 0 ? 0.5 : 1,
              cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>

          {currentQuestionIndex < questions.length - 1 ? (
            <button 
              onClick={handleNext} 
              style={{...styles.navButton, ...styles.nextButton}}
            >
              Next
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              disabled={submitting}
              style={{
                ...styles.navButton, 
                ...styles.submitButton,
                opacity: submitting ? 0.6 : 1
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Assessment'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '30px',
    width: '90%',
    maxWidth: '700px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    color: '#333',
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
  },
  progressContainer: {
    marginBottom: '30px',
  },
  progressText: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    transition: 'width 0.3s ease',
  },
  questionSection: {
    marginBottom: '30px',
  },
  category: {
    fontSize: '12px',
    color: '#999',
    fontWeight: 'bold' as const,
    marginBottom: '10px',
  },
  questionText: {
    fontSize: '20px',
    color: '#333',
    marginBottom: '20px',
    lineHeight: '1.5',
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  optionLabel: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    border: '2px solid',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '16px',
  },
  radioInput: {
    marginRight: '12px',
    cursor: 'pointer',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
  },
  navButton: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold' as const,
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    flex: 1,
  },
  previousButton: {
    backgroundColor: '#757575',
    color: 'white',
  },
  nextButton: {
    backgroundColor: '#2196F3',
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  error: {
    color: '#c62828',
    marginBottom: '20px',
  },
};

export default QuizComponent;