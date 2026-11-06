/*
 * 커밋 메시지 규칙 (.claude/rules/commit.md)
 * 형식: `{type}: {한국어 설명}`
 */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // 팀 커밋 type 7개만 허용합니다.
    "type-enum": [2, "always", ["feat", "fix", "chore", "docs", "style", "refactor", "ui"]],
    // 제목은 한국어라 대소문자 규칙이 맞지 않습니다. ("Prettier 포맷 적용"처럼 영어 고유명사로 시작하면 거부됨)
    "subject-case": [0],
  },
};
