FROM node:16-slim
COPY ./ ./
CMD ["npm", "install", "react-scripts"]
CMD ["npm", "install"]
CMD ["npm","start"]