/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function buildFrameUrl(params: {
  basePath: string;
  filePrefix: string;
  frameNumber: number;
  padLength: number;
  format: string;
}): string {
  const padded = String(params.frameNumber).padStart(params.padLength, '0');
  const basePathClean = params.basePath.endsWith('/') 
    ? params.basePath.slice(0, -1) 
    : params.basePath;
  return `${basePathClean}/${params.filePrefix}${padded}.${params.format}`;
}
