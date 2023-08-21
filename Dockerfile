FROM node:18-alpine

# File Author / Maintainer.
LABEL maintainer="Leandro Cassiano <lcassian@akamai.com>"

# Environment variables.
ENV HOME_DIR=/home/consumer
ENV BIN_DIR=${HOME_DIR}/bin
ENV ETC_DIR=${HOME_DIR}/etc
ENV LIBS_DIR=${HOME_DIR}/libs
ENV LOGS_DIR=${HOME_DIR}/logs
ENV NODE_PATH=${LIBS_DIR}

# Create default work structure.
RUN mkdir -p ${HOME_DIR} ${BIN_DIR} ${ETC_DIR} ${LIBS_DIR} ${LOGS_DIR}

# Define default permissions.
RUN addgroup -S consumer && \
    adduser -S consumer -G consumer && \
    chown -R consumer:consumer ${HOME_DIR}

# Define default user.
USER consumer

# Define default work directory.
WORKDIR ${HOME_DIR}

RUN npm install --production

CMD ["node", "main.js"]