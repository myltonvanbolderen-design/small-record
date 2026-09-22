export type EventId = 'panic-room' | 'gambetta-club' | 'fete-de-la-musique'

export interface PresenceEvent {
  id: EventId
  name: string
  date: string
  venue: string
  href: string
}

export interface PresenceEntry {
  eventId: EventId
  photo: { src: string; alt: string; position?: string }
}

export const EVENTS: Record<EventId, PresenceEvent> = {
  'panic-room': {
    id: 'panic-room',
    name: 'Small Party @ Panic Room',
    date: 'Sept 11, 2026',
    venue: 'Panic Room, Paris 11',
    href: '/events/#panic-room',
  },
  'gambetta-club': {
    id: 'gambetta-club',
    name: 'Early Reflections × Small Records',
    date: 'Apr 30, 2026',
    venue: 'Gambetta Club, Paris 20',
    href: '/events/#gambetta-club',
  },
  'fete-de-la-musique': {
    id: 'fete-de-la-musique',
    name: 'Fête de la Musique',
    date: 'June 2025',
    venue: 'Sornettes, Paris',
    href: '/events/#fete-de-la-musique',
  },
}

// To add a new event: add an entry to EVENTS above + an entry at the top of
// each artist's list below, and add a matching `id` on the target section on /events/.
export const PRESENCE: Record<'casae' | 'letche', PresenceEntry[]> = {
  casae: [
    {
      eventId: 'panic-room',
      photo: {
        src: '/images/panic-room/casae-pro.jpg',
        alt: 'Casæ at the decks at Panic Room',
        position: 'object-[65%_center]',
      },
    },
    {
      eventId: 'gambetta-club',
      photo: {
        src: '/images/early-reflection/casae-gambetta.jpg',
        alt: 'Casæ in a Small Records tee at Gambetta Club',
        position: 'object-[50%_30%]',
      },
    },
    {
      eventId: 'fete-de-la-musique',
      photo: {
        src: '/images/fete-musique/casae-live.jpg',
        alt: 'Casæ at the decks at Sornettes',
        position: 'object-[40%_center]',
      },
    },
  ],
  letche: [
    {
      eventId: 'panic-room',
      photo: {
        src: '/images/panic-room/letche-decks.jpg',
        alt: 'Letché at the decks at Panic Room',
        position: 'object-[65%_center]',
      },
    },
    {
      eventId: 'gambetta-club',
      photo: {
        src: '/images/early-reflection/letche-portrait.jpg',
        alt: 'Letché at Gambetta Club',
        position: 'object-[30%_center]',
      },
    },
    {
      eventId: 'fete-de-la-musique',
      photo: {
        src: '/images/fete-musique/duo-sornettes.jpg',
        alt: 'Letché and Casæ at Sornettes',
        position: 'object-[35%_center]',
      },
    },
  ],
}
