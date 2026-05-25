#!/bin/bash
# generate-ssl.sh
# Buat self-signed SSL certificate untuk development/staging
# Untuk production, gunakan Let's Encrypt (certbot)

set -e

SSL_DIR="./ssl"
KEY_FILE="$SSL_DIR/key.pem"
CERT_FILE="$SSL_DIR/cert.pem"

echo "🔐 Generating SSL certificates..."

# Buat direktori ssl jika belum ada
mkdir -p "$SSL_DIR"

# Generate self-signed certificate (valid 365 hari)
openssl req -x509 -newkey rsa:4096 -keyout "$KEY_FILE" -out "$CERT_FILE" \
  -days 365 -nodes \
  -subj "/C=ID/ST=Jakarta/L=Jakarta/O=FoodWasteApp/OU=Dev/CN=localhost"

echo ""
echo "✅ SSL certificates generated!"
echo "   Key:  $KEY_FILE"
echo "   Cert: $CERT_FILE"
echo ""
echo "⚠️  CATATAN:"
echo "   - Certificate ini self-signed, hanya untuk development."
echo "   - Untuk production, gunakan Let's Encrypt:"
echo "     sudo certbot certonly --standalone -d yourdomain.com"
echo "     Lalu set SSL_KEY_PATH dan SSL_CERT_PATH di .env"
