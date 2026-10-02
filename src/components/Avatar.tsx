import { avatar } from '../data/content'

/*
 * Avatar slot. Renders Jay's photo once he provides one; until then it shows an
 * initials monogram rather than a stock face or an invented picture.
 */
export default function Avatar({ size = 72 }: { size?: number }) {
  if (avatar.photo !== '') {
    return (
      <img
        src={avatar.photo}
        alt={avatar.alt}
        width={size}
        height={size}
        loading="eager"
        decoding="async"
        className="shrink-0 border border-line object-cover"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <span
      className="mono-avatar shrink-0"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
      role="img"
      aria-label={`${avatar.alt} - initials placeholder, no photo uploaded yet`}
    >
      {avatar.initials}
    </span>
  )
}