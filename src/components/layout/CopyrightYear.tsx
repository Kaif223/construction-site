/**
 * Reading the clock during prerender is not allowed with Cache Components, so
 * the year is computed inside a cache scope and refreshed with each deploy.
 */
export async function CopyrightYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}
