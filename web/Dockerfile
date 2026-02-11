FROM node:24-alpine

WORKDIR /app

# Install dependencies needed for node-gyp
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package files
COPY package.json package-lock.json* ./

# Install with increased timeout
RUN npm ci --fetch-timeout=600000 --fetch-retries=5

# Copy source
COPY . .

# Set env
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build
RUN npm run build

EXPOSE 3000

ENV PORT=3000

CMD ["npm", "start"]