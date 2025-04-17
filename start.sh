echo "🛑 Stopping API and static webserver (if running)..."
pkill -f api/index.js

if [ -f db/my.db ]; then
  echo "🗑️ Old database found, removing it..."
  rm db/my.db
fi

echo "🛠️ Generating new database from create.sql and saving to my.db..."
sqlite3 db/my.db < db/create.sql

echo "🚀 Starting API and static webserver..."
node api/index.js
