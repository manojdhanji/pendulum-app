FROM nginx:alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy ONLY the files needed for your static site
COPY index.html /usr/share/nginx/html/

COPY styles/ /usr/share/nginx/html/styles/
COPY src/ /usr/share/nginx/html/src/
COPY assets/ /usr/share/nginx/html/assets/

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

