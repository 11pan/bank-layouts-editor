
# Set up osrs-db-tools
git clone https://github.com/Dynrothe/osrs-db-tools.git
cd osrs-db-tools
npm install

# Copy the existing item database
cp ../data/item-db.json ./item-db.json

# Download the latest item definitions dump
URL=`curl -s "https://api.github.com/repos/abextm/osrs-cache/releases" | jq -r '[.[] | select(.prerelease == false) | .assets[] | select(.name | endswith(".tar.gz") and startswith("dump-"))][0].browser_download_url'`
DATE=`echo $URL | grep -oP '(?<=dump-)[0-9]{4}-[0-9]{2}-[0-9]{2}(?=-rev)'`
wget $URL -O dump.tar.gz

# Extract item definitions
tar -zxf dump.tar.gz dump/item_defs/
mv dump/item_defs ./item_defs

# Update the item database
node ./itemDatabase.js --update
node ./itemDatabase.js --iconsFromRunelite

mv ./item-db.json ../data/item-db.json
cd ..

git stage data/item-db.json
git config --local user.email "41898282+github-actions[bot]@users.noreply.github.com"
git config --local user.name "github-actions[bot]"
git commit -m "Update item-db to $DATE"