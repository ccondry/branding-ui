FROM public.ecr.aws/docker/library/node:22-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM public.ecr.aws/nginx/nginx:mainline-alpine
RUN apk upgrade --no-cache
# copy html, js, css files
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# copy nginx config file
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
