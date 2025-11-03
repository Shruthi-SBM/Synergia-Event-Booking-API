const express = require('express');
const app = express();

app.use(express.json());

let events = [];
let bookings = [];
let nextEventId = 1;
let nextBookingId = 1;

// GET all events
app.get('/events', (req, res) => {
  res.json(events);
});

// ADD new event
app.post('/events/add', (req, res) => {
  const { name, date, location } = req.body;
  if (!name || !date || !location) {
    return res.status(400).json({ message: 'All fields (name, date, location) are required' });
  }

  const newEvent = { id: nextEventId++, name, date, location };
  events.push(newEvent);
  res.json({ message: 'Event added successfully', event: newEvent });
});

// GET event by ID
app.get('/event/:id', (req, res) => {
  const event = events.find(e => e.id == req.params.id);
  if (event) res.json(event);
  else res.status(404).json({ message: 'Event not found' });
});

// UPDATE event
app.put('/event/:id', (req, res) => {
  const event = events.find(e => e.id == req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const { name, date, location } = req.body;
  if (name) event.name = name;
  if (date) event.date = date;
  if (location) event.location = location;

  res.json({ message: 'Event updated successfully', event });
});

// DELETE event (and related bookings)
app.delete('/event/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = events.findIndex(e => e.id === id);
  if (index === -1) return res.status(404).json({ message: 'Event not found' });

  const deletedEvent = events.splice(index, 1)[0];
  const removedBookings = bookings.filter(b => b.eventId === id);
  bookings = bookings.filter(b => b.eventId !== id);

  res.json({
    message: 'Event deleted successfully',
    deleted: deletedEvent,
    removedBookings
  });
});

// GET all bookings
app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

// ADD new booking
app.post('/api/bookings', (req, res) => {
  const { participant, eventId } = req.body;
  if (!participant || !eventId) {
    return res.status(400).json({ message: 'Participant and eventId are required' });
  }

  const event = events.find(e => e.id == eventId);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const newBooking = { id: nextBookingId++, participant, eventId };
  bookings.push(newBooking);
  res.json({ message: 'Booking created successfully', booking: newBooking });
});

// GET booking by ID
app.get('/api/bookings/:id', (req, res) => {
  const booking = bookings.find(b => b.id == req.params.id);
  if (booking) res.json(booking);
  else res.status(404).json({ message: 'Booking not found' });
});

// UPDATE booking
app.put('/api/bookings/:id', (req, res) => {
  const booking = bookings.find(b => b.id == req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  const { participant } = req.body;
  if (participant) booking.participant = participant;

  res.json({ message: 'Booking updated successfully', booking });
});

// DELETE booking
app.delete('/api/bookings/:id', (req, res) => {
  const index = bookings.findIndex(b => b.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Booking not found' });

  const deletedBooking = bookings.splice(index, 1)[0];
  res.json({ message: 'Booking cancelled successfully', deleted: deletedBooking });
});

app.listen(3000, () => {
  console.log('Synergia Event Booking API running at http://localhost:3000');
});
