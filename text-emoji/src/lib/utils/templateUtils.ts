import type { EmojiTemplate } from '$lib/types/emoji';
import { templates } from '$lib/data/templates';

/**
 * Find a template by ID
 * @param id The template ID to find
 * @returns The template if found, undefined otherwise
 */
export function findTemplateById(id: string): EmojiTemplate | undefined {
  return templates.find((template: EmojiTemplate) => template.id === id);
} 