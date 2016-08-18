FROM nginx:1.10.1-alpine

COPY nginx.conf /etc/nginx/nginx.conf

RUN apk add --no-cache nodejs tzdata && \
	apk add --no-cache make gcc g++ python && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo "Asia/Shanghai" > /etc/timezone && \
    apk del tzdata

COPY dist/package.json /tmp/package.json

RUN cd /tmp && npm install --production && npm install pm2 request -g && \
    mkdir -p /opt/workdir && mv /tmp/node_modules /opt/workdir/

WORKDIR /opt/workdir
COPY dist/ /opt/workdir

EXPOSE 80

RUN nginx

CMD ["npm", "start"]
