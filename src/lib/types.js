/**
 * @typedef {Object} Item
 * @property {string} q - The question text
 * @property {string} a - The answer text
 * @property {string[]} [wrong] - Optional array of wrong answers
 */

/**
 * @typedef {Object} GameResult
 * @property {number} score - The score achieved
 * @property {number} total - The total number of questions
 */

/**
 * @typedef {Object} GameProps
 * @property {Item[]} items - The array of items/questions
 * @property {function(GameResult): void} onFinish - Callback when game finishes
 */

/**
 * @typedef {Object} ActivityDTO
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {string} subject
 * @property {string} emoji
 * @property {string} color
 * @property {string} template
 * @property {Item[]} items
 * @property {boolean} isPublic
 * @property {boolean} isFavorite
 * @property {number} plays
 * @property {number|null} folderId
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {number} ownerId
 * @property {string} [ownerName]
 * @property {string} [ownerAvatar]
 */

/**
 * @typedef {Object} FolderDTO
 * @property {number} id
 * @property {string} name
 * @property {string} emoji
 * @property {string} color
 */

/**
 * @typedef {Object} ResultDTO
 * @property {number} id
 * @property {number} activityId
 * @property {string} [activityTitle]
 * @property {string} [activityEmoji]
 * @property {string} playerName
 * @property {string} template
 * @property {number} score
 * @property {number} total
 * @property {number} durationSec
 * @property {string} createdAt
 */

/**
 * @typedef {Object} UserDTO
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {string} avatar
 * @property {string} role
 */