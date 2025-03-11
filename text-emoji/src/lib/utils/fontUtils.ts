// Font mapping utilities

// Font family mapping
export const fontFamilies = {
    'sans-serif': 'sans-serif',
    'serif': 'serif',
    'monospace': 'monospace',
    'nanum-myeongjo': '"Nanum Myeongjo", serif',
    'song-myung': '"Song Myung", serif'
};

// Function to get the font family from the font ID
export function getFontFamily(fontId: string): string {
    return fontFamilies[fontId as keyof typeof fontFamilies] || 'sans-serif';
} 