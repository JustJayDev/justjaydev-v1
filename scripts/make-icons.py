"""
Generates the PWA icons as real PNGs (no Pillow in this env, so the PNG
chunks are written directly with zlib).

Design matches the site mark: dark panel, cyan border, "JJ" monogram.
Run: python3 scripts/make-icons.py
"""
import struct, zlib, os

OUT = 'public'
BG = (0x0D, 0x14, 0x1D)
FG = (0x22, 0xD3, 0xEE)
LINE = (0x1A, 0x24, 0x32)


def png(width, height, pixels):
    """pixels: list of rows, each row a list of (r,g,b) tuples."""
    raw = b''
    for row in pixels:
        raw += b'\x00' + b''.join(struct.pack('BBB', *p) for p in row)

    def chunk(tag, data):
        c = struct.pack('>I', len(data)) + tag + data
        return c + struct.pack('>I', zlib.crc32(tag + data) & 0xFFFFFFFF)

    return (
        b'\x89PNG\r\n\x1a\n'
        + chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0))
        + chunk(b'IDAT', zlib.compress(raw, 9))
        + chunk(b'IEND', b'')
    )


def draw(size, maskable=False):
    """Draw the JJ mark. maskable keeps art inside the 80% safe zone."""
    rows = []
    pad = int(size * (0.20 if maskable else 0.06))
    inset = int(size * (0.12 if maskable else 0.05))
    radius = max(1, int(size * 0.10))
    # glyph block (two J shapes) as filled rectangles
    top = int(size * (0.34 if maskable else 0.28))
    bottom = int(size * (0.70 if maskable else 0.64))
    bar = max(2, int(size * 0.075))
    left = int(size * (0.30 if maskable else 0.24))
    gap = int(size * 0.10)

    def in_border(x, y):
        return inset <= x < size - inset and inset <= y < size - inset

    def in_border_ring(x, y):
        if not in_border(x, y):
            return False
        edge = (
            x < inset + bar or x >= size - inset - bar
            or y < inset + bar or y >= size - inset - bar
        )
        return edge

    def in_corner(x, y):
        # small corner brackets in the accent colour
        bl = int(bar * 1.4)
        near_x = x < inset + bl or x >= size - inset - bl
        near_y = y < inset + bl or y >= size - inset - bl
        return in_border(x, y) and near_x and near_y

    def in_glyph(x, y):
        if not (top <= y < bottom):
            return False
        for i in (0, 1):
            x0 = left + i * (bar + gap)
            # vertical stem
            if x0 <= x < x0 + bar:
                return True
            # foot of the J
            fy0 = bottom - max(1, int((bottom - top) * 0.22))
            if fy0 <= y < bottom and x0 - bar <= x < x0 + bar:
                return True
        return False

    for y in range(size):
        row = []
        for x in range(size):
            # rounded corner test
            cx = min(max(x, radius), size - radius)
            cy = min(max(y, radius), size - radius)
            if (x - cx) ** 2 + (y - cy) ** 2 > radius * radius and (
                x < radius or x >= size - radius
            ) and (y < radius or y >= size - radius):
                row.append((0x07, 0x0B, 0x10))
                continue
            if in_glyph(x, y) or in_corner(x, y):
                row.append(FG)
            elif in_border_ring(x, y):
                row.append(LINE)
            else:
                row.append(BG)
        rows.append(row)
    return rows


targets = [
    ('icon-192.png', 192, False),
    ('icon-512.png', 512, False),
    ('icon-maskable-512.png', 512, True),
    ('apple-touch-icon.png', 180, False),
    ('favicon-32.png', 32, False),
]

for name, size, maskable in targets:
    data = png(size, size, draw(size, maskable))
    path = os.path.join(OUT, name)
    with open(path, 'wb') as f:
        f.write(data)
    print('wrote', path, len(data), 'bytes', size, 'x', size, 'maskable' if maskable else '')