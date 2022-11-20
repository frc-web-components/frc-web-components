/**
 * Copyright (c) 2017-2018 FIRST
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of FIRST nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY FIRST AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY NONINFRINGEMENT AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL FIRST OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * A utility class for generating curved arrows. The generated arrows follow a <i>circular</i>, rather than
 * <i>elliptical</i>, path. The heads of the arrows are always the same isosceles triangle with the length of the base
 * equalling the height of the triangle; this works out to be (approximately) a 63-63-54 triangle.
 */

function toDegrees(radians) {
  return (radians * 180) / Math.PI;
}

function line(x1, y1, x2, y2) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
}

function triangle(point1, point2, point3) {
  return `<polygon 
            points="${point1.x},${point1.y} ${point2.x},${point2.y} ${point3.x},${point3.y}" />`;
}

function arc(x, y, radius, startAngle, endAngle) {
  return `<path d="${describeArc(x, y, radius, startAngle, endAngle)}"/>`;
}

// https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY - radius * Math.sin(angleInRadians),
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  var sweepFlag = endAngle > startAngle ? 1 : 0;

  var d = [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    sweepFlag,
    end.x,
    end.y,
  ].join(' ');

  return d;
}

/**
 * Creates a straight arrow, which is just a curved arrow with an infinite radius.
 *
 * @param length   the length of the arrow
 * @param angle    the angle of the arrow, in radians
 * @param xOffset  how much to offset the arrow along the X-axis
 * @param headSize the length of the head of the arrow
 */
export function createStraight(length, angle, xOffset, headSize) {
  const x = Math.cos(angle) * length;
  const y = Math.sin(angle) * length;
  const body = line(xOffset, 0, x + xOffset, y);
  const head = straightHead(angle, headSize, xOffset, length);
  return body + head;
}

/**
 * Creates a new curved arrow.
 *
 * @param startAngle the starting angle of the arc, in radians
 * @param radius     the radius of the arrow. Must be non-negative.
 * @param length     the length of the arrow, in the same units as {@code radius}
 * @param xOffset    how much to offset the arc along the X-axis
 * @param headSize   the length of the head of the arrow
 *
 * @return a curved arrow shape
 *
 * @throws IllegalArgumentException if {@code radius} or {@code headSize} are negative
 */
export function create(startAngle, radius, length, xOffset, headSize) {
  if (radius < 0) {
    throw new Error('Radius cannot be negative. Given: ' + radius);
  }
  if (headSize < 0) {
    throw new Error(
      'The size of the arrowhead cannot be negative. Given: ' + headSize
    );
  }
  if (radius === Infinity) {
    // infinite radius = straight
    return createStraight(length, startAngle, xOffset, headSize);
  }

  return (
    makeBody(startAngle, radius, length, xOffset) +
    curvedHead(startAngle, headSize, radius, xOffset, length)
  );
}

/**
 * Creates a new curved arrow. This is equivalent to calling
 * {@link #create create(startAngle, radius, radius * sweepAngle, xOffset, headSize)}.
 *
 * @param startAngle the starting angle of the arc, in radians
 * @param radius     the radius of the arc
 * @param sweepAngle the sweep of the arc, in radians
 * @param xOffset    how much to offset the arc along the X-axis
 * @param headSize   the length of the head of the arrow
 *
 * @throws IllegalArgumentException if {@code radius} or {@code headSize} are negative
 */
export function createPolar(startAngle, radius, sweepAngle, xOffset, headSize) {
  return create(startAngle, radius, radius * sweepAngle, xOffset, headSize);
}

/**
 * Generates the body arc of the arrow.
 *
 * @param startAngle the starting angle of the arc, in radians
 * @param radius     the radius of the arc
 * @param length     the length of the arc, in the same unit as {@code radius}
 * @param xOffset    how much to offset the arc along the X-axis
 */
export function makeBody(startAngle, radius, length, xOffset) {
  const angRad = length / radius; // Isn't math nice?
  const angle = toDegrees(angRad);
  return arc(
    xOffset,
    0,
    radius,
    toDegrees(startAngle),
    toDegrees(startAngle) - angle
  );
}

/**
 * Generates the head of a straight arrow.
 */
export function straightHead(startAngle, size, xOffset, bodyLength) {
  const base = size / 2;

  // Unit vector to the end of the shaft
  const ux = Math.cos(startAngle);
  const uy = Math.sin(startAngle);

  // Unit vector to the center of the base of the head
  let bx = Math.cos(startAngle + Math.PI / 2) * base; // ==  Math.sin(startAngle)
  let by = Math.sin(startAngle + Math.PI / 2) * base; // == -Math.cos(startAngle)

  const basePoint1 = {
    x: ux * bodyLength - bx + xOffset,
    y: uy * bodyLength - by,
  };

  const basePoint2 = {
    x: ux * bodyLength + bx + xOffset,
    y: uy * bodyLength + by,
  };

  const tip = {
    x: ux * (size + bodyLength) + xOffset,
    y: uy * (size + bodyLength),
  };

  return triangle(basePoint1, basePoint2, tip);
}

/**
 * Generates the head of a curved arrow.
 *
 * @param startAngle the starting angle of the arc, in radians
 * @param size       the length of the arrow head
 * @param arcRadius  the radius of the arc of the arrow
 * @param arcLength  the length of the arc of the arrow
 */
export function curvedHead(startAngle, size, arcRadius, xOffset, arcLength) {
  // Half the length of the triangle
  const base = size / 2;

  // Angle to the base of the arrow
  const angleToBase = arcLength / arcRadius - startAngle;

  // Radius to the tip of the arrow. Simple Pythagorean theorem
  const tipRadius = Math.sqrt(size * size + arcRadius * arcRadius);

  // Angle to the tip of the arrow
  // If the length is negative, the tip is closer to the start of the arc and therefore needs to be
  // (arcLength - size) / arcRadius - startAngle
  // If the length is positive, the tip is further from the start of the arc is is therefore
  // (arcLength + size) / arcRadius - startAngle
  // These are combined into a single calculating by multiplying `size` by the sign of the arc length
  const angleToTip =
    (arcLength + size * Math.sign(arcLength)) / arcRadius - startAngle;

  const ux = Math.cos(angleToBase); // unit X in (-1, 1)
  const uy = Math.sin(angleToBase); // unit Y in (-1, 1)

  // Note there's no "top" or "bottom" point, since it depends on the sign of uy
  const basePoint1 = {
    x: (arcRadius + base) * ux + xOffset,
    y: (arcRadius + base) * uy,
  };

  const basePoint2 = {
    x: (arcRadius - base) * ux + xOffset,
    y: (arcRadius - base) * uy,
  };

  const tipPoint = {
    x: tipRadius * Math.cos(angleToTip) + xOffset,
    y: tipRadius * Math.sin(angleToTip),
  };

  return triangle(basePoint1, tipPoint, basePoint2);
}
