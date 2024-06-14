/** @jsxImportSource frog/jsx */

import { BASE_URL, GH_REPO_URL } from '@/app/consts';
import { Button, Frog, TextInput } from 'frog'
import { handle } from 'frog/vercel'

const app = new Frog({
  basePath: '/api',
  // Supply a Hub API URL to enable frame verification.
  // hubApiUrl: 'https://api.hub.wevm.dev',
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.get('/cast/:hash', async (c) => {
  const hash = c.req.param('hash');
  const apiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY ?? "";
  const response = await fetch(`https://api.neynar.com/v2/farcaster/cast?identifier=${hash}&type=hash`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'api_key': `${apiKey}`
    }
  });
  const json = await response.json();
  return c.json(json);
});

app.frame('/', (c) => {
  return c.res({
    image: (
      <div style={{ color: 'black', backgroundColor: 'white', display: 'flex', margin: 'auto', fontSize: 60 }}>
        <div style={{display: 'flex', flexDirection: 'column', margin: 'auto', alignItems: 'center', gap: 2}}>
          <div>
            🔗 Add "Copy Frame Link" Action
          </div>
          <div style={{fontSize: 40}}>
           Create and view the link of a frame
          </div>
          <div style={{fontSize: 40, marginTop: 20}}>
           Built by dylsteck.eth
          </div>
        </div>
      </div>
    ),
    intents: [
      <Button.AddCastAction action="/copy-frame-link">
        Add
      </Button.AddCastAction>,
    ]
  })
})

app.castAction(
  '/copy-frame-link',
  async (c) => {
    try {
      const { fid, hash } = c.actionData.castId;
      const request = await fetch(`${BASE_URL}/api/cast/${hash}`);
      const json = await request.json();

      if (json && json.cast && json.cast.frames) {
        const frames = json.cast.frames;
        if (Array.isArray(frames) && frames.length > 0) {
          return c.res({
            message: `Click to copy/view frame`,
            link: `${BASE_URL}/frame?url=${frames[0].frames_url}`,
            type: 'message',
          });
        } else {
          return c.res({
            message: 'No frame found on this cast',
            type: 'message',
          });
        }
      } else {
        return c.res({
          message: 'Invalid response from server',
          type: 'message',
        });
      }
    } catch (error) {
      return c.res({
        message: `Error occurred: ${(error as Error).message}`,
        type: 'message',
      });
    }
  },
  {
    aboutUrl: GH_REPO_URL,
    name: "Copy Frame Link",
    description: `Copy and view the link of a frame so you don't lose it`,
    icon: "link-external"
  }
);


export const GET = handle(app)
export const POST = handle(app)
