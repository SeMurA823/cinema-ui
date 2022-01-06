FROM node:16-slim
COPY ./ ./
CMD ["npm", "install"]
CMD ["npm","run","start"]