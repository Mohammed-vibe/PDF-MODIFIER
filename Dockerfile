# =============================================================================
# PDFCraft Production Dockerfile (Railway Compatible - No Cache)
# =============================================================================

FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Build project
RUN npm run build

# -----------------------------------------------------------------------------

FROM nginx:1.25-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security-headers.conf /etc/nginx/security-headers.conf

COPY --from=builder /app/out /website/pdfcraft

RUN if [ -d /website/pdfcraft/libreoffice-wasm ]; then \
    cd /website/pdfcraft/libreoffice-wasm && \
    for f in *.gz; do \
    [ -f "$f" ] && gunzip -k "$f" || true; \
    done; \
    fi

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
