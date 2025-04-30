# Base on offical NGINX Alpine image
FROM nginx:alpine

# Remove any existing config files
RUN rm /etc/nginx/conf.d/*

# Create cache directory and set permissions
RUN mkdir -p /var/cache/nginx/cache \
    && chown -R nginx:nginx /var/cache/nginx/cache \
    && chmod -R 700 /var/cache/nginx/cache

# Copy config files
# *.conf files in conf.d/ dir get included in main config
# COPY ./conf.d/default.conf /etc/nginx/conf.d/

# Expose the listening port
EXPOSE 80

# Launch NGINX
CMD [ "nginx", "-g", "daemon off;" ]