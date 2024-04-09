import { json } from '@sveltejs/kit';

export async function POST({ cookies, request }) {
  const formdata = await request.formData();
  const theme = formdata.get('theme');

  cookies.set('theme', theme.toString() ?? 'light', { expires: new Date('2038-01-19'), path: '/' });

  return json({ theme });
}
