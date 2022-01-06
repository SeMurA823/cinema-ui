FROM node:16-slim
COPY ./ ./
CMD ["npm", "start"]
RUN ["npm", "install"]