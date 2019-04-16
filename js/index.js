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
 * The reason for using lists is in case I expand it to more dimensions
 */
