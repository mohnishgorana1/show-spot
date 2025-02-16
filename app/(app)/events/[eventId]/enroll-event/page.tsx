import React from 'react'

function EnrollEventPage({ params }: { params: { eventId: string } }) {
  const eventId = params.eventId;

  return (
    <div>EnrollEventPage {eventId}</div>
  )
}

export default EnrollEventPage