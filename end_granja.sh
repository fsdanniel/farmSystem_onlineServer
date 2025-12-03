#!/bin/bash

LINK_FILE="/home/rovatsug/Desktop/links_granja.txt"

# ----------------------------
# 1. Verifica se ngrok está rodando
# ----------------------------
NGROK_PID=$(pgrep ngrok)

if [ -n "$NGROK_PID" ]; then
    echo "ngrok está rodando (PID: $NGROK_PID). Encerrando..."
    pkill ngrok
    echo "ngrok encerrado."
else
    echo "ngrok não está rodando."
fi

# ----------------------------
# 2. Verifica se Node.js está rodando
# ----------------------------
NODE_PID=$(pgrep -f "server.js")

if [ -n "$NODE_PID" ]; then
    echo "Node.js está rodando (PID: $NODE_PID). Encerrando..."
    pkill -f "server.js"
    echo "Node.js encerrado."
else
    echo "Node.js não está rodando."
fi

# ----------------------------
# 3. Verifica se Apache está rodando
# ----------------------------
APACHE_STATUS=$(systemctl is-active apache2)

if [ "$APACHE_STATUS" = "active" ]; then
    echo "Apache está rodando. Parando..."
    sudo systemctl stop apache2
    echo "Apache parado."
else
    echo "Apache não está rodando."
fi

# ----------------------------
# 4. Atualiza arquivo de links
# ----------------------------
echo "indisponível" > "$LINK_FILE"

# ----------------------------
# 5. Envia arquivo via rclone
# ----------------------------
rclone copy "$LINK_FILE" links_granja:/LinksGranja -v

echo "Todos os serviços encerrados e links atualizados."

