export function getOriginFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("originId");
}

export function setOriginInUrl(id: number) {
  const params = new URLSearchParams(window.location.search);
  params.set("originId", String(id));
  window.history.replaceState(null, "", `?${params.toString()}`);
}
