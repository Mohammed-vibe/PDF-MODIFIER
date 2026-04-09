# =============================================================================
# PDFCraft Production Dockerfile
# Multi-stage build for optimized image size
# Compatible with Railway (fixed cache mounts)
# =============================================================================

# syntax=docker/dockerfile:1

# -----------------------------------------------------------------------------
# Stage 1: Build the Next.js static export
# -----------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first
COPY package.json package-lock.json ./

RUN --mount=type=cache,id=cache-npm,target=/root/.npm \
    npm ci --ignore-scripts

# Copy source code
COPY . .

# Build the static export
RUN --mount=type=cache,id=cache-npm,target=/root/.npm \
    --mount=type=cache,id=cache-next,target=/app/.next/cache \
    npm run build

# -----------------------------------------------------------------------------
# Stage 2: Serve with Nginx
# -----------------------------------------------------------------------------
FROM nginx:1.25-alpine AS production

# Metadata
LABEL org.opencontainers.image.source="https://github.com/PDFCraftTool/pdfcraft"
LABEL org.opencontainers.image.description="PDFCraft - Professional PDF Tools"
LABEL org.opencontainers.image.licenses="AGPL-3.0"

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security-headers.conf /etc/nginx/security-headers.conf

# Copy build output
COPY --from=builder /app/out /website/pdfcraft

# Fix WASM gzip files
RUN if [ -d /website/pdfcraft/libreoffice-wasm ]; then \
    cd /website/pdfcraft/libreoffice-wasm && \
    for f in *.gz; do \
    [ -f "$f" ] && gunzip -k "$f" || true; \
    done; \
    fi

# Expose port
EXPOSE 80

# Start server
CMD ["nginx", "-g", "daemon off;"]
