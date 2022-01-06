FROM node:16-slim
COPY ./ ./
RUN ["npm","start"]