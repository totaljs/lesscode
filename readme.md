# LessCode

The Total.js LessCode app uses the Total.js Flow engine for quickly creating API endpoints. Run, code and release.

__Requirements__:

- Total.js `v5`
- Node.js `+v19`

## Good to know

- FlowStream files must be generated manually and stored in `/databases/flowstreams/{name|id}.flow`
- FlowStream identifier is taken from the filename. E.g., `registration.flow`, identifier is `registration`
- How to edit FlowStream? Visit <http://127.0.0.1:8000/flowstreams/?token=YOUR_TOKEN_GENERATED_BY_THE_APP>
- FlowStreams are part of the main thread (Flow worker is disabled)

## Installation

The app will show you access to the Flow editor in the terminal/command-line output.

__Manual installation__:

- install the Node.js platform (+v19) (https://nodejs.org)
- download `LessCode` source code
- open the `LessCode` directory in the terminal or command-line
- run `npm install` (once)
- run `npm start` (runs app)

__Docker Hub__:

```bash
docker pull totalplatform/lesscode
docker run -p 8000:8000 totalplatform/lesscode
````

__Docker Compose__:

```bash
git clone https://github.com/totaljs/lesscode.git
cd lesscode
docker compose up
````

## Contact

- Contact <https://www.totaljs.com/contact/>
- [Join to __Total.js Telegram__](https://t.me/totalplatform)