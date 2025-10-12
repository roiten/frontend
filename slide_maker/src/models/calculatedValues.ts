export function calculateWidth(width: number) {
    let scaleCof = 0.000825 * width - 0.4;
    if (scaleCof > 0.9) scaleCof = 0.9;
    return scaleCof;
}
