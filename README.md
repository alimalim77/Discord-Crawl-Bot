# Project
Discord Authentication cum Role assignment Bot  

## Overview
This bot automatically assigns roles to users based on predefined data (e.g., Discord username or tag) stored in a database or spreadsheet. This helps streamline the verification process and ensures that users are granted access to specific channels automatically.

## Problem
Currently, when someone joins the server:
1. They join the server getting automatically authenticated if they are part of organization
2. Members are assigned roles as per the presence of roles in the spreadsheet/database.

## Solution
Automate the role assignment based on predefined user data:
1. A user joins the server.
3. The bot checks the user's Discord username or email against a pre-filled database or spreadsheet.
4. If a match is found, the bot automatically assigns the "member" role.
5. Rest of the roles present in the database or pre-approved sheet are also assigned

## Features
- **Automatic Role Assignment**: Assigns roles based on predefined user data.
- **Database Integration**: Supports MongoDB or Google Sheets for storing user data.
- **Easy Setup and Configuration**: Minimal configuration required to get started.

## Prerequisites
- A Discord bot token
- MongoDB database or Google Sheets API credentials
- Node.js installed on your machine

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/alimalim77/discord-crawl-bot
   cd role-assignment-bot
