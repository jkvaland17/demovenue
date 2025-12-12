# Telling Docker to use the node:20-alpine image as the base image for the container.
FROM node:20-alpine

# Telling Docker to create a directory called `app` in the container and set it as the working directory.
WORKDIR /app

# Copying all the files from the root of the project to the `app` directory in the container.
COPY . .

# Telling Docker to build the image `npm run build`.
RUN npm install && npm run build

# Install Nginx and Supervisor
RUN apk add nginx supervisor

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/http.d/default.conf

# Copy the supervisor configuration file
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Telling Docker that the container will listen on port 3000.
EXPOSE 80

# Telling Docker to run the `npm start` command when the container is started.
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
#CMD ["npm", "run", "start"]
