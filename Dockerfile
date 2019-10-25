FROM node:10.12

RUN mkdir -p /nginx_dist
RUN mkdir -p /weichat_admin
WORKDIR /weichat_admin
ADD . /weichat_admin/


RUN npm install

RUN npm run build:pro


RUN cp -rf /weichat_admin/dist/* /nginx_dist/
