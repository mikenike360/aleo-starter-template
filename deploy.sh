#!/bin/bash

NETWORK="testnet"
PROGRAM_DIR="program"

if [ -f .env ]; then
    echo "📄 Loading environment variables..."
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "⚠️  Warning: .env file not found. Ensure PRIVATE_KEY is set in your shell."
fi

echo "🚀 Starting deployment of ShadowVote..."

if [ -d "$PROGRAM_DIR" ]; then
    cd "$PROGRAM_DIR"
else
    echo "❌ Error: Directory '$PROGRAM_DIR' not found."
    exit 1
fi

echo "🛠 Building the contract..."
leo build
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "🌐 Deploying to $NETWORK network..."
leo deploy --network testnet --endpoint https://api.explorer.provable.com/v2 --broadcast --save "./deploy_tx" --print || {
    echo -e "${RED}❌ Failed to deploy"
    exit 1
}

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
else
    echo "❌ Deployment failed. Please check your private key, network connection, and credit balance."
    exit 1
fi

# Optional: Add your custom initialize transaction below if needed:
# echo "🎬 Initializing the contract..."
# leo execute initialize \
#     --network testnet \
#     --endpoint https://api.explorer.provable.com/v2 \
#     --broadcast || {
#     echo -e "${RED}❌ Failed to initialize contract${NC}"
#     exit 1
# }