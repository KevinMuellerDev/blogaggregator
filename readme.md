# Blog Aggregator CLI

## Overview

**Gator** is a command-line tool for managing users and RSS feeds in a blog aggregator application.

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/blogaggregator.git
cd blogaggregator
npm install
```

## Usage

Run the CLI using Node.js:

```bash
node index.js <command> [options]
```

### Available Commands

- `add-user <username>`  
   Adds a new user to the aggregator.

- `remove-user <username>`  
   Removes an existing user.

- `list-users`  
   Lists all users.

- `add-feed <feed-url> [username]`  
   Adds an RSS feed to the aggregator, optionally for a specific user.

- `remove-feed <feed-url> [username]`  
   Removes an RSS feed, optionally for a specific user.

- `list-feeds [username]`  
   Lists all RSS feeds, optionally for a specific user.

### Example

```bash
node index.js add-user alice
node index.js add-feed https://example.com/rss alice
node index.js list-feeds alice
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT
