import type { EmojiTemplate } from '$lib/types/emoji';

/**
 * Serializes emoji template data to URL parameters
 * @param template The emoji template to serialize
 * @returns URL query string with encoded template data
 */
export function serializeEmojiToUrl(template: EmojiTemplate): string {
  const params = new URLSearchParams();
  
  // Add basic properties
  params.set('text', template.text);
  params.set('font', template.font);
  params.set('textColor', template.textColor.replace('#', ''));
  params.set('bgColor', template.backgroundColor.replace('#', ''));
  params.set('fontSize', template.fontSize.toString());
  params.set('padding', (template.padding ?? 10).toString());
  params.set('hAlign', template.horizontalAlign);
  params.set('vAlign', template.verticalAlign);
  
  // Add gradient properties if enabled
  if (template.showGradient) {
    params.set('gradient', '1');
    if (template.gradientColor) {
      params.set('gradColor', template.gradientColor.replace('#', ''));
    }
    if (template.gradientDirection) {
      params.set('gradDir', template.gradientDirection);
    }
  }
  
  // Add text shadow properties if enabled
  if (template.textShadow) {
    params.set('shadow', '1');
    if (template.textShadowColor) {
      params.set('shadowColor', template.textShadowColor.replace('#', ''));
    }
    if (template.textShadowBlur) {
      params.set('shadowBlur', template.textShadowBlur.toString());
    }
    if (template.textShadowOffsetX) {
      params.set('shadowX', template.textShadowOffsetX.toString());
    }
    if (template.textShadowOffsetY) {
      params.set('shadowY', template.textShadowOffsetY.toString());
    }
  }
  
  // Add text border properties if enabled
  if (template.textBorder) {
    params.set('border', '1');
    if (template.textBorderColor) {
      params.set('borderColor', template.textBorderColor.replace('#', ''));
    }
    if (template.textBorderWidth) {
      params.set('borderWidth', template.textBorderWidth.toString());
    }
  }
  
  // Add text glow properties if enabled
  if (template.textGlow) {
    params.set('glow', '1');
    if (template.textGlowColor) {
      params.set('glowColor', template.textGlowColor.replace('#', ''));
    }
    if (template.textGlowBlur) {
      params.set('glowBlur', template.textGlowBlur.toString());
    }
  }
  
  // Add animation properties if enabled
  if (template.animationEnabled) {
    params.set('anim', '1');
    if (template.animationType) {
      params.set('animType', template.animationType);
    }
    if (template.animationDuration) {
      params.set('animDur', template.animationDuration.toString());
    }
    if (template.animationDelay) {
      params.set('animDelay', template.animationDelay.toString());
    }
    if (template.animationLoop !== undefined) {
      params.set('animLoop', template.animationLoop ? '1' : '0');
    }
    if (template.animationDirection) {
      params.set('animDir', template.animationDirection);
    }
  }
  
  return params.toString();
}

/**
 * Parses URL parameters into emoji template data
 * @param url The URL or URLSearchParams object to parse
 * @returns Partial emoji template data from URL parameters
 */
export function parseUrlToEmoji(url: URL | URLSearchParams): Partial<EmojiTemplate> {
  const params = url instanceof URL ? url.searchParams : url;
  const template: Partial<EmojiTemplate> = {
    id: `url-template-${Date.now()}`,
    name: 'URL Template'
  };
  
  // Parse basic properties
  if (params.has('text')) template.text = params.get('text') ?? '';
  if (params.has('font')) template.font = params.get('font') ?? 'sans-serif';
  if (params.has('textColor')) template.textColor = `#${params.get('textColor') ?? '000000'}`;
  if (params.has('bgColor')) template.backgroundColor = `#${params.get('bgColor') ?? 'ffffff'}`;
  if (params.has('fontSize')) template.fontSize = parseInt(params.get('fontSize') ?? '32', 10);
  if (params.has('padding')) template.padding = parseInt(params.get('padding') ?? '10', 10);
  if (params.has('hAlign')) template.horizontalAlign = params.get('hAlign') ?? 'center';
  if (params.has('vAlign')) template.verticalAlign = params.get('vAlign') ?? 'middle';
  
  // Parse gradient properties
  if (params.has('gradient')) {
    template.showGradient = params.get('gradient') === '1';
    if (template.showGradient) {
      if (params.has('gradColor')) template.gradientColor = `#${params.get('gradColor') ?? 'e0f2fe'}`;
      if (params.has('gradDir')) template.gradientDirection = params.get('gradDir') ?? 'to-right';
    }
  } else {
    template.showGradient = false;
  }
  
  // Parse text shadow properties
  if (params.has('shadow')) {
    template.textShadow = params.get('shadow') === '1';
    if (template.textShadow) {
      if (params.has('shadowColor')) template.textShadowColor = `#${params.get('shadowColor') ?? '000000'}`;
      if (params.has('shadowBlur')) template.textShadowBlur = parseInt(params.get('shadowBlur') ?? '4', 10);
      if (params.has('shadowX')) template.textShadowOffsetX = parseInt(params.get('shadowX') ?? '2', 10);
      if (params.has('shadowY')) template.textShadowOffsetY = parseInt(params.get('shadowY') ?? '2', 10);
    }
  } else {
    template.textShadow = false;
  }
  
  // Parse text border properties
  if (params.has('border')) {
    template.textBorder = params.get('border') === '1';
    if (template.textBorder) {
      if (params.has('borderColor')) template.textBorderColor = `#${params.get('borderColor') ?? '000000'}`;
      if (params.has('borderWidth')) template.textBorderWidth = parseInt(params.get('borderWidth') ?? '2', 10);
    }
  } else {
    template.textBorder = false;
  }
  
  // Parse text glow properties
  if (params.has('glow')) {
    template.textGlow = params.get('glow') === '1';
    if (template.textGlow) {
      if (params.has('glowColor')) template.textGlowColor = `#${params.get('glowColor') ?? 'ff9900'}`;
      if (params.has('glowBlur')) template.textGlowBlur = parseInt(params.get('glowBlur') ?? '10', 10);
    }
  } else {
    template.textGlow = false;
  }
  
  // Parse animation properties
  if (params.has('anim')) {
    template.animationEnabled = params.get('anim') === '1';
    if (template.animationEnabled) {
      if (params.has('animType')) template.animationType = params.get('animType') ?? 'none';
      if (params.has('animDur')) template.animationDuration = parseInt(params.get('animDur') ?? '1000', 10);
      if (params.has('animDelay')) template.animationDelay = parseInt(params.get('animDelay') ?? '0', 10);
      if (params.has('animLoop')) template.animationLoop = params.get('animLoop') === '1';
      if (params.has('animDir')) template.animationDirection = params.get('animDir') ?? 'normal';
    }
  } else {
    template.animationEnabled = false;
  }
  
  return template;
}

/**
 * Generates a shareable URL for the current emoji template
 * @param template The emoji template to share
 * @returns Full URL string that can be shared
 */
export function generateShareableUrl(template: EmojiTemplate): string {
  const baseUrl = window.location.origin;
  const basePath = '/text-emoji';
  const queryString = serializeEmojiToUrl(template);
  return `${baseUrl}${basePath}/?${queryString}`;
}

/**
 * Copies a shareable URL to the clipboard
 * @param template The emoji template to share
 * @returns Promise that resolves when the URL is copied
 */
export async function copyShareableUrl(template: EmojiTemplate): Promise<void> {
  const url = generateShareableUrl(template);
  try {
    await navigator.clipboard.writeText(url);
    return Promise.resolve();
  } catch (error) {
    console.error('Failed to copy URL to clipboard:', error);
    return Promise.reject(error);
  }
} 