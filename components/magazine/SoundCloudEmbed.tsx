interface SoundCloudEmbedProps {
  url: string
  height?: number
  title?: string
}

export function SoundCloudEmbed({ url, height = 166, title = 'SoundCloud player' }: SoundCloudEmbedProps) {
  const src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23C4622D&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`

  return (
    <iframe
      width="100%"
      height={height}
      scrolling="no"
      frameBorder="no"
      allow="autoplay"
      loading="lazy"
      src={src}
      className="opacity-90 transition-opacity hover:opacity-100"
      title={title}
    />
  )
}
