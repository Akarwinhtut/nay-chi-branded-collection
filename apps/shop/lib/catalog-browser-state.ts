"use client";

import { useSyncExternalStore } from "react";

const BROWSER_STATE_EVENT = "catalog-browser-state-change";
const WISHLIST_KEY = "shop-wishlist";
const RECENTLY_VIEWED_KEY = "shop-recently-viewed";

type BrowserStateKey = typeof WISHLIST_KEY | typeof RECENTLY_VIEWED_KEY;

function readSnapshot(key: BrowserStateKey) {
  if (typeof window === "undefined") {
    return "[]";
  }

  try {
    return window.localStorage.getItem(key) ?? "[]";
  } catch {
    return "[]";
  }
}

function parseSnapshot(snapshot: string) {
  try {
    const parsed = JSON.parse(snapshot) as unknown;

    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [] as string[];
  }
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleChange = () => onStoreChange();

  window.addEventListener("storage", handleChange);
  window.addEventListener(BROWSER_STATE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(BROWSER_STATE_EVENT, handleChange);
  };
}

function emitChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(BROWSER_STATE_EVENT));
}

function writeList(key: BrowserStateKey, nextItems: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(nextItems));
    emitChange();
  } catch {}
}

function useStoredSlugs(key: BrowserStateKey) {
  const snapshot = useSyncExternalStore(subscribe, () => readSnapshot(key), () => "[]");
  return parseSnapshot(snapshot);
}

export function useWishlistSlugs() {
  return useStoredSlugs(WISHLIST_KEY);
}

export function useRecentlyViewedSlugs() {
  return useStoredSlugs(RECENTLY_VIEWED_KEY);
}

export function toggleWishlistSlug(slug: string) {
  const current = parseSnapshot(readSnapshot(WISHLIST_KEY));
  const next = current.includes(slug)
    ? current.filter((item) => item !== slug)
    : [slug, ...current.filter((item) => item !== slug)].slice(0, 48);

  writeList(WISHLIST_KEY, next);
}

export function pushRecentlyViewedSlug(slug: string) {
  const current = parseSnapshot(readSnapshot(RECENTLY_VIEWED_KEY));
  const next = [slug, ...current.filter((item) => item !== slug)].slice(0, 8);

  writeList(RECENTLY_VIEWED_KEY, next);
}
