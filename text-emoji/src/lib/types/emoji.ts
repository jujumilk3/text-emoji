/**
 * Types related to emoji generation and management
 */

export interface EmojiTemplate {
	id: string;
	name: string;
	text: string;
	font: string;
	textColor: string;
	backgroundColor: string;
	fontSize: number;
	padding: number;
	horizontalAlign: string;
	verticalAlign: string;
	showGradient: boolean;
	gradientColor?: string;
	gradientDirection?: string;
	textShadow?: boolean;
	textShadowColor?: string;
	textShadowBlur?: number;
	textShadowOffsetX?: number;
	textShadowOffsetY?: number;
	textBorder?: boolean;
	textBorderColor?: string;
	textBorderWidth?: number;
	textGlow?: boolean;
	textGlowColor?: string;
	textGlowBlur?: number;
	// Animation properties
	animationEnabled?: boolean;
	animationType?: string;
	animationDuration?: number;
	animationDelay?: number;
	animationLoop?: boolean;
	animationDirection?: string;
}

export interface SavedEmoji extends EmojiTemplate {
	timestamp: number;
	imageData?: string;
} 