#!/bin/bash

# --- Configurações ---
APACHE_PORT=80
LINKS_FILE="$HOME/Desktop/links_granja.txt"
RCLONE_DEST="links_granja:/LinksGranja"

# --- Inicia Apache ---

sudo systemctl start apache2
sleep 2  # espera o Apache iniciar

# --- Mata ngrok existente ---
NGROK_PIDS=$(pgrep ngrok)
if [ ! -z "$NGROK_PIDS" ]; then
    kill -9 $NGROK_PIDS
    sleep 2
fi

# --- Inicia ngrok na porta do Apache ---
ngrok http $APACHE_PORT --region=us > /dev/null &
NGROK_PID=$!

# --- Espera ngrok iniciar e captura URL ---
echo "⏳ Aguardando ngrok criar túnel..."
NGROK_URL=""
while [ -z "$NGROK_URL" ] || [ "$NGROK_URL" == "null" ]; do
    sleep 1
    NGROK_URL=$(curl -s http://127.0.0.1:4040/api/tunnels | jq -r '.tunnels[0].public_url')
done


echo "=== Links públicos via ngrok ==="
echo "URL raiz do ngrok: $NGROK_URL"
echo "Site Granja: $NGROK_URL/granja"
echo "Adminer: $NGROK_URL/adminer"
echo "API Node: $NGROK_URL/api"

# --- Salva links em arquivo ---
echo -e "banco:<$NGROK_URL/adminer> \ngranja:<$NGROK_URL/granja> \napi:<$NGROK_URL/api>" > $LINKS_FILE

# --- Copia via rclone ---
rclone copy $LINKS_FILE $RCLONE_DEST -v

