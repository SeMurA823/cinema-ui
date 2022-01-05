FROM httpd
ARG BUILD_DIR=./build/
COPY ${BUILD_DIR} /usr/local/apache2/htdocs/