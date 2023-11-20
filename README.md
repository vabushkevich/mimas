<p align="center"><img src="https://github.com/vabushkevich/mimas/assets/23465488/fac30f01-7bc5-49b9-a2eb-43887a27f4e4" width="839" alt="Screenshots of the app"></p>

[mimas](https://mimas.vercel.app) is an open source web client that allows you
to experience a simplified and efficient way to connect with the Reddit
community. Vote, comment, and browse all your favorite subreddits with ease.

## Self-hosted usage

Besides using mimas by visiting [mimas.vercel.app](https://mimas.vercel.app) you
can run the app on your computer locally.

### Prerequisites

Before starting, you should have installed [git](https://git-scm.com),
[Node.js](https://nodejs.org) (>=14.21.3), and npm.

### How to start

First you have to get a Client ID by registering your own Reddit application:

1. Go to [https://www.reddit.com/prefs/apps](https://www.reddit.com/prefs/apps).
2. Click the "are you a developer? create an app..." button at the bottom of the
   page.
3. Enter any suitable app name in the "name" field.
4. Check the "installed app" option.
5. Fill in the "redirect uri" field with the value `http://localhost:4777/auth`.
6. Click to the "create app" button.
7. You will see the Client ID on top of the created app card under the app name
   (an alphanumeric string about 20 characters long).

Then clone this repository to your computer:

```shell
git clone https://github.com/vabushkevich/mimas.git
```

Go to the downloaded folder and install all required dependencies:

```shell
cd mimas
npm install
```

Copy the `.env.example` file to `.env`:

```shell
cp .env.example .env
```

Edit the `.env` file: replace `client_id_of_your_reddit_app` with the Client ID
you got in the first step.

Run the following command to compile required files and to start the web server:

```shell
npm start
```

Wait for the message "Serving!...".

Open `http://localhost:4777` in your web browser.

## Developing

Follow the same steps as in the "Self-hosted usage" section, but instead of
executing `npm start` in the last step, run the following command to start the
development server:

```shell
npm run dev
```

Wait for the message "webpack compiled successfully..." and then open
`http://localhost:4777` in your web browser.
