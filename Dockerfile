FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_GOOGLE_API_KEY
ARG GEMINI_API_KEY
ARG VITE_GEMINI_API_KEY
ARG VITE_DEV_MODE_SECRET_KEY

ENV VITE_GOOGLE_API_KEY=$VITE_GOOGLE_API_KEY
ENV GEMINI_API_KEY=$GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY
ENV VITE_DEV_MODE_SECRET_KEY=$VITE_DEV_MODE_SECRET_KEY

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve@14
COPY --from=builder /app/dist/public ./public

EXPOSE 5000
CMD ["serve", "-s", "public", "-l", "5000"]
