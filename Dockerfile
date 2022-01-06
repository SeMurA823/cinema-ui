FROM node:16-slim
COPY ./ ./
RUN ["npm", "install"]
CMD ["npm","run","start"]