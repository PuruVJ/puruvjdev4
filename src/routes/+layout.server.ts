export const load = ({ cookies }) => {
  // Strongly cache for CDN(1y), and for browser(1d). Stale while revalidate for both
  // setHeaders({
  //   'Cache-Control': 'public, max-age=31536000, s-maxage=86400, stale-while-revalidate=86400',
  // });

  return {
    theme: cookies.get('theme'),
  };
};
