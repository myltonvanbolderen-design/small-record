export interface FilmFrame {
  num: string
  src: string
  fogged: boolean
  pick: boolean
  caption: string
}

const ORDER = [
  '04', '05', '07', '08', '09', '10', '12', '13', '14', '15', '16',
  '17', '18', '19', '22', '23', '24', '25', '26', '27', '28', '29',
]

const FOGGED = new Set(['05', '13', '18', '26', '29'])
const PICKS = new Set(['08', '10', '14', '16', '25'])

const PICK_CAPTIONS: Record<string, string> = {
  '08': 'The crowd, early',
  '10': 'Casæ & Letché at the decks',
  '14': 'Letché & Casæ',
  '16': 'Faces in the crowd',
  '25': 'The crew',
}

function captionFor(num: string): string {
  if (FOGGED.has(num)) return 'Fogged frame'
  if (PICKS.has(num)) return PICK_CAPTIONS[num]
  return `Frame ${num}`
}

export const FILM_FRAMES: FilmFrame[] = ORDER.map((num) => ({
  num,
  src: `/images/panic-room/film/${num}.jpg`,
  fogged: FOGGED.has(num),
  pick: PICKS.has(num),
  caption: captionFor(num),
}))

export const FILM_PICKS: FilmFrame[] = FILM_FRAMES.filter((f) => f.pick)
