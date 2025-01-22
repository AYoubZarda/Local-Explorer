FROM node:18-alpine


WORKDIR /app_continer

COPY package*.json ./


RUN npm install


COPY . .



EXPOSE 3000


# CMD ["sleep", "infinity"]

CMD ["npm", "run", "dev"]

# RUN npm run build
# CMD ["npm", "run", "preview"]
