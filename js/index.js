/**
 * Every object has the structure:
 * object {
 *   mass: float,
 *   radius: float,
 *   velocity: [x, y],
 *   force: [x, y],
 *   coord: [x, y],
 *   lastTimeUpdated: Int (Date.now())
 *   float  ::= 64-bit Floating Point number
 *   [x, y] ::= 2-tuple
 * }
 *
 * The reason for using lists is for adding the possibility to expanding it to more dimensions
 */
