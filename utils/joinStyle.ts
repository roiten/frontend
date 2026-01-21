export default function joinStyles(
  arrayStyles: (string | boolean | null | undefined)[]
): string {
  return arrayStyles
    .filter((cls): cls is string => typeof cls === 'string')
    .join(' ');
}