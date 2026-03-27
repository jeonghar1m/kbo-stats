/**
 * KBO API TV_IF 필드값 → 사용자 표시 레이블 매핑
 *
 * API는 TV_IF를 콤마 구분 문자열로 내려주며, kbo-game 패키지에서 split(",")으로 배열화됨.
 * 알 수 없는 키가 올 경우 getBroadcastLabel()에서 원본 문자열을 그대로 반환.
 */
export const BROADCAST_SERVICE_LABELS: Record<string, string> = {
  SPOTV: "SPOTV",
  SPOTV2: "SPOTV2",
  "SPOTV NOW": "SPOTV NOW",
  "KBS N Sports": "KBS N 스포츠",
  "MBC SPORTS+": "MBC 스포츠+",
  "SBS Sports": "SBS 스포츠",
  티빙: "티빙",
  네이버: "네이버 스포츠",
};

/**
 * API 원본 키를 사용자 표시 레이블로 변환한다.
 * 매핑에 없는 값은 원본 문자열을 그대로 반환한다.
 */
export function getBroadcastLabel(key: string): string {
  return BROADCAST_SERVICE_LABELS[key.trim()] ?? key.trim();
}
