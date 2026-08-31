/**
 * Category constants for unblocked games catalog
 */
export const GAME_CATEGORIES = [
  'all',
  'arcade',
  'action',
  'puzzle',
  'retro',
  'sports',
  'casual',
  'favorites'
];

/**
 * @typedef {'all' | 'arcade' | 'action' | 'puzzle' | 'retro' | 'sports' | 'casual' | 'favorites'} GameCategory
 * 
 * @typedef {Object} Game
 * @property {string} id
 * @property {string} title
 * @property {string} category
 * @property {string} description
 * @property {string} thumbnail
 * @property {string} [thumbnailBg]
 * @property {'srcdoc' | 'url'} iframeType
 * @property {string} iframeSource
 * @property {string} [author]
 * @property {string[]} controls
 * @property {string} aspectRatio
 * @property {number} rating
 * @property {number} plays
 * @property {string[]} tags
 * @property {string} [releaseDate]
 * @property {boolean} [isCustom]
 * 
 * @typedef {Object} TabCloakPreset
 * @property {string} id
 * @property {string} name
 * @property {string} title
 * @property {string} favicon
 * @property {string} iconName
 */

