FROM node:18-alpine

WORKDIR /app

# Sadece dependencies kurmak için package.json ve package-lock.json (varsa) kopyala
COPY package*.json ./

# DevDependencies (Electron vb.) kurma, sadece production bağımlılıkları kopyala
RUN npm install --omit=dev

# Tüm kaynak kodunu kopyala
COPY . .

# Çıktı ve veri saklama klasörleri (Volume mount için)
RUN mkdir -p /app/data

# Veri klasörü olarak /app/data ayarlanıyor
ENV DATA_DIR=/app/data
ENV PORT=3000

# Port tanımla
EXPOSE 3000

# Server başlat
CMD ["npm", "run", "server"]
