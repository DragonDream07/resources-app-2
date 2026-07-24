import React from 'react';
import PropTypes from 'prop-types';

const STEPS = [
  { key: 'address', label: 'Address' },
  { key: 'payment', label: 'Payment' },
  { key: 'review', label: 'Review' },
];

function CheckoutStepper({ currentStep }) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <nav aria-label="Checkout steps" className="checkout-stepper">
      <ol className="checkout-stepper__list">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;

          let statusClass = 'checkout-stepper__step--upcoming';
          if (isCompleted) statusClass = 'checkout-stepper__step--completed';
          if (isActive) statusClass = 'checkout-stepper__step--active';

          return (
            <li
              key={step.key}
              className={`checkout-stepper__step ${statusClass}`}
              aria-current={isActive ? 'step' : undefined}
            >
              <span className="checkout-stepper__indicator">
                {isCompleted ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="checkout-stepper__check-icon"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    width={16}
                    height={16}
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="checkout-stepper__step-number" aria-hidden="true">
                    {index + 1}
                  </span>
                )}
              </span>
              <span className="checkout-stepper__label">{step.label}</span>
              {index < STEPS.length - 1 && (
                <span
                  className={`checkout-stepper__connector ${
                    isCompleted ? 'checkout-stepper__connector--filled' : ''
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>

      <style>{`
        .checkout-stepper {
          width: 100%;
          padding: 1rem 0;
        }
        .checkout-stepper__list {
          display: flex;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 0;
        }
        .checkout-stepper__step {
          display: flex;
          align-items: center;
          flex: 1;
          position: relative;
        }
        .checkout-stepper__step:last-child {
          flex: 0 0 auto;
        }
        .checkout-stepper__indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 0.875rem;
          font-weight: 600;
          flex-shrink: 0;
          border: 2px solid #d1d5db;
          background: #ffffff;
          color: #6b7280;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .checkout-stepper__step--active .checkout-stepper__indicator {
          border-color: #2563eb;
          background: #2563eb;
          color: #ffffff;
        }
        .checkout-stepper__step--completed .checkout-stepper__indicator {
          border-color: #16a34a;
          background: #16a34a;
          color: #ffffff;
        }
        .checkout-stepper__check-icon {
          display: block;
        }
        .checkout-stepper__label {
          margin-left: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
          white-space: nowrap;
        }
        .checkout-stepper__step--active .checkout-stepper__label {
          color: #2563eb;
          font-weight: 600;
        }
        .checkout-stepper__step--completed .checkout-stepper__label {
          color: #16a34a;
        }
        .checkout-stepper__connector {
          flex: 1;
          height: 2px;
          background: #d1d5db;
          margin: 0 0.75rem;
          transition: background 0.2s;
        }
        .checkout-stepper__connector--filled {
          background: #16a34a;
        }
      `}</style>
    </nav>
  );
}

CheckoutStepper.propTypes = {
  currentStep: PropTypes.oneOf(['address', 'payment', 'review']).isRequired,
};

export default CheckoutStepper;
