import RegisterEventForm from '@/components/RegisterEventForm'
import React from 'react'

// Only accessible by Organiser; if not organiser then a button to become an organiser 
// Form to enter details & confirm booking.
// Payment option (if event is paid).
// Success confirmation after registration.


function RegisterEventPage() {
  return (
    <main>
      <RegisterEventForm />
    </main>
  )
}

export default RegisterEventPage