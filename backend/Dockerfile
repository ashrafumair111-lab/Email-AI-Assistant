# ---------- deps ----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---------- runtime ----------
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

# /data holds the persistent email-log volume — create it with node ownership
# BEFORE switching to the non-root user, so the mounted volume is writable
RUN mkdir -p /data && chown node:node /data

# Run as non-root user (node user ships with the base image)
USER node

COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json ./
COPY --chown=node:node server.js groq.js ai-email.js mailer.js verify-auth.js ./
# Legacy static UI (still served by express.static as a fallback)
COPY --chown=node:node public ./public

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
