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
      <div style={{ color: 'black', display: 'flex', margin: 'auto', fontSize: 60 }}>
        🔗 Add "Copy Frame Link" Action
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
  async(c) => {
    const { fid, hash } = c.actionData.castId;
    const request = await fetch(`${BASE_URL}/api/cast/${hash}`);
    const json = await request.json();
    const frames = json.cast.frames;
    const res = frames.length > 0 ? 
    c.res({
      message: `Frame copied: ${frames[0].frames_url}`,
      link: frames[0].frames_url,
      type: 'message',
    }) : 
    c.res({
      message: 'No frame found on this cast',
      type: 'message',
    });
    return res;
  }, 
  { aboutUrl: GH_REPO_URL, name: "Copy Frame Link", description: 'Copy the link of the frame to your clipboard', icon: "link-external" });

export const GET = handle(app)
export const POST = handle(app)
