import React, {useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { Steps } from 'primereact/steps'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Message } from 'primereact/message'
import { EventWithId } from '../types';


interface UserInfo {
  firstName: string,
  lastName: string,
  email: string
}

interface RegistrationModalProps {
  visible: boolean;
  onClose: () => void;
  event: EventWithId; 
}

export default function RegisterForEventModal({ visible, onClose, event }: RegistrationModalProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo>({ firstName: '', lastName: '', email: '' })

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [isGuest, setIsGuest] = useState(false);
  const [error, setError] = useState('')

  // Steps Configuration
  const steps = [
    { label: 'Login or Guest' },
    { label: 'User Information' },
    { label: 'Confirmation' }
  ];

  const handleLogin = () => {
    // Placeholder for login logic
    if (loginEmail === 'user@example.com' && loginPassword === 'password') {
      // Simulating successful login
      setUserInfo({ firstName: 'John', lastName: 'Doe', email: loginEmail })
      setActiveStep(2)
      setError('')
    } else {
      setError('Invalid credentials')
    }
  }

  const handleContinueAsGuest = () => {
    setIsGuest(true)
    setActiveStep(1)
    setError('')
  }

  const handleUserInfoSubmit = () => {
    if (userInfo.firstName && userInfo.lastName && userInfo.email) {
      setActiveStep(2)
      setError('')
    } else {
      setError('Please fill in all fields.')
    }
  }

  const handleEventRegistrationSubmit = () => {

    const postRegistration = async () => {
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            eventId: event._id
          }),
        });

        if (response.ok) {
          const result = await response.json();
          alert('Successfully registered!');
          onClose();
          // Reset state for next use
          setActiveStep(0)
          setUserInfo({ firstName: '', lastName: '', email: '' })
          setIsGuest(false)
          setLoginEmail('')
          setLoginPassword('')
          setError('')
        } else {
          const errorData = await response.json();
          alert(`Registration failed: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred while registering.');
      }
    }
    postRegistration()
  }

  const renderLoginStep = () => (
    <div className="flex flex-col gap-4">
      <InputText
        placeholder="Email"
        value={loginEmail}
        onChange={(e) => setLoginEmail(e.target.value)}
      />
      <InputText
        type="password"
        placeholder="Password"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
      />
      <Button label="Login" onClick={handleLogin} />
      <Button label="Continue as Guest" onClick={handleContinueAsGuest} className="p-card-button" />
      <div className="flex justify-between">
        <a href="#" className="text-blue-500 hover:underline">Sign Up</a>
      </div>
    </div>
  )

  const renderUserInfoStep = () => (
    <div className="flex flex-col gap-4">
      <InputText
        placeholder="First Name"
        value={userInfo.firstName}
        onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
      />
      <InputText
        placeholder="Last Name"
        value={userInfo.lastName}
        onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
      />
      <InputText
        placeholder="Email"
        value={userInfo.email}
        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
      />
    </div>
  )


  const renderConfirmationStep = () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold">Confirm Details</h3>
      <p><strong>Name:</strong> {userInfo.firstName} {userInfo.firstName} </p>
      <p><strong>Email:</strong> {userInfo.email}</p>
    </div>
  )

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
      if (activeStep === 1 && isGuest) {
        setIsGuest(false)
      }
    }
  }

  // Dialog footer buttons
  const footer = (
    <div className="flex justify-between">
      {activeStep > 0 && <Button label="Back" icon="pi pi-chevron-left" onClick={handleBack} className="p-button-text" />}
      {activeStep === 1 && <Button label="Continue" icon="pi pi-chevron-right" onClick={handleUserInfoSubmit} className="p-button-text" />}
      {activeStep === 2 && <Button label="Submit" icon="pi pi-check" onClick={handleEventRegistrationSubmit} className="p-button-text" />}
    </div>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderLoginStep()
      case 1:
        return renderUserInfoStep()
      case 2:
        return renderConfirmationStep()
      default:
        return null
    }
  }

  return (
    <div>
      <Dialog
        header={`Registration for ${event.title}`}
        visible={visible}
        className="w-11/12 md:w-8/12 lg:w-6/12"
        onHide={onClose}
        footer={footer}
      >
        <div className="card">
          <Steps model={steps} activeIndex={activeStep} />
          <div className="mt-4">
            {error && <Message severity="error" text={error} className="w-full mb-4" />}
            {renderStepContent()}
          </div>
        </div>
      </Dialog>
    </div>

  );


}