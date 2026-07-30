import { Linking } from 'react-native';

export type LinkKind = 'url' | 'email' | 'tel';

export type OpenLinkResult = { ok: true } | { ok: false; message: string };

function isWellFormedHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validates and opens a link (http/https URL, email, or phone number), surfacing a
 * human-readable message on failure instead of throwing or failing silently.
 */
export async function openExternalLink(value: string, kind: LinkKind = 'url'): Promise<OpenLinkResult> {
  if (kind === 'url' && !isWellFormedHttpUrl(value)) {
    return { ok: false, message: 'This link looks invalid and can’t be opened.' };
  }

  const target = kind === 'email' ? `mailto:${value}` : kind === 'tel' ? `tel:${value}` : value;

  try {
    const canOpen = await Linking.canOpenURL(target);
    if (!canOpen) {
      return { ok: false, message: 'This link can’t be opened on your device.' };
    }
    await Linking.openURL(target);
    return { ok: true };
  } catch (err) {
    console.error('Failed to open link:', err);
    return { ok: false, message: 'Something went wrong opening this link.' };
  }
}
