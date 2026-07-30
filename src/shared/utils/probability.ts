// 백엔드는 확률을 0~1 분수로 준다(예: 0.270). 화면은 %로 표시한다.
export function probabilityAsPercent(probability: number) {
  return probability <= 1 ? probability * 100 : probability;
}
